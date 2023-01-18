from fastapi import FastAPI, Query
from typing import List
import ast
from starlette.middleware.cors import CORSMiddleware
from typing import Optional
from pikachu.chem.structure import Structure
from pikachu.reactions.functional_groups import find_bonds
from pikachu.reactions.functional_groups import BondDefiner, GroupDefiner
from raichu.data.molecular_moieties import PEPTIDE_BOND, CC_DOUBLE_BOND
from pikachu.general import structure_to_smiles, svg_string_from_structure
from raichu.run_raichu import ModuleRepresentation, DomainRepresentation, ClusterRepresentation, TailoringRepresentation, build_cluster, CleavageSiteRepresentation, MacrocyclizationRepresentation
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
async def alola_nrps_pks(antismash_input: str, state: Optional[List[int]] = Query(None)):
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
    spaghettis = [spaghetti.replace("\n", "").replace("\"", "'").replace("<svg", " <svg id='intermediate_drawing'")
                  for spaghetti in cluster.draw_spaghettis()][:-1]
    linear_intermediate = cluster.linear_product
    if cyclization != "None":
        # try to find atom for atom for cyclisation before the tailoring occurs
        atom_cyclisation = [atom for atom in linear_intermediate.atoms.values() if str(
            atom) == cyclization][0]
    cluster.do_tailoring()
    tailored_product = cluster.linear_product.deepcopy()
    final_product = cluster.linear_product
    if cyclization != "None":
        if not atom_cyclisation:
            atom_cyclisation = [
                atom for atom in final_product.atoms.values() if str(atom) == cyclization][0]
        atom_cyclisation = final_product.get_atom(atom_cyclisation)
        cluster.cyclise(atom_cyclisation)
        final_product = cluster.cyclised_product
    smiles = structure_to_smiles(final_product, kekule=False)
    atoms_for_cyclisation = str(
        find_all_o_n_atoms_for_cyclization(tailored_product))
    n_atoms_for_tailoring = str(
        find_atoms_for_tailoring(tailored_product, "N"))
    o_atoms_for_tailoring = str(
        find_atoms_for_tailoring(tailored_product, "O"))
    c_atoms_for_tailoring = str(
        find_atoms_for_tailoring(tailored_product, "C"))
    
    peptide_bonds = str(find_bonds(PEPTIDE_BOND, tailored_product))
    
    cc_double_bonds = str(find_bonds(CC_DOUBLE_BOND, tailored_product))
    
    structure_for_tailoring = RaichuDrawer(
        tailored_product, dont_show=True, add_url=True, draw_Cs_in_pink=True)
    structure_for_tailoring.draw_structure()
    svg_structure_for_tailoring = structure_for_tailoring.save_svg_string().replace(
        "\n", "").replace("\"", "'").replace("<svg", " <svg id='tailoring_drawing'")
    svg = svg_string_from_structure(final_product).replace("\n", "").replace(
        "\"", "'").replace("<svg", " <svg id='final_drawing'")

    return {"svg": svg, "hanging_svg": spaghettis, "smiles": smiles,  "atomsForCyclisation": atoms_for_cyclisation,
            "c_atoms_for_tailoring": c_atoms_for_tailoring, "n_atoms_for_tailoring": n_atoms_for_tailoring,
            "o_atoms_for_tailoring": o_atoms_for_tailoring, "ccDoubleBonds": cc_double_bonds,
            "peptideBonds": peptide_bonds, "complete_cluster_svg": cluster_svg,
            "structure_for_tailoring": svg_structure_for_tailoring}

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
    if antismash_input_transformed[1] != "None":
        for cyclization in antismash_input_transformed[1]:
            if len(cyclization)>0:
                macrocyclisations += [MacrocyclizationRepresentation(*cyclization)]
    for enzyme in antismash_input_transformed[2]:
        if len(enzyme)>0:
            tailoringReactions += [TailoringRepresentation(*enzyme)]
    for cleavage_site in antismash_input_transformed[3]:
        if len(cleavage_site)>0:
            cleavage_sites += [CleavageSiteRepresentation(*cleavage_site)]
    ripp_cluster = RiPP_Cluster(gene_name_precursor, amino_acid_sequence, cleavage_sites=cleavage_sites,
                                tailoring_enzymes_representation=tailoringReactions)
    ripp_cluster.make_peptide()
    peptide_svg = ripp_cluster.draw_product(as_string=True).replace(
        "\n", "").replace("\"", "'").replace("<svg", " <svg id='precursor_drawing'")
    if len(tailoringReactions)>0:
        ripp_cluster.do_tailoring()
        tailored_product = ripp_cluster.tailored_product
    else:
        tailored_product = ripp_cluster.linear_product
    structure_for_tailoring = RaichuDrawer(
        tailored_product, dont_show=True, add_url=True, draw_Cs_in_pink=True, draw_straightened=True)
    structure_for_tailoring.draw_structure()
    svg_structure_for_tailoring = structure_for_tailoring.save_svg_string().replace(
        "\n", "").replace("\"", "'").replace("<svg", " <svg id='intermediate_drawing'")
    print(ripp_cluster)
    if len(macrocyclisations)>0:
        ripp_cluster.do_macrocyclization()
    cyclised_product_svg = ripp_cluster.draw_product(as_string=True).replace(
        "\n", "").replace("\"", "'").replace("<svg", " <svg id='cyclised_drawing'")

    if len(cleavage_sites)>0:
        ripp_cluster.do_proteolytic_claevage()
    cleaved_ripp_svg = ripp_cluster.draw_product(as_string=True).replace("\n", "").replace(
        "\"", "'").replace("<svg", " <svg id='final_drawing'")

    final_product = ripp_cluster.chain_intermediate
    smiles = structure_to_smiles(final_product, kekule=False)
    atoms_for_cyclisation = str(
        find_all_o_n_atoms_for_cyclization(tailored_product))
    n_atoms_for_tailoring = str(
        find_atoms_for_tailoring(tailored_product, "N"))
    o_atoms_for_tailoring = str(
        find_atoms_for_tailoring(tailored_product, "O"))
    c_atoms_for_tailoring = str(
        find_atoms_for_tailoring(tailored_product, "C"))
    amino_acids = []
    
    peptide_bonds = str(find_bonds(PEPTIDE_BOND, tailored_product))
    
    cc_double_bonds = str(find_bonds(CC_DOUBLE_BOND, tailored_product))
    
    for index, aa in enumerate(amino_acid_sequence):
        amino_acids += [aa.upper()+str(index)]
    amino_acids = str(amino_acids)
    return {"svg": cleaved_ripp_svg, "smiles": smiles,  "atomsForCyclisation": atoms_for_cyclisation,
            "c_atoms_for_tailoring": c_atoms_for_tailoring, "n_atoms_for_tailoring": n_atoms_for_tailoring,
            "o_atoms_for_tailoring": o_atoms_for_tailoring, "ccDoubleBonds": cc_double_bonds,
            "peptideBonds": peptide_bonds, "raw_peptide_chain": peptide_svg,
            "cyclised_structure": cyclised_product_svg, "aminoAcidsForCleavage": amino_acids,
            "structure_for_tailoring": svg_structure_for_tailoring}
