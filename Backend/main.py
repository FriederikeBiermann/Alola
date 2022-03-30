from pikachu.general import *
from fastapi import FastAPI, Query
from typing import List
import ast
from starlette.middleware.cors import CORSMiddleware

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
    final_product = pks_cluster_to_structure(antismash_input_transformed)
    svg=svg_string_from_structure(final_product).replace("\n","").replace("\"","'")
    print (type({"svg":str(svg)}))
    return {"svg":str(svg)}
