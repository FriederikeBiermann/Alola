import logging
from pythonjsonlogger import jsonlogger
import traceback
import sys
import os
import json
from datetime import datetime, timedelta
from fastapi import HTTPException
from fastapi import FastAPI, Request, Response, Header
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware import Middleware
from slowapi.middleware import SlowAPIMiddleware
from starlette.status import (
    HTTP_200_OK,
    HTTP_400_BAD_REQUEST,
    HTTP_500_INTERNAL_SERVER_ERROR,
    HTTP_429_TOO_MANY_REQUESTS,
)
from pydantic import BaseModel, Field, ValidationError
from typing import List, Optional, Any, Union, Type
from prometheus_client import Counter, Histogram, generate_latest
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
import asyncio
from functools import partial
from concurrent.futures import ProcessPoolExecutor

# Adding the path to the cluster_processing module in the docker container
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from cluster_processing import NRPSPKSPathway, RiPPPathway, TerpenePathway

# Pydantic Models


class NRPSPKSPathwayInput(BaseModel):
    clusterRepresentation: List[List[Any]]
    tailoring: Optional[List[List[Union[str, List[List[str]]]]]] = Field(
        default_factory=list
    )
    cyclization: Optional[str] = None


class RiPPPathwayInput(BaseModel):
    rippPrecursorName: str
    rippFullPrecursor: str
    rippPrecursor: str
    cyclization: Optional[List[List[str]]] = Field(default_factory=list)
    tailoring: Optional[List[List[Union[str, List[List[str]]]]]] = Field(
        default_factory=list
    )


class TerpenePathwayInput(BaseModel):
    substrate: str
    gene_name_precursor: str
    terpene_cyclase_type: str
    cyclization: Optional[List[List[str]]] = Field(default_factory=list)
    double_bond_isomerase: Optional[List[List[str]]] = Field(default_factory=list)
    methyl_mutase: Optional[List[List[str]]] = Field(default_factory=list)
    tailoring: Optional[List[List[Union[str, List[List[str]]]]]] = Field(
        default_factory=list
    )


process_pool = ProcessPoolExecutor(max_workers=8)

# Prometheus Metrics
REQUEST_COUNT = Counter("request_count", "Total number of requests")
IP_COUNT = Counter("ip_count", "Total number of unique IP addresses", ["ip"])
ENDPOINT_COUNT = Counter(
    "endpoint_count", "Total number of requests per endpoint", ["endpoint"]
)
REQUEST_LATENCY = Histogram("request_latency_seconds", "Latency of requests in seconds")

# Error Counters
JSON_DECODE_ERROR_COUNT = Counter(
    "json_decode_error_count", "Total number of JSON decoding errors"
)
VALIDATION_ERROR_COUNT = Counter(
    "validation_error_count", "Total number of validation errors"
)
UNHANDLED_EXCEPTION_COUNT = Counter(
    "unhandled_exception_count", "Total number of unhandled exceptions"
)


# Initialize the Limiter
limiter = Limiter(key_func=get_remote_address)

# FastAPI app setup
app = FastAPI()

frontend_urls = ["http://alola.bioinformatics.nl", "alola.bioinformatics.nl", "https://www.alola.bioinformatics.nl", "https://alola.bioinformatics.nl",]

# Add the CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_urls,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add the SlowAPI middleware for rate limiting
app.state.limiter = limiter
app.add_exception_handler(HTTP_429_TOO_MANY_REQUESTS, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# Mount static files
app.mount("/static", StaticFiles(directory="app"), name="static")

# Configure logging
logHandler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter(
    "%(asctime)s %(levelname)s %(message)s %(funcName)s %(lineno)d"
)
logHandler.setFormatter(formatter)

logging.basicConfig(
    level=logging.DEBUG,
    filemode="w",
    format="%(asctime)s - %(levelname)s - %(message)s",
)

logging.getLogger("matplotlib").setLevel(logging.WARNING)


# Middleware to track Prometheus metrics
@app.middleware("http")
async def prometheus_middleware(request: Request, call_next):
    REQUEST_COUNT.inc()  # Increment the total request counter

    ip_address = request.client.host
    IP_COUNT.labels(ip=ip_address).inc()  # Track unique IPs

    endpoint = request.url.path
    ENDPOINT_COUNT.labels(endpoint=endpoint).inc()  # Track requests per endpoint

    with REQUEST_LATENCY.time():  # Measure latency
        response = await call_next(request)
    return response


# Exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    tb = traceback.format_exc()
    exc_type = type(exc).__name__
    UNHANDLED_EXCEPTION_COUNT.inc()  # Increment unhandled exception counter
    logging.error({"error": f"Unhandled {exc_type} occurred: {exc}", "traceback": tb})
    return JSONResponse(
        status_code=HTTP_500_INTERNAL_SERVER_ERROR,
        content={"Error": "An unexpected error occurred. Please try again later."},
    )


async def rate_limit_exceeded_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=HTTP_429_TOO_MANY_REQUESTS,
        content={"Error": "Rate limit exceeded. Please try again later."},
    )


def run_sync(func, *args, **kwargs):
    """
    Wrapper function to run coroutines in a synchronous context.
    """
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    result = loop.run_until_complete(func(*args, **kwargs))
    loop.close()
    return result


# Error handling function
async def process_with_error_handling(func, *args, **kwargs):
    try:
        loop = asyncio.get_running_loop()
        if asyncio.iscoroutinefunction(func):
            # If the function is a coroutine function, wrap it with run_sync
            partial_func = partial(run_sync, func, *args, **kwargs)
        else:
            partial_func = partial(func, *args, **kwargs)

        result = await loop.run_in_executor(process_pool, partial_func)
        return JSONResponse(content=result, status_code=HTTP_200_OK)

    except AssertionError as ae:
        logging.error(
            {
                "error": f"AssertionError occurred: {ae}",
                "traceback": traceback.format_exc(),
            }
        )
        return JSONResponse(
            status_code=HTTP_400_BAD_REQUEST,
            content={
                "Error": "The Cluster is not biosynthetically correct, try undoing and incorporating other tailoring reactions."
            },
        )
    except Exception as e:
        UNHANDLED_EXCEPTION_COUNT.inc()  # Increment unhandled exception counter
        logging.error(
            {
                "error": f"Unhandled exception occurred: {e}",
                "traceback": traceback.format_exc(),
            }
        )
        return JSONResponse(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "Error": "The Cluster is not biosynthetically correct, try undoing and incorporating other tailoring reactions."
            },
        )


async def process_pathway(
    request: Request,
    antismash_input: str,
    input_model: Type[BaseModel],
    pathway_class: Type[Any],
):
    try:
        input_data = json.loads(antismash_input)
        logging.debug(f"JSON input {input_data}")
        validated_input = input_model(**input_data)
    except json.JSONDecodeError:
        JSON_DECODE_ERROR_COUNT.inc()  # Increment JSON decoding error counter
        logging.error(f"Invalid JSON input {antismash_input}")
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST, detail="Invalid JSON input"
        )
    except ValidationError as e:
        VALIDATION_ERROR_COUNT.inc()  # Increment validation error counter
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail=e.errors())

    logging.debug(
        {
            "message": f"Processing pathway with input: {validated_input}",
            "input_data": validated_input.dict(),
        }
    )
    return await process_with_error_handling(
        pathway_class(validated_input.dict()).process
    )


# FastAPI Endpoints
@app.get("/")
# @limiter.limit("1/second")
async def root(request: Request):
    return {
        "message": "This is the first Version of the Alola Api for integrating Alola into the web",
        "input": "antismash output file",
        "state": "state of dropdown-menus, if none== default",
        "output": "SVGs for intermediates+ SVG of final product",
    }


# Prometheus Metrics Endpoint
@app.get("/metrics")
@limiter.limit("1/second")
async def metrics(request: Request):
    return Response(generate_latest(), media_type="text/plain")


@app.get("/api/alola/nrps_pks/")
@app.get("/api/alola/nrps_pks")
@limiter.limit("3/second")
async def alola_nrps_pks(request: Request, antismash_input: str):
    return await process_pathway(
        request, antismash_input, NRPSPKSPathwayInput, NRPSPKSPathway
    )


@app.get("/api/alola/ripp/")
@app.get("/api/alola/ripp")
@limiter.limit("3/second")
async def alola_ripp(request: Request, antismash_input: str):
    return await process_pathway(
        request, antismash_input, RiPPPathwayInput, RiPPPathway
    )


@app.get("/api/alola/terpene/")
@app.get("/api/alola/terpene")
@limiter.limit("3/second")
async def alola_terpene(request: Request, antismash_input: str):
    return await process_pathway(
        request, antismash_input, TerpenePathwayInput, TerpenePathway
    )


# The infrastructure to handle antiSMASH API calls. Returns the JSON response from the antiSMASH API to the frontend after sanitizing the input.

# In-memory storage for user data with timestamps
user_data_storage = {}

# Expiration time (1 day)
EXPIRATION_TIME = timedelta(hours=2)


# Dummy function to validate if the request is from Antismash
async def is_from_antismash(request: Request, anti_smash_header: str = Header(None)):
    if anti_smash_header != "antismash":
        raise HTTPException(status_code=400, detail="Invalid source header")


# Dummy function to validate if the data is valid JSON
async def validate_json(request: Request):
    try:
        data = await request.json()
        return data
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON data")


# Endpoint to receive data from Antismash
@app.post("/api/antismash/receive")
async def receive_antismash_data(
    request: Request
):
    # Validate the request origin and JSON data
    logging.debug(f"Headers received: {request.headers}")

    if not request.headers["anti_smash_header"]:
        raise HTTPException(status_code=400, detail="Missing 'anti_smash_header' in request")

    await is_from_antismash(request, request.headers["anti_smash_header"])
    data = await validate_json(request)

    # Extract user ID from the data
    user_id = data.get("user_id")

    if not user_id:
        raise HTTPException(status_code=400, detail="User ID is required")

    # Store the data along with the current timestamp
    user_data_storage[user_id] = {"data": data["data"], "timestamp": datetime.utcnow()}
    logging.debug(user_data_storage)
    url = f"{frontend_urls[0]}/?user_id={user_id}"

    return JSONResponse(content={"status": "success", "url": url}, status_code=200)


# Endpoint to fetch data for a specific user
@app.get("/api/antismash/fetch_data")
async def fetch_data(user_id: str):
    logging.debug(user_data_storage)
    logging.debug(user_id)
    if user_id not in user_data_storage:
        raise HTTPException(status_code=404, detail="Data not found")

    # Return the data for the specific user
    return JSONResponse(content=user_data_storage[user_id]["data"])


# Background task to cleanup expired data
async def cleanup_expired_data():
    while True:
        current_time = datetime.utcnow()

        # Iterate over stored data and remove expired entries
        for user_id, entry in list(user_data_storage.items()):
            if current_time - entry["timestamp"] > EXPIRATION_TIME:
                del user_data_storage[user_id]  # Delete expired data

        await asyncio.sleep(60)  # Run cleanup every minute


# Start the background task when the server starts
@app.on_event("startup")
async def startup_event():
    # Run cleanup task in the background
    asyncio.create_task(cleanup_expired_data())
