from fastapi import FastAPI, Query
from typing import List
import ast
from starlette.middleware.cors import CORSMiddleware
from typing import Optional
from pikachu.chem.structure import Structure
from pikachu.reactions.functional_groups import find_bonds
from raichu.data.molecular_moieties import PEPTIDE_BOND, CC_DOUBLE_BOND
from pikachu.general import structure_to_smiles, svg_string_from_structure
from raichu.run_raichu import get_tailoring_sites_atom_names, ModuleRepresentation, DomainRepresentation, ClusterRepresentation, TailoringRepresentation, build_cluster, CleavageSiteRepresentation, MacrocyclizationRepresentation
from raichu.reactions.chain_release import find_all_o_n_atoms_for_cyclization
from raichu.reactions.general_tailoring_reactions import find_atoms_for_tailoring
from raichu.drawing.drawer import RaichuDrawer
from raichu.ripp import RiPP_Cluster

# Allow cross origin requests
from starlette.middleware import Middleware
app = FastAPI()
origins = ["http://localhost:3000",
           "localhost:3000"]
middleware = [Middleware(CORSMiddleware, allow_origins=origins)]
app = FastAPI(middleware=middleware)

def get_drawings(cluster) :
    drawings, widths = cluster.get_drawings()
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
                sulphur_pos = atom.get_neighbour('S').draw.position
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
        svg = f"{svg_header}{drawing.draw_svg()}{squiggly_svg}".replace("\n", "").replace(
            "\"", "'").replace("<svg", " <svg id='intermediate_drawing'")
        svg_strings.append(
            [svg, carrier_domain_pos.x, carrier_domain_pos.y, width, height])

    return svg_strings

def format_cluster(raw_cluster: List, tailoring_reactions: TailoringRepresentation) -> ClusterRepresentation:
    formatted_modules = []
    for module in raw_cluster:
        formatted_domains = []
        for domain in module[3]:
            #Format fake booleans
            domain = map(lambda x: x if x != 'None' else None, domain)
            domain = map(lambda x: x if x != "True" else True, domain)
            domain = map(lambda x: x if x != "False" else False, domain)
            formatted_domains += [DomainRepresentation(*domain)]
        formatted_modules += [ModuleRepresentation(
            module[0], None if module[1] == 'None' else module[1], module[2], formatted_domains)]
    return ClusterRepresentation(formatted_modules, tailoring_reactions)


@app.get("/")
async def root():
    return {"message": "This is the first Version of the Alola Api for integrating Alola into the web",
            "input": "antismash output file",
            "state": "state of dropdown-menus, if none== default",
            "output": "SVGs for intermediates+ SVG of final product"
            }


@app.get("/api/alola/nrps_pks/")
async def alola_nrps_pks(antismash_input: str):
    try:
        assert antismash_input
        # handle input data
        antismash_input_transformed = ast.literal_eval(antismash_input)
        tailoringReactions = []
        for enzyme in antismash_input_transformed[2]:
            tailoringReactions += [TailoringRepresentation(*enzyme)]
        raw_cluster_representation = antismash_input_transformed[0]
        #Format fake booleans
        raichu_input = format_cluster(
            raw_cluster_representation, tailoringReactions)
        cyclization = antismash_input_transformed[1]
        cluster = build_cluster(raichu_input, strict = False)
        cluster.compute_structures(compute_cyclic_products=False)
        cluster_svg = cluster.draw_cluster()
        
        linear_intermediate = cluster.linear_product
        cluster.do_tailoring()
        tailored_product = cluster.chain_intermediate.deepcopy()
        final_product = cluster.chain_intermediate
        if cyclization != "None":
            # try to find atom for atom for cyclisation before the tailoring occurs
            atom_cyclisation = [atom for atom in tailored_product.atoms.values() if str(
                atom) == cyclization]
            if len(atom_cyclisation) == 0:
                raise ValueError(
                    f"Atom {cyclization} for cyclization does not exist.")
            else:
                atom_cyclisation = atom_cyclisation[0]
            cluster.cyclise(atom_cyclisation)
            final_product = cluster.cyclised_product
        smiles = structure_to_smiles(final_product, kekule=False)
        atoms_for_cyclisation = str(
            [str(atom) for atom in find_all_o_n_atoms_for_cyclization(tailored_product) if str(atom) != "O_0"])
        tailoring_sites = get_tailoring_sites_atom_names(tailored_product)
        structure_for_tailoring = RaichuDrawer(
            tailored_product, dont_show=True, add_url=True, draw_Cs_in_pink=True, draw_straightened=True)
        structure_for_tailoring.draw_structure()
        svg_structure_for_tailoring = structure_for_tailoring.save_svg_string().replace(
            "\n", "").replace("\"", "'").replace("<svg", " <svg id='tailoring_drawing'")
        svg = svg_string_from_structure(final_product).replace("\n", "").replace(
            "\"", "'").replace("<svg", " <svg id='final_drawing'")
        spaghettis = get_drawings(cluster)
        return {"svg": svg, "hangingSvg": spaghettis, "smiles": smiles, "atomsForCyclisation": atoms_for_cyclisation,  "tailoringSites": str(tailoring_sites), "completeClusterSvg": cluster_svg,
                "structureForTailoring": svg_structure_for_tailoring}
    except:
        return {"Error": "The Cluster is not biosynthetically correct, try removing domains to inlcude only complete modules."}

@app.get("/api/alola/ripp/")
async def alola_ripp(antismash_input: str, state: Optional[List[int]] = Query(None)):
        assert antismash_input
        # handle input data
        antismash_input_transformed = ast.literal_eval(antismash_input)
        tailoringReactions = []
        macrocyclisations = []
        cleavage_sites = []
        amino_acid_sequence = antismash_input_transformed[0]
        gene_name_precursor = antismash_input_transformed[4]
        full_amino_acid_sequence = antismash_input_transformed[5]
        if antismash_input_transformed[1] != "None":
            for cyclization in antismash_input_transformed[1]:
                if len(cyclization)>0:
                    macrocyclisations += [MacrocyclizationRepresentation(*cyclization)]
        for enzyme in antismash_input_transformed[2]:
            if len(enzyme)>0:
                tailoringReactions += [TailoringRepresentation(*enzyme)]
        for cleavage_site in antismash_input_transformed[3]:
            if len(cleavage_site)>0:
                amino_acid = cleavage_site[0]
                amino_acid_number = int(cleavage_site[1:])
                cleavage_sites += [CleavageSiteRepresentation(amino_acid, amino_acid_number, "follower")]
        ripp_cluster = RiPP_Cluster(gene_name_precursor, full_amino_acid_sequence, amino_acid_sequence, cleavage_sites=cleavage_sites,
                                    tailoring_enzymes_representation=tailoringReactions)
        ripp_cluster.make_peptide()
        peptide_svg = ripp_cluster.draw_precursor_with_modified_product(
            fold=10, size=7, as_string=True).replace(
            "\n", "").replace("\"", "'").replace("<svg", " <svg id='precursor_drawing'")
        if len(tailoringReactions)>0:
            ripp_cluster.do_tailoring()
            tailored_product = ripp_cluster.tailored_product
        else:
            tailored_product = ripp_cluster.linear_product
        svg_structure_for_tailoring = ripp_cluster.draw_precursor_with_modified_product(
            fold=10, size=7, as_string=True,  draw_Cs_in_pink=True).replace(
            "\n", "").replace("\"", "'").replace("<svg", " <svg id='intermediate_drawing'")
        if len(macrocyclisations)>0:
            ripp_cluster.do_macrocyclization()
        cyclised_product_svg = ripp_cluster.draw_precursor_with_modified_product(fold=5, size=7, as_string=True).replace(
            "\n", "").replace("\"", "'").replace("<svg", " <svg id='cyclised_drawing'")

        if len(cleavage_sites)>0:
            ripp_cluster.do_proteolytic_claevage()
        cleaved_ripp_svg = ripp_cluster.draw_product(as_string=True).replace("\n", "").replace(
            "\"", "'").replace("<svg", " <svg id='final_drawing'")

        final_product = ripp_cluster.chain_intermediate
        smiles = structure_to_smiles(final_product, kekule=False)
        atoms_for_cyclisation = str(
            [str(atom) for atom in find_all_o_n_atoms_for_cyclization(tailored_product) if str(atom) != "O_0"])
        tailoring_sites = get_tailoring_sites_atom_names(tailored_product)
        amino_acids = []
        for index, aa in enumerate(amino_acid_sequence):
            amino_acids += [aa.upper()+str(index)]
        amino_acids = str(amino_acids)
        return {"svg": cleaved_ripp_svg, "smiles": smiles,  "atomsForCyclisation": atoms_for_cyclisation, "tailoringSites": str(tailoring_sites)
                , "rawPeptideChain": peptide_svg,
                "cyclisedStructure": cyclised_product_svg, "aminoAcidsForCleavage": amino_acids,
                "structureForTailoring": svg_structure_for_tailoring}
