"""Initialize Flask app."""
import os
from flask import Flask, url_for, request,send_from_directory

def create_app(test_config=None):
    app = Flask(__name__)
    # app.config.from_object('config.Config')
    app.config["DIR_PATH"] = os.path.dirname(os.path.realpath(__file__))
    app.config["UPLOAD_FOLDER"] ='./backend/library/static/uploads/'
    app.config["ALLOWED_IMAGE_EXTENSIONS"] = ["JPEG", "JPG", "PNG", "GIF"]
    
    # if test_config is not None:
    #     app.config.from_mapping(test_config)
    # else:
    #     tests = False
    
    with app.app_context():

        from .home import home
        app.register_blueprint(home.home_blueprint)


        from .utilities import utilities
        app.register_blueprint(utilities.utilities_blueprint)

    @app.route('/favicon.ico')
    def favicon():
        return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')
        
    return app

