"""App entry point."""
from library import create_app
import webview
import sys
import threading
import uvicorn

app = create_app("portable")
backendPort = 6789
def start_server():
    uvicorn.run(app, port=backendPort)

if __name__ == "__main__":
    t = threading.Thread(target=start_server)
    t.daemon = True
    t.start()
    
    webview.create_window("CritterSleuth", f"http://localhost:{backendPort}/upload")
    webview.start()
    sys.exit()



    