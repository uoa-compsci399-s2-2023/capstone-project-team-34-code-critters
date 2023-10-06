"""App entry point."""
import uvicorn
from library import create_app
app = create_app()

if __name__ == "__main__":
    uvicorn.run("asgi:app", reload=True, port=6789, log_config="log.ini")