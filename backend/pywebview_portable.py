"""App entry point."""
from library import create_app
import webview
import sys
import threading
import uvicorn

app = create_app("portable")
def start_server():
    uvicorn.run("pywebview_portable:app", port=80)

if __name__ == "__main__":
    t = threading.Thread(target=start_server)
    t.daemon = True
    t.start()
    
    webview.create_window("Insect Identification Application", "http://localhost/upload")
    webview.start()
    sys.exit()



    