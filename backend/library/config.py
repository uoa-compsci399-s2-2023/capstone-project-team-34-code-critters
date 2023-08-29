"""Flask configuration variables."""
from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class Settings(BaseSettings):
    if os.path.exists(".env"):
        model_config = SettingsConfigDict(env_file=".env")
    
    FLASK_ENV: str = "temp"
    FLASK_APP: str = "temp"
    FLASK_DEPLOYMENT: str = "temp"

    UPLOAD_FOLDER: str = './library/static/uploads/'
    STORAGE_FOLDER: str = './library/static/storage/'
    MODEL_FOLDER: str = './library/models/'

    ALLOWED_IMAGE_EXTENSIONS: [list] = ['PNG', 'JPG', 'JPEG', 'GIF']