from fastapi import FastAPI, Query
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware import Middleware
from typing import List, Optional

import traceback
import json

from pikachu.chem.structure import Structure
from pikachu.reactions.functional_groups import find_bonds
from pikachu.general import structure_to_smiles, svg_string_from_structure

from raichu.data.molecular_moieties import PEPTIDE_BOND, CC_DOUBLE_BOND
from raichu.run_raichu import (
    get_tailoring_sites_atom_names,
    ModuleRepresentation,
    DomainRepresentation,
    ClusterRepresentation,
    TailoringRepresentation,
    build_cluster,
    CleavageSiteRepresentation,
    MacrocyclizationRepresentation,
)
from raichu.reactions.chain_release import find_all_o_n_atoms_for_cyclization
from raichu.drawing.drawer import RaichuDrawer
from raichu.cluster.ripp_cluster import RiPPCluster
from raichu.cluster.modular_cluster import ModularCluster
from raichu.cluster.terpene_cluster import TerpeneCluster
from raichu.tailoring_enzymes import TailoringEnzyme

# FastAPI app setup
app = FastAPI()
origins = ["http://localhost:3000", "localhost:3000"]
middleware = [Middleware(CORSMiddleware, allow_origins=origins)]
app = FastAPI(middleware=middleware)
app.mount("/static", StaticFiles(directory="app"), name="static")


def get_drawings(cluster):
    drawings, widths = cluster.get_spaghettis()
    svg_strings = []
    for i, drawing in enumerate(drawings):
        max_x = 0
        min_x = 100000000
        max_y = 0
        min_y = 100000000
        drawing.set_structure_id(f"s{i}")
        padding = 0
        drawing.options.padding = 0
        carrier_domain_pos = None
        svg_style = drawing.svg_style
        for atom in drawing.structure.graph:
            if atom.annotations.domain_type:
                carrier_domain_pos = atom.draw.position
                atom.draw.positioned = False
                sulphur_pos = atom.get_neighbour("S").draw.position
            if atom.draw.positioned:
                if atom.draw.position.x < min_x:
                    min_x = atom.draw.position.x
                if atom.draw.position.y < min_y:
                    min_y = atom.draw.position.y
                if atom.draw.position.x > max_x:
                    max_x = atom.draw.position.x
                if atom.draw.position.y > max_y:
                    max_y = atom.draw.position.y
        assert carrier_domain_pos
        x1 = 0
        x2 = max_x + padding
        y1 = padding
        y2 = max_y + padding
        width = x2
        height = y2
        svg_style = r" <style> line {stroke: black; stroke_width: 1px;} </style> "
        svg_header = f"""<svg width="{width}" height="{height}" viewBox="{x1} {y1} {x2} {y2}" xmlns="http://www.w3.org/2000/svg">\n {svg_style}\n"""
        squiggly_svg = f'<path d="M {sulphur_pos.x} {sulphur_pos.y - 5} Q {sulphur_pos.x - 5} {sulphur_pos.y - (sulphur_pos.y - 5 - carrier_domain_pos.y)/2}, {carrier_domain_pos.x} {sulphur_pos.y - 5 - (sulphur_pos.y - 5 - carrier_domain_pos.y)/2} T {carrier_domain_pos.x} {carrier_domain_pos.y}" stroke="grey" fill="white"/>'
        svg = (
            f"{svg_header}{drawing.draw_svg()}{squiggly_svg}".replace("\n", "")
            .replace('"', "'")
            .replace("<svg", " <svg id='intermediate_drawing'")
        )
        svg_strings.append(
            [svg, carrier_domain_pos.x, carrier_domain_pos.y, width, height]
        )

    return svg_strings


def format_cluster(
    raw_cluster: List, tailoring_reactions: TailoringRepresentation
) -> ClusterRepresentation:
    formatted_modules = []
    for module in raw_cluster:
        formatted_domains = []
        for domain in module[3]:
            # Format fake booleans
            domain = map(lambda x: x if x != "None" else None, domain)
            domain = map(lambda x: x if x != "True" else True, domain)
            domain = map(lambda x: x if x != "False" else False, domain)
            formatted_domains += [DomainRepresentation(*domain)]
        formatted_modules += [
            ModuleRepresentation(
                module[0],
                None if module[1] == "None" else module[1],
                module[2],
                formatted_domains,
            )
        ]
    return ClusterRepresentation(formatted_modules, tailoring_reactions)


@app.get("/")
async def root():
    return {
        "message": "This is the first Version of the Alola Api for integrating Alola into the web",
        "input": "antismash output file",
        "state": "state of dropdown-menus, if none== default",
        "output": "SVGs for intermediates+ SVG of final product",
    }


@app.get("/api/alola/nrps_pks/")
async def alola_nrps_pks(antismash_input: str):
    """
    Process input data from antismash for NRPS/PKS analysis.
    :param antismash_input: JSON string containing antismash data.
    :return: Dictionary containing SVG representations, SMILES strings, and other molecular data.
    """
    try:
        assert antismash_input, "Input data is required."

        # Decode the JSON input
        input_data = json.loads(antismash_input)

        # Extract and convert tailoring enzymes
        tailoring_reactions = [
            TailoringRepresentation(*enzyme) for enzyme in input_data["tailoring"]
        ]

        # Format cluster data and handle fake booleans
        raichu_input = format_cluster(
            input_data["clusterRepresentation"], tailoring_reactions
        )

        # Initialize and compute cluster structures
        cluster = build_cluster(raichu_input, strict=False)
        cluster.compute_structures(compute_cyclic_products=False)

        # Perform tailoring and cyclization if applicable
        cluster.do_tailoring()
        tailored_product = cluster.chain_intermediate.deepcopy()
        cyclization = input_data["cyclization"]
        final_product = perform_cyclization(cyclization, tailored_product, cluster)

        # Prepare data for response
        response_data = prepare_response_data(cluster, final_product, tailored_product)

        return response_data

    except Exception as e:
        # Log and return error information
        return log_error(e)


def perform_cyclization(cyclization, tailored_product, cluster):
    """
    Perform cyclization on the tailored product if specified.
    :param cyclization: Cyclization data.
    :param tailored_product: The tailored product from the cluster.
    :param cluster: The cluster object.
    :return: Final product after cyclization.
    """
    if cyclization != "None":
        atom_cyclization = next(
            (
                atom
                for atom in tailored_product.atoms.values()
                if str(atom) == cyclization
            ),
            None,
        )
        if not atom_cyclization:
            raise ValueError(f"Atom {cyclization} for cyclization does not exist.")

        cluster.cyclise(atom_cyclization)
        return cluster.cyclic_product

    return cluster.chain_intermediate


def prepare_response_data(cluster, final_product, tailored_product):
    """
    Prepare the response data including SVG strings and molecular information.
    :param cluster: The cluster object.
    :param final_product: The final product after processing.
    :param tailored_product: The tailored product from the cluster.
    :return: A dictionary containing the response data.
    """
    smiles = structure_to_smiles(final_product, kekule=False)
    atoms_for_cyclisation = [
        str(atom)
        for atom in find_all_o_n_atoms_for_cyclization(tailored_product)
        if str(atom) != "O_0"
    ]

    structure_for_tailoring = RaichuDrawer(
        tailored_product, dont_show=True, add_url=True, make_linear=False
    )
    structure_for_tailoring.draw_structure()

    svg_structure_for_tailoring = format_svg(
        structure_for_tailoring.save_svg_string()
    ).replace("<svg", " <svg id='tailoring_drawing'")
    svg_final = format_svg(svg_string_from_structure(final_product)).replace(
        "<svg", " <svg id='final_drawing'"
    )

    return {
        "svg": svg_final,
        "hangingSvg": get_drawings(cluster),
        "smiles": smiles,
        "atomsForCyclisation": str(atoms_for_cyclisation),
        "tailoringSites": str(get_tailoring_sites_atom_names(tailored_product)),
        "completeClusterSvg": cluster.draw_cluster(),
        "structureForTailoring": svg_structure_for_tailoring,
    }


def format_svg(svg_string):
    """
    Format an SVG string for display.
    :param svg_string: The raw SVG string.
    :return: Formatted SVG string.
    """
    return svg_string.replace("\n", "").replace('"', "'")


def log_error(exception):
    """
    Log the exception and extract relevant information for the response.
    :param exception: The caught exception.
    :return: Dictionary with error information.
    """
    tb = traceback.extract_tb(exception.__traceback__)
    exc_type = type(exception).__name__
    filename, lineno, _, _ = tb[-1]
    print(f"{exc_type} occurred at {filename}:{lineno}")
    return {
        "Error": "The Cluster is not biosynthetically correct, try removing domains to include only complete modules or changing the order of proteins."
    }


@app.get("/api/alola/ripp/")
async def alola_ripp(antismash_input: str):
    try:
        assert antismash_input
        # handle input data
        antismash_input_transformed = json.loads(antismash_input)
        tailoringReactions = []
        macrocyclisations = []
        amino_acid_sequence = antismash_input_transformed["rippPrecursor"]
        gene_name_precursor = antismash_input_transformed["rippPrecursorName"]
        full_amino_acid_sequence = antismash_input_transformed["rippFullPrecursor"]
        if antismash_input_transformed["cyclization"] != "None":
            for cyclization in antismash_input_transformed["cyclization"]:
                if len(cyclization) > 0:
                    macrocyclisations += [MacrocyclizationRepresentation(*cyclization)]
        for enzyme in antismash_input_transformed["tailoring"]:
            if len(enzyme) > 0:
                tailoringReactions += [TailoringRepresentation(*enzyme)]
        ripp_cluster = RiPPCluster(
            gene_name_precursor,
            full_amino_acid_sequence,
            amino_acid_sequence,
            macrocyclisations=macrocyclisations,
            tailoring_representations=tailoringReactions,
        )
        ripp_cluster.make_peptide()
        peptide_svg = (
            ripp_cluster.draw_cluster(fold=10, size=7, as_string=True)
            .replace("\n", "")
            .replace('"', "'")
            .replace("<svg", " <svg id='precursor_drawing'")
        )
        if len(tailoringReactions) > 0:
            ripp_cluster.do_tailoring()
            tailored_product = ripp_cluster.tailored_product
        else:
            tailored_product = ripp_cluster.linear_product
        tailoring_sites = get_tailoring_sites_atom_names(
            ripp_cluster.chain_intermediate
        )
        svg_structure_for_tailoring = (
            ripp_cluster.draw_cluster(fold=10, size=7, as_string=True)
            .replace("\n", "")
            .replace('"', "'")
            .replace("<svg", " <svg id='intermediate_drawing'")
        )
        if len(macrocyclisations) > 0:
            ripp_cluster.do_macrocyclization()
        cyclised_product_svg = (
            ripp_cluster.draw_cluster(fold=5, size=7, as_string=True)
            .replace("\n", "")
            .replace('"', "'")
            .replace("<svg", " <svg id='cyclised_drawing'")
        )
        cleaved_ripp_svg = (
            ripp_cluster.draw_product(as_string=True)
            .replace("\n", "")
            .replace('"', "'")
            .replace("<svg", " <svg id='final_drawing'")
        )

        final_product = ripp_cluster.chain_intermediate
        smiles = structure_to_smiles(final_product, kekule=False)
        atoms_for_cyclisation = str(
            [
                str(atom)
                for atom in find_all_o_n_atoms_for_cyclization(tailored_product)
                if str(atom) != "O_0"
            ]
        )
        amino_acids = []
        for index, aa in enumerate(amino_acid_sequence):
            amino_acids += [aa.upper() + str(index)]
        amino_acids = str(amino_acids)
        return {
            "svg": cleaved_ripp_svg,
            "smiles": smiles,
            "atomsForCyclisation": atoms_for_cyclisation,
            "tailoringSites": str(tailoring_sites),
            "rawPeptideChain": peptide_svg,
            "cyclisedStructure": cyclised_product_svg,
            "aminoAcidsForCleavage": amino_acids,
            "structureForTailoring": svg_structure_for_tailoring,
        }

    except Exception as e:
        tb = traceback.extract_tb(e.__traceback__)
        exc_type = type(e).__name__
        filename, lineno, _, _ = tb[-1]
        print(f"{exc_type} occurred at {filename}:{lineno}")
        return {"Error": "An error occured, try selecting a different precursor."}


@app.get("/api/alola/terpene/")
async def alola_terpene(antismash_input: str):
    try:
        assert antismash_input
        # handle input data
        antismash_input_transformed = json.loads(antismash_input)
        tailoringReactions = []
        macrocyclisations = []
        precursor = antismash_input_transformed["substrate"]
        gene_name_terpene_synthase = antismash_input_transformed["gene_name_precursor"]
        terpene_cyclase_type = antismash_input_transformed["terpene_cyclase_type"]
        if antismash_input_transformed["cyclization"] != "None":
            for cyclization in antismash_input_transformed["cyclization"]:
                if len(cyclization) > 0:
                    macrocyclisations.append(
                        MacrocyclizationRepresentation(cyclization[0], cyclization[1])
                    )
        for enzyme in antismash_input_transformed["tailoring"]:
            if len(enzyme) > 0:
                tailoringReactions.append(TailoringRepresentation(*enzyme))
        terpene_cluster = TerpeneCluster(
            gene_name_terpene_synthase,
            precursor,
            macrocyclisations=macrocyclisations,
            cyclase_type=terpene_cyclase_type,
            tailoring_representations=tailoringReactions,
        )
        terpene_cluster.create_precursor()
        precursor_svg = (
            terpene_cluster.draw_product(as_string=True)
            .replace("\n", "")
            .replace('"', "'")
            .replace("<svg", " <svg id='precursor_drawing'")
        )
        if len(macrocyclisations) > 0:
            terpene_cluster.do_macrocyclization()
        cyclised_product_svg = (
            terpene_cluster.draw_product(as_string=True)
            .replace("\n", "")
            .replace('"', "'")
            .replace("<svg", " <svg id='cyclized_drawing'")
        )
        # get options for cyclisation
        cyclase = TailoringEnzyme("gene", "OXIDATIVE_BOND_FORMATION")
        atoms_for_cyclisation = str(
            [
                str(atom[0])
                for atom in cyclase.get_possible_sites(
                    terpene_cluster.chain_intermediate
                )
                if str(atom[0]) != "O_0"
            ]
        )
        if len(tailoringReactions) > 0:
            terpene_cluster.do_tailoring()
        svg_final_product_raw = terpene_cluster.draw_product(as_string=True)
        svg_tailoring = (
            svg_final_product_raw.replace("\n", "")
            .replace('"', "'")
            .replace("<svg", " <svg id='intermediate_drawing'")
        )
        svg_final_product = (
            terpene_cluster.draw_product(as_string=True)
            .replace("\n", "")
            .replace('"', "'")
            .replace("<svg", " <svg id='final_drawing'")
        )
        smiles = structure_to_smiles(terpene_cluster.chain_intermediate, kekule=False)
        tailoring_sites = get_tailoring_sites_atom_names(
            terpene_cluster.chain_intermediate
        )
        return {
            "svg": svg_final_product,
            "smiles": smiles,
            "atomsForCyclisation": atoms_for_cyclisation,
            "tailoringSites": str(tailoring_sites),
            "precursor": precursor_svg,
            "cyclizedStructure": cyclised_product_svg,
            "structureForTailoring": svg_tailoring,
        }

    except Exception as e:
        tb = traceback.extract_tb(e.__traceback__)
        exc_type = type(e).__name__
        filename, lineno, _, _ = tb[-1]
        print(f"{exc_type} occurred at {filename}:{lineno}")
        return {"Error": "An error occured, try selecting a different precursor."}
