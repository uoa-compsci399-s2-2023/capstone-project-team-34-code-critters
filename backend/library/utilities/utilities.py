from fastapi import APIRouter, UploadFile
from fastapi.responses import ORJSONResponse, JSONResponse, FileResponse
from fastapi import Query
from werkzeug.utils import secure_filename

import shutil

import os
from ..config import Settings

from library.utilities.inference import get_prediction

################ Blueprint/Namespace Configuration ################
utils_api = APIRouter(tags=["Utilities"])

################ Global Variables ################
img_path = Settings.UPLOAD_FOLDER
models_path = Settings.MODEL_FOLDER
isProduction = Settings.FLASK_ENV == 'production'

################ Helper Functions ################
def is_file_allowed(filename):
    if not "." in filename:
        return False
    ext = filename.rsplit(".", 1)[1]
    return ext.upper() in Settings.ALLOWED_IMAGE_EXTENSIONS

################ API Endpoints ################

@utils_api.post('/api/v1/upload_json', responses={200: {"description": "Success"}, 400: {"description": "Bad Request"}, 405: {"description": "Method Not Allowed"}, 500: {"description": "Internal Server Error"}}, tags=["Utilities"])
# NOTE: currently files does not support documenation:
# Intended documentation: "List of files to upload"
async def upload_files_json(files: list[UploadFile], model: str | None = Query(None, description="Model to use for prediction. If not specified, the default model will be used.")):
    """
     Takes in a list of Image files and returns a list of predictions in JSON format.
    """
    try:

        # Checks if the model is valid before uploading
        if model and model not in available_models():
            return ORJSONResponse(content={"error": "Model not found"}, status_code=400)     
        
        returnList = []

        for file in files:
            # Check if the file extension is allowed
            if not is_file_allowed(file.filename):
                return ORJSONResponse(content={"error": "File type not allowed"}, status_code=405)
            file_path = os.path.join(img_path, secure_filename(file.filename))
            # Save the file to disk
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            # Get the prediction
            if model:
                prediction = get_prediction(file_path, model)
            else: 
                prediction = get_prediction(file_path)
            returnList.append({"name": file.filename, "pred": prediction})

        return JSONResponse(content=returnList)
    except Exception as e:
        if isProduction:
            return ORJSONResponse(content={"error": "Internal Server Error"}, status_code=500)
        else:
            return JSONResponse(content={"error": str(e)}, status_code=500)

def available_models():
    subfolders = [os.path.basename(f.path) for f in os.scandir(models_path) if f.is_dir()]
    return subfolders

@utils_api.get('/api/v1/available_models', tags=["Utilities"])
async def get_available_models():
    """
        Returns a list of available models.
    """
    return JSONResponse(content=available_models())

@utils_api.get('/api/v1/get_image', tags=["Utilities"])
async def get_image(image_name: str):
    """ 
        Returns an image from the uploads folder.
    """
    try:
        filename = secure_filename(image_name)
        filepath = os.path.join(img_path, filename)
        
        if not os.path.isfile(filepath) or is_file_allowed(filename) == False:
            return {"error": "File not found"}
        
        return FileResponse(filepath)
    except Exception as e:
        if isProduction:
            return ORJSONResponse(content={"error": "Internal Server Error"}, status_code=500)
        else:
            return JSONResponse(content={"error": str(e)}, status_code=500)