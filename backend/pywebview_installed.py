"""App entry point."""
from library import create_app
import webview
import sys
import threading
import os

# Hard coded config as config file does not work with pyinstaller
AppData = os.getenv('APPDATA')
publisherName = "Code Critters"
appName = "Insect Identification Application"

config = {}
config['FLASK_ENV'] = "production"
config['FLASK_DEPLOYMENT'] = "client+server"
config['UPLOAD_FOLDER'] = f"{AppData}/{publisherName}/{appName}/library/static/uploads/"
config['STORAGE_FOLDER'] = f"{AppData}/{publisherName}/{appName}/library/static/storage/"
config['MODEL_FOLDER'] = './library/models/'
config['ALLOWED_IMAGE_EXTENSIONS'] = ['PNG', 'JPG', 'JPEG', 'GIF']


app = create_app(config)
def start_server():
    app.run(host='localhost', port=80, threaded=False)

if __name__ == "__main__":
    t = threading.Thread(target=start_server)
    t.daemon = True
    t.start()
    
    webview.create_window("Insect Identification Application", "http://localhost/upload")
    webview.start()
    sys.exit()


app = Flask(__name__)



    