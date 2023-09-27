from fastapi import APIRouter, Request, Body
from fastapi.responses import FileResponse, ORJSONResponse, JSONResponse
import requests
from requests.auth import HTTPBasicAuth
import os

from ..config import Settings

################ Blueprint/Namespace Configuration ################

utils_api = APIRouter(tags=["Utilities"])

################ Global Variables ################

storage_path = Settings.STORAGE_FOLDER
img_path = Settings.UPLOAD_FOLDER
is_prod = Settings.FLASK_ENV == 'production'

gbif_user = Settings.GBIF_USER
gbif_password = Settings.GBIF_PASSWORD

################ Helper Functions ################

# def resize_img(path):
#     img = PILimg.open(path)
#     img = ImageOps.fit(img, (100, 100), method=PILimg.Resampling.LANCZOS)
#     img.save(path)

################ API Endpoints ################
@utils_api.post('/api/v1/get_insect', responses={200: {"description": "Success"}, 400: {"description": "Bad Request (Likely Invalid JSON)"}, 500: {"description": "Internal Server Error"}}, tags=["Utilities"])
async def getInsectInfo(name: str):
    """
        Gets insect info from GBIF
    """
    endpoint = "https://api.gbif.org/v1/species/match"
    try:
        basic_auth = HTTPBasicAuth(gbif_user, gbif_password)
        query = {"genus": name}
        response = requests.get(endpoint, params=query, auth=basic_auth)
        print(response.json())
        return response.json()
    except Exception as e:
        if is_prod:
            return ORJSONResponse(content={"error": "Internal Server Error"}, status_code=500)
        else:
            return JSONResponse(content={"error": str(e)}, status_code=500)
           
@utils_api.post('/api/v1/get_insect_info', responses={200: {"description": "Success"}, 400: {"description": "Bad Request (Likely Invalid JSON)"}, 500: {"description": "Internal Server Error"}}, tags=["Utilities"])
async def getInsectOccurances(genusKey: str):
    """
        Gets insect Occurances from GBIF
    """
    endpoint = "https://api.gbif.org/v1/occurrence/search"
    try:
        basic_auth = HTTPBasicAuth(gbif_user, gbif_password)
        query = {"genusKey": genusKey}
        response = requests.get(endpoint, params=query, auth=basic_auth)
        print(response.json())
        return response.json()
    except Exception as e:
        if is_prod:
            return ORJSONResponse(content={"error": "Internal Server Error"}, status_code=500)
        else:
            return JSONResponse(content={"error": str(e)}, status_code=500)

