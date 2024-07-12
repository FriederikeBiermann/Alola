from fastapi import FastAPI, Query
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware import Middleware
from typing import List, Optional

import traceback
import logging
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

logging.basicConfig(level=logging.INFO, filemode="w", format="%(asctime)s - %(levelname)s - %(message)s")

logging.debug("debug")
logging.info("info")
logging.warning("warning")
logging.error("error")
logging.critical("critical")

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
            TailoringRepresentation(*enzyme) for enzyme in input_data["tailoring"]]

        # Format cluster data and handle fake booleans
        raichu_input = format_cluster(
            input_data["clusterRepresentation"], tailoring_reactions)

        logging.info(f"The input_data is: {input_data}")
        logging.info(f"The tailoring_reactions are: {tailoring_reactions}")
        logging.info(f"The raichu_input is: {raichu_input}")

        # Initialize and compute cluster structures
        cluster = build_cluster(raichu_input, strict=False)
        cluster.compute_structures(compute_cyclic_products=False)

        # Perform tailoring and cyclization if applicable
        cluster.do_tailoring()
        tailored_product = cluster.chain_intermediate.deepcopy()
        cyclization = input_data["cyclization"]
        final_product = perform_cyclization_nrps_pks(
            cyclization, tailored_product, cluster)

        # Prepare data for response
        response_data = prepare_response_data_nrps_pks(
            cluster, final_product, tailored_product)

        return response_data

    except Exception as e:
        # Log and return error information
        return log_error_nrps_pks(e)


def perform_cyclization_nrps_pks(cyclization, tailored_product, cluster):
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


def prepare_response_data_nrps_pks(cluster, final_product, tailored_product):
    """
    Prepare the response data including SVG strings and molecular information.
    :param cluster: The cluster object.
    :param final_product: The final product after processing.
    :param tailored_product: The tailored product from the cluster.
    :return: A dictionary containing the response data.
    """
    
    atoms_for_cyclisation = [
        str(atom)
        for atom in find_all_o_n_atoms_for_cyclization(tailored_product)
        if str(atom) != "O_0"
    ]

    structure_for_tailoring = RaichuDrawer(
        tailored_product, dont_show=True, add_url=True, make_linear=False
    )
    structure_for_tailoring.draw_structure()
    svg_structure_for_tailoring = process_svg(
        structure_for_tailoring.get_svg_string_matplotlib(), "tailoring_drawing"
    )
    svg_final = process_svg(svg_string_from_structure(final_product), "final_drawing")
    mass = final_product.get_mass()
    reactions = []
    if cluster.tailoring_representations:
        reactions.append("tailoring")
    if cluster.macrocyclisation_representations:
        reactions.append("cyclisation")
    if cluster.cleaved_intermediates:
        reactions.append("cleavage")
    if cluster.tailoring_representations:
        pathway_svg = cluster.draw_pathway(order=reactions, as_string=True)
    else:
        pathway_svg = "not_able_to_draw_pathway"
    try:
        smiles = structure_to_smiles(final_product, kekule=False)
    except:
        smiles = "not_able_to_compute_smiles"
    return {
        "svg": svg_final,
        "hangingSvg": get_drawings(cluster),
        "smiles": smiles,
        "mass": mass,
        "pathway_svg": pathway_svg,
        "atomsForCyclisation": str(atoms_for_cyclisation),
        "tailoringSites": str(get_tailoring_sites_atom_names(tailored_product)),
        "completeClusterSvg": cluster.draw_cluster(),
        "structureForTailoring": svg_structure_for_tailoring,
    }


def process_svg(svg_string, svg_id):
    """
    Process and format an SVG string with a specific ID.
    :param svg_string: The raw SVG string.
    :param svg_id: The ID to be assigned to the SVG.
    :return: Formatted SVG string with the specified ID.
    """
    return (
        svg_string.replace("\n", "")
        .replace('"', "'")
        .replace("<svg", f" <svg id='{svg_id}'")
    )


def log_error_nrps_pks(exception):
    """
    Log the exception and extract relevant information for the response.
    :param exception: The caught exception.
    :return: Dictionary with error information.
    """
    tb = traceback.extract_tb(exception.__traceback__)
    exc_type = type(exception).__name__
    filename, lineno, func_name, line_code = tb[-1]
    logging.error(f"{exc_type} occurred in {func_name} at {filename}:{lineno} and line_code: {line_code}")
    #print(f"{exc_type} occurred at {filename}:{lineno}")
    return {
        "Error": "The Cluster is not biosynthetically correct, try removing domains to include only complete modules or changing the order of proteins."
    }


@app.get("/api/alola/ripp/")
async def alola_ripp(antismash_input: str):
    """
    Process input data from antismash for RiPP analysis.
    :param antismash_input: JSON string containing antismash data.
    :return: Dictionary containing SVG representations, SMILES strings, and other molecular data.
    """
    try:
        assert antismash_input, "Input data is required."

        input_data = json.loads(antismash_input)
        tailoring_reactions, macrocyclisations = parse_ripp_input_data(input_data)
        logging.info(f"The input_data is: {input_data}")
        logging.info(f"The tailoring_reactions are: {tailoring_reactions}")
        logging.info(f"The macrocyclisations are: {macrocyclisations}")


        ripp_cluster = create_ripp_cluster_from_data(
            input_data, macrocyclisations, tailoring_reactions
        )
        ripp_cluster.make_peptide()

        peptide_svg = process_svg(
            ripp_cluster.draw_cluster(fold=10, size=7, as_string=True),
            "precursor_drawing",
        )

        tailored_product = perform_ripp_tailoring(ripp_cluster, tailoring_reactions)
        tailoring_sites = get_tailoring_sites_atom_names(
            ripp_cluster.chain_intermediate
        )

        svg_structure_for_tailoring = process_svg(
            ripp_cluster.draw_cluster(fold=10, size=7, as_string=True),
            "intermediate_drawing",
        )

        perform_ripp_macrocyclization(ripp_cluster, macrocyclisations)
        cyclised_product_svg = process_svg(
            ripp_cluster.draw_cluster(fold=5, size=7, as_string=True),
            "cyclised_drawing",
        )

        cleaved_ripp_svg = process_svg(
            ripp_cluster.draw_product(as_string=True), "final_drawing"
        )

        final_product = ripp_cluster.chain_intermediate
        (
            smiles,
            atoms_for_cyclisation,
            amino_acids
        ) = prepare_ripp_response_data(
            final_product,
            tailored_product,
            input_data["rippPrecursor"]

        )
        mass = final_product.get_mass()
        reactions = []
        if cluster.tailoring_representations:
            reactions.append("tailoring")
        if cluster.macrocyclisation_representations:
            reactions.append("cyclisation")
        if cluster.cleaved_intermediates:
            reactions.append("cleavage")
        if cluster.tailoring_representations:
            pathway_svg = cluster.draw_pathway(order=reactions, as_string=True)
        else:
            pathway_svg = "not_able_to_draw_pathway"

        return {
            "svg": cleaved_ripp_svg,
            "smiles": smiles,
            "mass": mass,
            "pathway_svg": pathway_svg,
            "atomsForCyclisation": atoms_for_cyclisation,
            "tailoringSites": tailoring_sites,
            "rawPeptideChain": peptide_svg,
            "cyclisedStructure": cyclised_product_svg,
            "aminoAcidsForCleavage": amino_acids,
            "structureForTailoring": svg_structure_for_tailoring,
        }

    except Exception as e:
        return log_error_ripps(e)
        #logging.exception("ERROR")


def log_error_ripps(exception):
    """
    Log the exception and extract relevant information for the response.
    :param exception: The caught exception.
    :return: Dictionary with error information.
    """
    tb = traceback.extract_tb(exception.__traceback__)
    exc_type = type(exception).__name__
    filename, lineno, func_name, line_code = tb[-1]
    logging.error(f"{exc_type} occurred in {func_name} at {filename}:{lineno} and line_code: {line_code}")
    #print(f"{exc_type} occurred at {filename}:{lineno}")
    return {
        "Error": "The Cluster is not biosynthetically correct, try reloading and incoperating other tailoring reactions."
    }


def parse_ripp_input_data(input_data):
    """
    Parse and transform input data from antismash.
    :param input_data: The JSON decoded input data.
    :return: Parsed tailoring reactions and macrocyclisations.
    """
    tailoring_reactions = [
        TailoringRepresentation(*enzyme)
        for enzyme in input_data.get("tailoring", [])
        if len(enzyme) > 0
    ]
    macrocyclisations = [
        MacrocyclizationRepresentation(*cyclization)
        for cyclization in input_data.get("cyclization", [])
        if len(cyclization) > 0
    ]

    return tailoring_reactions, macrocyclisations


def create_ripp_cluster_from_data(input_data, macrocyclisations, tailoring_reactions):
    """
    Create a RiPP cluster from input data.
    :param input_data: The JSON decoded input data.
    :param macrocyclisations: List of macrocyclisations.
    :param tailoring_reactions: List of tailoring reactions.
    :return: RiPPCluster instance.
    """
    return RiPPCluster(
        input_data["rippPrecursorName"],
        input_data["rippFullPrecursor"],
        input_data["rippPrecursor"],
        macrocyclisations=macrocyclisations,
        tailoring_representations=tailoring_reactions,
    )


def perform_ripp_tailoring(ripp_cluster, tailoring_reactions):
    """
    Perform tailoring on the RiPP cluster if applicable.
    :param ripp_cluster: RiPPCluster instance.
    :param tailoring_reactions: List of tailoring reactions.
    :return: Tailored product.
    """
    if tailoring_reactions:
        ripp_cluster.do_tailoring()
        return ripp_cluster.tailored_product
    return ripp_cluster.linear_product


def perform_ripp_macrocyclization(ripp_cluster, macrocyclisations):
    """
    Perform macrocyclization on the RiPP cluster if applicable.
    :param ripp_cluster: RiPPCluster instance.
    :param macrocyclisations: List of macrocyclisations.
    """
    if macrocyclisations:
        ripp_cluster.do_macrocyclization()


def prepare_ripp_response_data(
    final_product, tailored_product, amino_acid_sequence
):
    """
    Prepare the response data including SMILES strings and other molecular information.
    :param final_product: The final product after processing.
    :param tailored_product: The tailored product from the cluster.
    :param amino_acid_sequence: The amino acid sequence used in the process.
    :param protease_options: Options or data related to protease processing.
    :return: A tuple containing SMILES string, atoms for cyclisation, amino acids for cleavage.
    """
    smiles = structure_to_smiles(final_product, kekule=False)
    atoms_for_cyclisation = [
        str(atom)
        for atom in find_all_o_n_atoms_for_cyclization(tailored_product)
        if str(atom) != "O_0"
    ]
    amino_acids_for_cleavage = []

    for index, aa in enumerate(amino_acid_sequence):
        amino_acids_for_cleavage += [aa.upper() + str(index)]

    return smiles, str(atoms_for_cyclisation), str(amino_acids_for_cleavage)


@app.get("/api/alola/terpene/")
async def alola_terpene(antismash_input: str):
    try:
        assert antismash_input
        # handle input data
        antismash_input_transformed = json.loads(antismash_input)
        tailoringReactions = []
        macrocyclisations = []
        precursor = antismash_input_transformed["substrate"]

        logging.info(f"The input_data is: {antismash_input_transformed}")
        
        logging.info(f"The selected precursor is: {precursor}")


        gene_name_terpene_synthase = antismash_input_transformed["gene_name_precursor"]
        terpene_cyclase_type = antismash_input_transformed["terpene_cyclase_type"]
        if antismash_input_transformed["cyclization"] != "None":
            for cyclization in antismash_input_transformed["cyclization"]:
                if len(cyclization) > 0:
                    macrocyclisations.append(
                        MacrocyclizationRepresentation(cyclization[0], cyclization[1])
                    )
        tailoring_reactions = [
            TailoringRepresentation(*enzyme) for enzyme in antismash_input_transformed["tailoring"]]
        logging.info(f"The tailoring_reactions are: {tailoringReactions}")
        logging.info(f"Amount of tailoring reactions={len(tailoringReactions)}")
        if len(tailoringReactions) == 0:
            tailoringReactions=None
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
            logging.info("Performing tailoring")
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
        mass = final_product.get_mass()
        reactions = []
        if cluster.tailoring_representations:
            reactions.append("tailoring")
        if cluster.macrocyclisation_representations:
            reactions.append("cyclisation")
        if cluster.cleaved_intermediates:
            reactions.append("cleavage")
        if cluster.tailoring_representations:
            pathway_svg = cluster.draw_pathway(order=reactions, as_string=True)
        else:
            pathway_svg = "not_able_to_draw_pathway"
        
        smiles = structure_to_smiles(terpene_cluster.chain_intermediate, kekule=False)
        tailoring_sites = get_tailoring_sites_atom_names(
            terpene_cluster.chain_intermediate
        )
        return {
            "svg": svg_final_product,
            "smiles": smiles,
            "mass": mass,
            "pathway_svg": pathway_svg,
            "atomsForCyclisation": atoms_for_cyclisation,
            "tailoringSites": str(tailoring_sites),
            "precursor": precursor_svg,
            "cyclizedStructure": cyclised_product_svg,
            "structureForTailoring": svg_tailoring,
        }

    except Exception as e:
        tb = traceback.extract_tb(e.__traceback__)
        exc_type = type(e).__name__
        filename, lineno, func_name, line_code = tb[-1]
        logging.error(f"{exc_type} occurred in {func_name} at {filename}:{lineno} and line_code: {line_code}")
        return {"Error": "An error occured, try selecting a different precursor."}
