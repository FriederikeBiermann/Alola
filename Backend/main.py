from pikachu.general import *
from fastapi import FastAPI, Query
from typing import List
import ast
from starlette.middleware.cors import CORSMiddleware
from typing import Optional
from raichu.modules_to_structure import *
from raichu.thioesterase_reactions import *
from raichu.nrps_tailoring_reactions import *
#Allow cross origin requests
from starlette.middleware import Middleware
app = FastAPI()
origins = ["http://localhost:3000",
    "localhost:3000"]
middleware = [Middleware(CORSMiddleware, allow_origins=origins)]
app = FastAPI(middleware=middleware)

@app.get("/")
async def root():
  return {"message":"This is the first Version of the Alola Api for integrating Alola into the web",
          "input":"antismash output file",
          "state":"state of dropdown-menus, if none== default",
        "output": "SVGs for intermediates+ SVG of final product"
      }

@app.get ("/api/alola/")

async def alola(antismash_input:str, state:Optional[List[int]] = Query(None)):
    # handle input data
    print(antismash_input)
    antismash_input_transformed=ast.literal_eval(antismash_input)[0]
    cyclization=ast.literal_eval(antismash_input)[1]
    tailoringReactions=ast.literal_eval(antismash_input)[2]
    # get last intermediate
    intermediate=cluster_to_structure(antismash_input_transformed)

    # find cyclisation sites
    for reaction in tailoringReactions:
        if reaction[0]=="p450":
            for target_atom_string in reaction[1]:
                for atom in intermediate.atoms.values():

                    if str(atom)==target_atom_string:
                        try:
                            print (target_atom_string)
                            target_atom=atom
                            intermediate=hydroxylation(target_atom,intermediate)
                        except :
                            target_atom_string=target_atom_string.split('_')[0]+"_"+str(int(target_atom_string.split('_')[1])+1)
                            print("new",target_atom_string)
        if "methyltransferase" in reaction[0]:
            for target_atom_string in reaction[1]:
                for atom in intermediate.atoms.values():

                    if str(atom)==target_atom_string:
                        try:
                            print (target_atom_string)
                            target_atom=atom
                            intermediate=methylation(target_atom,intermediate)
                        except :
                            target_atom_string=target_atom_string.split('_')[0]+"_"+str(int(target_atom_string.split('_')[1])+1)
                            print("new",target_atom_string)

    o_atoms_for_cyclisation, n_atoms_for_cyclisation= find_all_o_n_atoms_for_cyclization(linear_product)
    c_atoms_for_oxidation=find_all_c_atoms_for_oxidation(linear_product)
    linear_product= intermediate
    if "terminator_module_nrps" in str(antismash_input_transformed) or "nrps" in str(antismash_input_transformed[-1]):
                        intermediate=attach_to_domain_nrp(intermediate, 'PCP')
    raichu_svg=RaichuDrawer(linear_product,dont_show=True).svg_string.replace("\n","").replace("\"","'").replace("<svg"," <svg id='intermediate_drawing'")
    #perform thioesterase reaction
    if cyclization=="None":
        print (intermediate)
        intermediate = thioesterase_linear_product(intermediate)
        print (intermediate)

    else:
         intermediate =  thioesterase_circular_product(intermediate, cyclization)

    smiles=structure_to_smiles(intermediate, kekule=False)
    svg=svg_string_from_structure(intermediate).replace("\n","").replace("\"","'").replace("<svg"," <svg id='final_drawing'")


    global global_final_polyketide_Drawer_object
    list_drawings_per_module = cluster_to_structure(antismash_input_transformed,
    attach_to_acp=True, draw_structures_per_module=True)

    list_intermediate_smiles=[]



    list_svgs=[]

    for drawing_list in list_drawings_per_module:
        for index_drawing,drawing in enumerate(drawing_list):

            #drawing=RaichuDrawer(drawing,save_svg_string =True, dont_show=True)
            svg_drawing=drawing.svg_string.replace("\n","").replace("\"","'").replace("<svg"," <svg id='intermediate_drawing'")
            list_svgs+=[[svg_drawing]]
    print (o_atoms_for_cyclisation+ n_atoms_for_cyclisation)
    atoms_for_cyclisation=str(o_atoms_for_cyclisation+ n_atoms_for_cyclisation)
    return {"svg":svg, "hanging_svg": list_svgs, "smiles": smiles,  "atomsForCyclisation":str(atoms_for_cyclisation),"c_atoms_for_oxidation":str(c_atoms_for_oxidation),"n_atoms_for_methylation": str(n_atoms_for_cyclisation),"o_atoms_for_methylation": str( o_atoms_for_cyclisation), "intermediate_smiles": list_intermediate_smiles, "structure_for_tailoring":raichu_svg}
