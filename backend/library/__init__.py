"""Initialize Flask app."""
import os
from flask import Flask,Blueprint, request
from flask_restx import Api

def create_app(test_config=None):
    app = Flask(__name__)
    
    # app.config.from_object('config.Config')
    app.config["DIR_PATH"] = os.path.dirname(os.path.realpath(__file__))
    app.config["UPLOAD_FOLDER"] ='./library/static/uploads/'
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

        blueprint = Blueprint('api', __name__, url_prefix='/api')
        api = Api(blueprint, doc='/doc/')
        
        app.register_blueprint(blueprint)
        api.add_namespace(utilities.utils_api)
        
    return app

