"""App entry point."""
from library import create_app
import webview
import sys
import threading

# Hard coded config as config file does not work with pyinstaller
config = {}
config['FLASK_ENV'] = "production"
config['FLASK_DEPLOYMENT'] = "client+server"
config['UPLOAD_FOLDER'] = './library/static/uploads/'
config['STORAGE_FOLDER'] = './library/static/storage/'
config['MODEL_FOLDER'] = './library/models/'
config['ALLOWED_IMAGE_EXTENSIONS'] = ['PNG', 'JPG', 'JPEG', 'GIF']

app = create_app(config)
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



    