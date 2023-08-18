from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from starlette.templating import Jinja2Templates
from pathlib import Path
import os

home_router = APIRouter()
static_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..\\")

####### Serve robots.txt ######
# Technically not needed as this endpoint is only available to pywebview
# which does not use or need it
@home_router.get("/robots.txt")
async def robots():
    if os.path.exists(static_path+"static/robots.txt"):
        return FileResponse(static_path+"static/robots.txt")
    else:
        return {"error": "File not found"}, 404

####### Serve favicon #######
@home_router.get("/favicon.ico")
async def favicon():
    return FileResponse(static_path+"static/favicon.ico")


####### Serve static files + React Build #######
@home_router.get("/")
@home_router.get("/{path:path}")
async def home(request: Request, path: str):    
    static_file_path = os.path.join(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..\\"), path)
    # Return Static Files from React Build otherwise return index.html
    if os.path.isfile(static_file_path):
        return FileResponse(static_file_path)    
    
    # Check if react build exists
    if os.path.exists("library/index.html"):
        return FileResponse("library/index.html")
    return "React Build not found", 404