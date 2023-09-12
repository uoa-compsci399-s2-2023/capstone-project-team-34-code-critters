"""App entry point."""
import uvicorn
from library import create_app
app = create_app(config="server")

if __name__ == "__main__":
    uvicorn.run(app, port=6789)