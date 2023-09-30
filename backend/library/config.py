"""Flask configuration variables."""
from pydantic_settings import BaseSettings, SettingsConfigDict
import os

library_path = os.path.dirname(os.path.abspath(__file__))
class settingsModel(BaseSettings):
    FLASK_ENV: str = "temp"
    FLASK_DEPLOYMENT: str = "temp"
    UPLOAD_FOLDER: str =  os.path.join(library_path ,'static/uploads/')
    STORAGE_FOLDER: str = os.path.join(library_path ,'static/storage/')
    MODEL_FOLDER: str = os.path.join(library_path ,'models/')

    ALLOWED_IMAGE_EXTENSIONS: [list] = ['PNG', 'JPG', 'JPEG', 'GIF']
    GBIF_USER: str = "temp"
    GBIF_PASSWORD: str = "temp"

    model_config = SettingsConfigDict(
        env_file=(
            ".env",
            ".env.production.local",
            ".env.development.local"
        )
    )
        
        


Settings = settingsModel()
