from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse, ORJSONResponse, JSONResponse
from time import time
import requests
from requests.auth import HTTPBasicAuth
import os


from ..database import crud, models, schemas
from ..database.database import SessionLocal, engine
from ..config import Settings

################ Blueprint/Namespace Configuration ################

insect_api = APIRouter(tags=["Insects"])
models.Base.metadata.create_all(bind=engine)

################ Global Variables ################

storage_path = Settings.STORAGE_FOLDER
img_path = Settings.UPLOAD_FOLDER
is_prod = Settings.FLASK_ENV == 'production'

gbif_user = Settings.GBIF_USER
gbif_password = Settings.GBIF_PASSWORD

info_feature_is_enabled = gbif_password != "temp" and gbif_user != "temp"

################ Helper Functions ################

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def filter_json(json_obj, filter):
    return {k: v for k, v in json_obj.items() if k in filter}

def filter_json_except(json_obj, filter):
    return {k: v for k, v in json_obj.items() if k not in filter}

def check_if_cache_expired(last_updated):
    current_time = str(time())

    # Check if cache is expired (86400 seconds = 1 day)
    return float(current_time) - float(last_updated) > 86400

################ DEV API Endpoints ################

# @insect_api.post('/api/v1/DEV_check_database_for_insect', responses={200: {"description": "Success"}, 400: {"description": "Bad Request (Likely Invalid JSON)"}, 500: {"description": "Internal Server Error"}}, tags=["Insects"])
# def DEV_check_database_for_insect(name: str, db: Session = Depends(get_db)):
#     """
#         Checks database cache for insect
#     """
#     db_insect = crud.get_genus_by_genus_key(db, name)
#     if db_insect:
#         return {"insect": db_insect}
#     else:
#         return "Insect not found"

################ API Endpoints ################

@insect_api.get('/api/v1/is_insect_info_feature_enabled', responses={200: {"description": "Success"}, 400: {"description": "Bad Request"}, 500: {"description": "Internal Server Error"}}, tags=["Insects"])
def is_insect_info_feature_enabled():
    """
        Checks if the insect info feature is enabled
    """
    return {"enabled": info_feature_is_enabled}

@insect_api.post('/api/v1/get_insect_info', responses={200: {"description": "Success"}, 400: {"description": "Bad Request (Likely Invalid JSON)"}, 500: {"description": "Internal Server Error"}}, tags=["Insects"])
def get_Insect_Info(name: str, db: Session = Depends(get_db)):
    """
        Gets insect info from GBIF
    """
    if not info_feature_is_enabled:
        return ORJSONResponse(content={"error": "This feature is not enabled"}, status_code=500)
    
    endpoint = "https://api.gbif.org/v1/species/match"
    try:

        query = {"genus": name.replace("_", " ")}

        # Check database cache for insect
        genus = crud.get_genus_by_any_name(db, query["genus"])

        # If genus exists and cache is not expired, return genus
        if genus and not check_if_cache_expired(genus.time_updated):            
            return genus.as_dict()
        else:
            basic_auth = HTTPBasicAuth(gbif_user, gbif_password)
            response = requests.get(endpoint, params=query, auth=basic_auth)
            
            # If insect not found, return error
            if response.json()["matchType"] == "NONE":
                return ORJSONResponse(content={"error": "Insect not found"}, status_code=500)
            
            # If genus exists, update genus, else create genus
            if genus:
                crud.update_genus(db, data=response)
            else:    
                crud.create_genus(db, data=response)
            return filter_json(response.json(), ["genusKey", "scientificName", "canonicalName", "genus", "status", "kingdom", "phylum", "order", "family", "class"])
    except Exception as e:
        if is_prod:
            return ORJSONResponse(content={"error": "Internal Server Error"}, status_code=500)
        else:
            return JSONResponse(content={"error": str(e)}, status_code=500)
           
@insect_api.post('/api/v1/get_insect_occurances', responses={200: {"description": "Success"}, 400: {"description": "Bad Request (Likely Invalid JSON)"}, 500: {"description": "Internal Server Error"}}, tags=["Insects"])
def get_Insect_Occurances(genusKey: str, db: Session = Depends(get_db)):
    """
        Gets insect Occurances from GBIF
        (All info)
    """
    if not info_feature_is_enabled:
        return ORJSONResponse(content={"error": "This feature is not enabled"}, status_code=500)
    
    # Check database cache for insect
    db_insect_occurances = crud.get_genus_occurances_by_genus_key(db, int(genusKey))
    if db_insect_occurances and not check_if_cache_expired(db_insect_occurances.time_updated):
        return db_insect_occurances.as_dict()
    else:
        endpoint = "https://api.gbif.org/v1/occurrence/search"
        try:
            basic_auth = HTTPBasicAuth(gbif_user, gbif_password)
            query = {"genusKey": genusKey}
            response = requests.get(endpoint, params=query, auth=basic_auth)
            
            # If insect not found, return error
            if response.status_code != 200:
                return ORJSONResponse(content={"error": "Insect not found"}, status_code=500)

            # If genus exists, update genus, else create genus
            if db_insect_occurances:
                crud.update_genus_occurances(db, data=response, genus_Key=genusKey)
            else:
                crud.create_genus_occurances(db, data=response, genus_Key=genusKey)
            
            return response.json()
        except Exception as e:
            if is_prod:
                return ORJSONResponse(content={"error": "Internal Server Error"}, status_code=500)
            else:
                return JSONResponse(content={"error": str(e)}, status_code=500)
            
@insect_api.post('/api/v1/get_insect_occurances_count', responses={200: {"description": "Success"}, 400: {"description": "Bad Request (Likely Invalid JSON)"}, 500: {"description": "Internal Server Error"}}, tags=["Insects"])
def get_Insect_Occurances_Count(genusKey: str, db: Session = Depends(get_db)):
    """
        Gets insect Occurances from GBIF
        (Count only)
    """
    if not info_feature_is_enabled:
        return ORJSONResponse(content={"error": "This feature is not enabled"}, status_code=500)
    
    # Validate genusKey
    if not genusKey.isnumeric():
        return ORJSONResponse(content={"error": "GenusKey is not valid"}, status_code=500)

    # Check database cache for insect
    db_insect_occurances = crud.get_genus_occurances_by_genus_key(db, int(genusKey))
    if db_insect_occurances and not check_if_cache_expired(db_insect_occurances.time_updated):
        return filter_json(db_insect_occurances.as_dict(), ["count"])
    else:
        endpoint = "https://api.gbif.org/v1/occurrence/search"
        try:
            basic_auth = HTTPBasicAuth(gbif_user, gbif_password)
            query = {"genusKey": genusKey}
            response = requests.get(endpoint, params=query, auth=basic_auth)
            
            # If insect not found, return error
            if response.status_code != 200:
                return ORJSONResponse(content={"error": "Insect not found"}, status_code=500)

            # If genus exists, update genus, else create genus
            if db_insect_occurances:
                crud.update_genus_occurances(db, data=response, genus_key=genusKey)
            else:
                crud.create_genus_occurances(db, data=response, genusKey=genusKey)
            return filter_json(response.json(), ["count"])
        except Exception as e:
            
            import sys
            exc_type, exc_obj, exc_tb = sys.exc_info()
            fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
            print(exc_type, fname, exc_tb.tb_lineno)

            if is_prod:
                return ORJSONResponse(content={"error": "Internal Server Error"}, status_code=500)
            else:
                return JSONResponse(content={"error": str(e)}, status_code=500)