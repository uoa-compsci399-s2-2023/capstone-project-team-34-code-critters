"""App entry point."""
from library import create_app
import webview
import sys
import threading
import os
import uvicorn

# Hard coded config as config file does not work with pyinstaller
AppData = os.getenv('APPDATA')
publisherName = "Code Critters"
appName = "CritterSleuth"
backendPort = 6789

app = create_app("installed", [AppData, publisherName, appName])
def start_server():
    uvicorn.run(app, port=backendPort)

if __name__ == "__main__":
    t = threading.Thread(target=start_server)
    t.daemon = True
    t.start()
    
    webview.create_window("CritterSleuth", f"http://localhost:{backendPort}/upload")
    webview.start()
    sys.exit()



    