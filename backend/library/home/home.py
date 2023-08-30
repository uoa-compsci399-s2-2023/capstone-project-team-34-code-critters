from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse, FileResponse, ORJSONResponse
from fastapi.staticfiles import StaticFiles
import os

home_router = APIRouter(tags=["Home"])
static_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")

####### Serve robots.txt ######
# Technically not needed as this endpoint is only available to pywebview
# which does not use or need it
@home_router.get("/robots.txt", responses={200: {"description": "Success"}, 404: {"description": "Not Found"}})
async def robots():
    """
        Serves robots.txt
    """

    if os.path.exists(static_path+"static/robots.txt"):
        return FileResponse(static_path+"static/robots.txt")
    else:
        return ORJSONResponse(content={"error": "File not found"}, status_code=404)

####### Serve favicon #######
@home_router.get("/favicon.ico", responses={200: {"description": "Success"}, 404: {"description": "Not Found"}})
async def favicon():
    """
        Serves the favicon
    """
    if os.path.exists(static_path+"static/favicon.ico"):
        return FileResponse(static_path+"static/favicon.ico")
    else:
        return ORJSONResponse(content={"error": "File not found"}, status_code=404)


####### Serve static files + React Build #######
@home_router.get("/")
@home_router.get("/{path:path}", responses={200: {"description": "Success"}, 404: {"description": "Not Found"}})
async def home(request: Request, path: str=None):
    """
        Serves the React Build
    """ 
    static_file_path = os.path.join(static_path, path)
    
    ## Return Static Files for React Build
    # Check if static file is a js or css file (Otherwise, it can leak uploads and exports)
    if static_file_path.endswith(".js") or static_file_path.endswith(".css"):
        # Checks if Static file exists
        if os.path.isfile(static_file_path):
            return FileResponse(static_file_path)    
    
    # Check if react build exists
    if os.path.exists("library/templates/index.html"):
        return HTMLResponse(open("library/templates/index.html", "r").read())
    return ORJSONResponse(content={"error": "React Build not found"}, status_code=404)