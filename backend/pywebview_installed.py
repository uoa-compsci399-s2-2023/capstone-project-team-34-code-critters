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

app = create_app("installed", [AppData, publisherName, appName])
def start_server():
    uvicorn.run(app, port=80)

if __name__ == "__main__":
    t = threading.Thread(target=start_server)
    t.daemon = True
    t.start()
    
    webview.create_window("CritterSleuth", "http://localhost/upload")
    webview.start()
    sys.exit()



    