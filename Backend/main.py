import logging
import traceback
import sys
import os
import json
from fastapi import HTTPException
from fastapi import FastAPI, Request, Response
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
from typing import List, Optional, Any
from prometheus_client import Counter, Histogram, generate_latest
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

# Pydantic Models


class NRPSPKSPathwayInput(BaseModel):
    clusterRepresentation: List[List[Any]]
    tailoring: Optional[List[List[str]]] = Field(default_factory=list)
    cyclization: Optional[str] = None


class RiPPPathwayInput(BaseModel):
    rippPrecursorName: str
    rippFullPrecursor: str
    rippPrecursor: str
    cyclization: Optional[List[List[str]]] = Field(default_factory=list)
    tailoring: Optional[List[List[str]]] = Field(default_factory=list)


class TerpenePathwayInput(BaseModel):
    substrate: str
    gene_name_precursor: str
    terpene_cyclase_type: str
    cyclization: Optional[List[List[str]]] = Field(default_factory=list)
    double_bond_isomerase: Optional[List[List[str]]] = Field(default_factory=list)
    tailoring: Optional[List[List[str]]] = Field(default_factory=list)
    methyl_mutase: Optional[List[List[str]]] = Field(default_factory=list)


# Adding the path to the cluster_processing module in the docker container
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from cluster_processing import NRPSPKSPathway, RiPPPathway, TerpenePathway


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

# Add the CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add the SlowAPI middleware for rate limiting
app.state.limiter = limiter
app.add_exception_handler(HTTPException, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# Mount static files
app.mount("/static", StaticFiles(directory="app"), name="static")

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
    logging.error(f"Unhandled {exc_type} occurred: {exc}\nTraceback:\n{tb}")
    return JSONResponse(
        status_code=HTTP_500_INTERNAL_SERVER_ERROR,
        content={"Error": "An unexpected error occurred. Please try again later."},
    )


@app.exception_handler(HTTP_429_TOO_MANY_REQUESTS)
async def rate_limit_exceeded_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=HTTP_429_TOO_MANY_REQUESTS,
        content={"Error": "Rate limit exceeded. Please try again later."},
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
                "Error": "The Cluster is not biosynthetically correct, try undoing and incorporating other tailoring reactions."
            },
        )
    except Exception as e:
        UNHANDLED_EXCEPTION_COUNT.inc()  # Increment unhandled exception counter
        logging.error(
            f"Unhandled exception occurred: {e}\nTraceback:\n{traceback.format_exc()}"
        )
        return JSONResponse(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "Error": "The Cluster is not biosynthetically correct, try undoing and incorporating other tailoring reactions."
            },
        )


# FastAPI Endpoints
@app.get("/")
@limiter.limit("1/second")
async def root(request: Request):
    return {
        "message": "This is the first Version of the Alola Api for integrating Alola into the web",
        "input": "antismash output file",
        "state": "state of dropdown-menus, if none== default",
        "output": "SVGs for intermediates+ SVG of final product",
    }


@app.get("/api/alola/nrps_pks/")
@limiter.limit("1/second")
async def alola_nrps_pks(request: Request, antismash_input: str):
    try:
        input_data = json.loads(antismash_input)
        validated_input = NRPSPKSPathwayInput(**input_data)
    except json.JSONDecodeError:
        JSON_DECODE_ERROR_COUNT.inc()  # Increment JSON decoding error counter
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST, detail="Invalid JSON input"
        )
    except ValidationError as e:
        VALIDATION_ERROR_COUNT.inc()  # Increment validation error counter
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail=e.errors())

    logging.debug(f"Processing NRPS/PKS pathway with input: {validated_input}")
    return await process_with_error_handling(
        NRPSPKSPathway(validated_input.dict()).process
    )


@app.get("/api/alola/ripp/")
@limiter.limit("1/second")
async def alola_ripp(request: Request, antismash_input: str):
    try:
        input_data = json.loads(antismash_input)
        validated_input = RiPPPathwayInput(**input_data)
    except json.JSONDecodeError:
        JSON_DECODE_ERROR_COUNT.inc()  # Increment JSON decoding error counter
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST, detail="Invalid JSON input"
        )
    except ValidationError as e:
        VALIDATION_ERROR_COUNT.inc()  # Increment validation error counter
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail=e.errors())

    logging.debug(f"Processing RiPP pathway with input: {validated_input}")
    return await process_with_error_handling(
        RiPPPathway(validated_input.dict()).process
    )


@app.get("/api/alola/terpene/")
@limiter.limit("1/second")
async def alola_terpene(request: Request, antismash_input: str):
    try:
        input_data = json.loads(antismash_input)
        validated_input = TerpenePathwayInput(**input_data)
    except json.JSONDecodeError:
        JSON_DECODE_ERROR_COUNT.inc()  # Increment JSON decoding error counter
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST, detail="Invalid JSON input"
        )
    except ValidationError as e:
        VALIDATION_ERROR_COUNT.inc()  # Increment validation error counter
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail=e.errors())

    logging.debug(f"Processing Terpene pathway with input: {validated_input}")
    return await process_with_error_handling(
        TerpenePathway(validated_input.dict()).process
    )


# Prometheus Metrics Endpoint
@app.get("/metrics")
@limiter.limit("1/second")
async def metrics(request: Request):
    return Response(generate_latest(), media_type="text/plain")
