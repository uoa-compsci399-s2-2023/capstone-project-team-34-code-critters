"""Flask configuration variables."""
from typing import Any
from pydantic_settings import BaseSettings, SettingsConfigDict
import os

library_path = os.path.dirname(os.path.abspath(__file__))
class settingsModel(BaseSettings):
    FLASK_ENV: str = "temp"
    FLASK_DEPLOYMENT: str = "temp"
    UPLOAD_FOLDER: str =  os.path.join(library_path ,'static/uploads/')
    STORAGE_FOLDER: str = os.path.join(library_path ,'static/storage/')
    MODEL_FOLDER: str = os.path.join(library_path ,'models/')

    ALLOWED_IMAGE_EXTENSIONS: Any = ['PNG', 'JPG', 'JPEG', 'GIF', 'WEBP']
    GBIF_USER: str = "temp"
    GBIF_PASSWORD: str = "temp"

    LOGGING: bool = False

    model_config = SettingsConfigDict(
        env_file=(
            ".env",
            ".env.production.local",
            ".env.development.local"
        )
    )
    


Settings = settingsModel()
