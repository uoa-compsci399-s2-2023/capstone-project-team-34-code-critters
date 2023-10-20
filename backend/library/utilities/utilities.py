from fastapi import APIRouter, UploadFile, Query, WebSocket
from fastapi.responses import ORJSONResponse, JSONResponse, FileResponse
from werkzeug.utils import secure_filename
import mmh3
import asyncio


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
import keras
from PIL import Image
from glob import glob
import numpy as np
import tensorflow as tf
## This function is not intended to be used.
## It is only used to force the imports to imported in pyinstaller
def forceImports():
    img = Image.open()
    img = np.array()
    model = keras.load_model()
    img = tf.io.read_file()

def is_file_allowed(filename):
    if not "." in filename:
        return False
    ext = filename.rsplit(".", 1)[1]
    return ext.upper() in Settings.ALLOWED_IMAGE_EXTENSIONS

################ API Endpoints ################

@utils_api.post('/api/v1/upload_json', responses={200: {"description": "Success"}, 400: {"description": "Bad Request"}, 405: {"description": "Method Not Allowed"}, 500: {"description": "Internal Server Error"}}, tags=["Utilities"])
# NOTE: currently files does not support documenation:
# Intended documentation: "List of files to upload"
def upload_files_json(files: list[UploadFile], model: str | None = Query(None, description="Model to use for prediction. If not specified, the default model will be used.")):
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
            # Get the hash of the file and rename the file
            with open(file_path, "rb") as buffer:
                hash = mmh3.hash(buffer.read())

            file_ext = os.path.splitext(file_path)[1]
            filename_without_ext = os.path.splitext(secure_filename(file.filename))[0]

            new_path = os.path.join(img_path, f"{filename_without_ext}.{str(hash)}{file_ext}")
            if not os.path.isfile(new_path):
                os.rename(file_path, new_path)
            # Get the prediction
            if model:
                prediction = get_prediction(file_path, new_path, model)
            else: 
                prediction = get_prediction(file_path, new_path)
            returnList.append({"name": file.filename, "pred": prediction, "hash": hash})

        return JSONResponse(content=returnList)
    except Exception as e:
        if isProduction:
            return ORJSONResponse(content={"error": "Internal Server Error"}, status_code=500)
        else:
            return JSONResponse(content={"error": str(e)}, status_code=500)

def available_models():
    subfolders = [os.path.basename(f.path) for f in os.scandir(models_path) if f.is_dir()]
    return sorted(subfolders)

@utils_api.get('/api/v1/available_models', tags=["Utilities"])
def get_available_models():
    """
        Returns a list of available models.
    """
    return JSONResponse(content=available_models())

@utils_api.get('/api/v1/get_image', tags=["Utilities"])
def get_image(image_name: str, hash: str):
    """ 
        Returns an image from the uploads folder.
    """
    try:
        filename = secure_filename(image_name)
        file_ext = os.path.splitext(filename)[1]
        filename_without_ext = os.path.splitext(filename)[0]
        filename_with_hash = f"{filename_without_ext}.{hash}{file_ext}"

        filepath = os.path.join(img_path, filename_with_hash)
        
        if not os.path.isfile(filepath) or is_file_allowed(filename) == False:
            return {"error": "File not found"}
        
        return FileResponse(filepath)
    except Exception as e:
        if isProduction:
            return ORJSONResponse(content={"error": "Internal Server Error"}, status_code=500)
        else:
            return JSONResponse(content={"error": str(e)}, status_code=500)
        
if Settings.LOGGING == True:
    @utils_api.websocket('/ws/logs')
    def logging(websocket: WebSocket):
        websocket.accept()

        try:
            while True:
                asyncio.sleep(1)
                logs = log_reader(30)
                websocket.send_text(logs)
        except Exception as e:
            print(e)
        finally:
            websocket.close()

    def log_reader(n=10):
        log_lines = []
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        with open(f"{base_dir}\logfile.log", "r") as file:
            for line in file.readlines()[-n:]:
                if line.__contains__("ERROR"):
                    log_lines.append(f'<span class="text-red-400">{line}</span><br/>')
                elif line.__contains__("WARNING"):
                    log_lines.append(f'<span class="text-orange-300">{line}</span><br/>')
                else:
                    log_lines.append(f"{line}<br/>")
            return log_lines