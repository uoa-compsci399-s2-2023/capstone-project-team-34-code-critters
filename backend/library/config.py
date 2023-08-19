"""Flask configuration variables."""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")
    
    FLASK_ENV: str
    FLASK_APP: str
    FLASK_DEPLOYMENT: str

    UPLOAD_FOLDER: str
    STORAGE_FOLDER: str
    MODEL_FOLDER: str

    ALLOWED_IMAGE_EXTENSIONS: [list]
