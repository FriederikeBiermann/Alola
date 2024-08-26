from fastapi import FastAPI, Query
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware import Middleware
import functools
from typing import List, Optional, Callable
import logging
import traceback
from cluster_processing import NRPSPKSPathway, RiPPPathway, TerpenePathway


def log_and_handle_errors(func: Callable):
    """Decorator to log errors and return a standardized error response."""

    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            tb = traceback.extract_tb(e.__traceback__)
            exc_type = type(e).__name__
            if tb:
                filename, lineno, func_name, line_code = tb[-1]
                logging.error(
                    f"{exc_type} occurred in {func_name} at {filename}:{lineno} with line code: {line_code}"
                )
            else:
                logging.error(f"{exc_type} occurred: {e}")
            return {"Error": "An error occurred. Please check the input and try again."}

    return wrapper


# FastAPI app setup
app = FastAPI()
origins = ["http://localhost:3000", "localhost:3000"]
middleware = [Middleware(CORSMiddleware, allow_origins=origins)]
app = FastAPI(middleware=middleware)
app.mount("/static", StaticFiles(directory="app"), name="static")

logging.basicConfig(
    level=logging.INFO, filemode="w", format="%(asctime)s - %(levelname)s - %(message)s"
)


logging.debug("debug")
logging.info("info")
logging.warning("warning")
logging.error("error")
logging.critical("critical")

# FastAPI Endpoints


@app.get("/")
async def root():
    return {
        "message": "This is the first Version of the Alola Api for integrating Alola into the web",
        "input": "antismash output file",
        "state": "state of dropdown-menus, if none== default",
        "output": "SVGs for intermediates+ SVG of final product",
    }


@log_and_handle_errors
@app.get("/api/alola/nrps_pks/")
async def alola_nrps_pks(antismash_input: str):
    pathway = NRPSPKSPathway(antismash_input)
    return pathway.process()


@log_and_handle_errors
@app.get("/api/alola/ripp/")
async def alola_ripp(antismash_input: str):
    pathway = RiPPPathway(antismash_input)
    return pathway.process()


@log_and_handle_errors
@app.get("/api/alola/terpene/")
async def alola_terpene(antismash_input: str):
    pathway = TerpenePathway(antismash_input)
    return pathway.process()
