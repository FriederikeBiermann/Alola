from pikachu.chem.structure import Structure
from pikachu.general import structure_to_smiles, svg_string_from_structure
from fastapi import FastAPI, Query
from typing import List
import ast
from starlette.middleware.cors import CORSMiddleware
from typing import Optional
from raichu.run_raichu import ModuleRepresentation, DomainRepresentation, ClusterRepresentation, TailoringRepresentation, get_spaghettis, build_cluster
from raichu.reactions.general_tailoring_reactions import find_all_o_n_atoms_for_cyclization, find_atoms_for_tailoring
from raichu.drawing.drawer import RaichuDrawer

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


@app.get("/api/alola/")
async def alola(antismash_input: str, state: Optional[List[int]] = Query(None)):
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
    cluster = build_cluster(raichu_input)
    cluster.compute_structures(compute_cyclic_products=False)
    cluster_svg = cluster.draw_cluster()
    spaghettis = [spaghetti.replace("\n", "").replace("\"", "'").replace("<svg", " <svg id='intermediate_drawing'")
                  for spaghetti in cluster.draw_spaghettis()]
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

    structure_for_tailoring = RaichuDrawer(
        tailored_product, dont_show=True, add_url=True, draw_Cs_in_pink=True)
    structure_for_tailoring.draw_structure()
    svg_structure_for_tailoring = structure_for_tailoring.save_svg_string().replace(
        "\n", "").replace("\"", "'").replace("<svg", " <svg id='intermediate_drawing'")
    svg = svg_string_from_structure(final_product).replace("\n", "").replace(
        "\"", "'").replace("<svg", " <svg id='final_drawing'")

    return {"svg": svg, "hanging_svg": spaghettis, "smiles": smiles,  "atomsForCyclisation": atoms_for_cyclisation,
            "c_atoms_for_tailoring": c_atoms_for_tailoring, "n_atoms_for_tailoring": n_atoms_for_tailoring,
            "o_atoms_for_tailoring": o_atoms_for_tailoring, "complete_cluster_svg": cluster_svg,
            "structure_for_tailoring": svg_structure_for_tailoring}
