from pikachu.general import *
from fastapi import FastAPI, Query
from typing import List
import ast
from starlette.middleware.cors import CORSMiddleware
from typing import Optional
from raichu.modules_to_structure import *
from raichu.thioesterase_reactions import *

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
    # get last intermediate
    intermediate=cluster_to_structure(antismash_input_transformed)
    # find cyclisation sites
    o_atoms_for_cyclisation, n_atoms_for_cyclisation= find_all_o_n_atoms_for_cyclization(intermediate)
    # perform thioesterase reaction
    if cyclization=="None":
        if "terminator_module_nrps" in str(antismash_input_transformed):
            intermediate=attach_to_domain_nrp(intermediate, 'PCP')
        final_product = thioesterase_linear_product(intermediate)


    else:
         if "terminator_module_nrps" in str(antismash_input_transformed):
                    intermediate=attach_to_domain_nrp(intermediate, 'PCP')
         final_product =  thioesterase_circular_product(intermediate, cyclization)

    smiles=structure_to_smiles(final_product, kekule=False)
    print(smiles,o_atoms_for_cyclisation, n_atoms_for_cyclisation)
    final_drawing=RaichuDrawer(final_product,save_svg_string =True, dont_show=True)
    svg=final_drawing.svg_string.replace("\n","").replace("\"","'").replace("<svg"," <svg id='final_drawing'")

    global global_final_polyketide_Drawer_object
    list_drawings_per_module = cluster_to_structure(antismash_input_transformed,
    attach_to_acp=True, draw_structures_per_module=True)


    list_svgs=[]
    for drawing_list in list_drawings_per_module:
        for index_drawing,drawing in enumerate(drawing_list):
            svg_drawing=drawing.svg_string.replace("\n","").replace("\"","'").replace("<svg"," <svg id='intermediate_drawing' viewBox='0 0 300 75' preserveAspectRatio='xMidYMin meet'")
            list_svgs+=[[svg_drawing]]

    atoms_for_cyclisation=str(o_atoms_for_cyclisation+ n_atoms_for_cyclisation)
    return {"svg":svg, "hanging_svg": list_svgs[:-1], "smiles": smiles,  "atomsForCyclisation":atoms_for_cyclisation}
