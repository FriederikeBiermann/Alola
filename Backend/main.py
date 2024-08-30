import logging
import traceback
import sys
import os
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware import Middleware
from starlette.status import (
    HTTP_200_OK,
    HTTP_400_BAD_REQUEST,
    HTTP_500_INTERNAL_SERVER_ERROR,
)
from pydantic import BaseModel, Field
from typing import List, Optional


class AntismashInput(BaseModel):
    rippPrecursor: str
    cyclization: Optional[List[str]] = Field(default_factory=list)
    tailoring: Optional[List[List[str]]] = Field(default_factory=list)
    rippPrecursorName: str
    rippFullPrecursor: str


class NRPSPKSInput(BaseModel):
    clusterRepresentation: List[List]
    tailoring: Optional[List[List[str]]] = Field(default_factory=list)
    cyclization: Optional[str] = None


# Adding the path to the cluster_processing module in the docker container
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from cluster_processing import NRPSPKSPathway, RiPPPathway, TerpenePathway


# FastAPI app setup
app = FastAPI()
origins = ["http://localhost:3000", "localhost:3000"]
middleware = [Middleware(CORSMiddleware, allow_origins=origins)]
app = FastAPI(middleware=middleware)
app.mount("/static", StaticFiles(directory="app"), name="static")

logging.basicConfig(
    level=logging.DEBUG,
    filemode="w",
    format="%(asctime)s - %(levelname)s - %(message)s",
)

logging.getLogger("matplotlib").setLevel(logging.WARNING)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    tb = traceback.format_exc()
    exc_type = type(exc).__name__
    logging.error(f"Unhandled {exc_type} occurred: {exc}\nTraceback:\n{tb}")
    return JSONResponse(
        status_code=HTTP_500_INTERNAL_SERVER_ERROR,
        content={"Error": "An unexpected error occurred. Please try again later."},
    )


# Error handling function
async def process_with_error_handling(func, *args, **kwargs):
    try:
        return JSONResponse(
            content=await func(*args, **kwargs), status_code=HTTP_200_OK
        )
    except AssertionError as ae:
        logging.error(
            f"AssertionError occurred: {ae}\nTraceback:\n{traceback.format_exc()}"
        )
        return JSONResponse(
            status_code=HTTP_400_BAD_REQUEST,
            content={
                "Error": "The Cluster is not biosynthetically correct, try undoing and incoperating other tailoring reactions."
            },
        )
    except Exception as e:
        logging.error(
            f"Unhandled exception occurred: {e}\nTraceback:\n{traceback.format_exc()}"
        )
        return JSONResponse(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "Error": "The Cluster is not biosynthetically correct, try undoing and incoperating other tailoring reactions."
            },
        )


# FastAPI Endpoints
@app.get("/")
async def root():
    return {
        "message": "This is the first Version of the Alola Api for integrating Alola into the web",
        "input": "antismash output file",
        "state": "state of dropdown-menus, if none== default",
        "output": "SVGs for intermediates+ SVG of final product",
    }


# Decorators with error handling do not work


@app.get("/api/alola/nrps_pks/")
async def alola_nrps_pks(antismash_input: str):
    return await process_with_error_handling(NRPSPKSPathway(antismash_input).process)


@app.get("/api/alola/ripp/")
async def alola_ripp(antismash_input: str):
    logging.debug(f"Processing RiPP pathway with input: {antismash_input}")
    return await process_with_error_handling(RiPPPathway(antismash_input).process)


@app.get("/api/alola/terpene/")
async def alola_terpene(antismash_input: str):
    return await process_with_error_handling(TerpenePathway(antismash_input).process)
