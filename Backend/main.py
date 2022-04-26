from pikachu.general import *
from fastapi import FastAPI, Query
from typing import List
import ast
from starlette.middleware.cors import CORSMiddleware
from typing import Optional
from visualize_cluster import *

from starlette.middleware import Middleware
app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000"
]



middleware = [
    Middleware(CORSMiddleware, allow_origins=origins)
]

app = FastAPI(middleware=middleware)
from visualize_pks_cluster import *
@app.get("/")
async def root():
  return {"message":"This is the first Version of the Alola Api for integrating Alola into the web",
          "input":"antismash output file",
          "state":"state of dropdown-menus, if none== default",
        "output": "SVGs for intermediates+ SVG of final product"
      }

@app.get ("/api/alola/")
async def alola(antismash_input:str, state:Optional[List[int]] = Query(None)):
    print ((antismash_input))
    antismash_input_transformed=ast.literal_eval(antismash_input)
    print ((antismash_input_transformed), type(antismash_input_transformed))
    final_product = cluster_to_structure(antismash_input_transformed)
    svg=svg_string_from_structure(final_product).replace("\n","").replace("\"","'")
    global global_final_polyketide_Drawer_object


    # Save (don't show!) drawings of the chain intermediate per module
    list_drawings_per_module = cluster_to_structure(antismash_input_transformed,
    attach_to_acp=True, draw_structures_per_module=True)
    # Close all matplotlib windows that were still open when generating
    # the chain intermediate Drawer objects
    plt.close('all')

    # Build list of all modules comprised in the cluster, used to draw
    # module/domain architecture later
    list_svgs=[]
    for drawing_list in list_drawings_per_module:
        for drawing in drawing_list:
            drawing.save_svg(str(drawing)+".svg")
            list_svgs+=[[drawing.save_svg_string().replace("\n","").replace("\"","'")]]
    return {"svg":str(svg), "hanging_svg": list_svgs}
