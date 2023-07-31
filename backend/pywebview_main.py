"""App entry point."""
from library import create_app
import webview
import sys
import threading


app = create_app()
def start_server():
    app.run(host='localhost', port=80, threaded=False)

if __name__ == "__main__":
    t = threading.Thread(target=start_server)
    t.daemon = True
    t.start()
    
    webview.create_window("Insect Identification Application", "http://localhost/")
    webview.start()
    sys.exit()


app = Flask(__name__)



    