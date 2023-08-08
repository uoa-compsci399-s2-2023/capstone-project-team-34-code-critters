"""Flask configuration variables."""
from os import environ
from dotenv import load_dotenv

load_dotenv()

class Config:
    FLASK_APP = environ.get('FLASK_APP')
    FLASK_ENV = environ.get('FLASK_ENV')
   
    SECRET_KEY = environ.get('SECRET_KEY')
   
    TESTING = environ.get('TESTING')

    REPOSITORY = environ.get('REPOSITORY')

    UPLOAD_FOLDER = environ.get('UPLOAD_FOLDER')
    STORAGE_FOLDER = environ.get('STORAGE_FOLDER')
    MODEL_FOLDER = environ.get('MODEL_FOLDER')

    ALLOWED_IMAGE_EXTENSIONS = environ.get('ALLOWED_IMAGE_EXTENSIONS')