from flask import Blueprint, render_template, redirect, url_for, request, current_app
from werkzeug.utils import secure_filename
from werkzeug.datastructures import FileStorage
from flask_restx import Namespace, Resource, fields

from library.utilities.inference import get_prediction

import os
################ Blueprint/Namespace Configuration ################
utilities_blueprint = Blueprint('utilities_bp', __name__)
utils_api = Namespace('utilities_api', description='Utilities related operations')
upload_parser = utils_api.parser()
upload_parser.add_argument('file[]', location='files', type=FileStorage, required=True, help='Image file to upload (This cannot test multiple files)')
upload_parser.add_argument('model', location='args', type=str, help='Optional Arg to specify model to use')

################ Global Variables ################
img_path = current_app.config['UPLOAD_FOLDER']
models_path = current_app.config['MODEL_FOLDER']

################ Helper Functions ################
def isFileAllowed(filename):
    if not "." in filename:
        return False
    ext = filename.rsplit(".", 1)[1]
    return ext.upper() in current_app.config["ALLOWED_IMAGE_EXTENSIONS"]

################ API Endpoints ################

# Legacy Endpoint: JINJA TEMPLATES ONLY
@utilities_blueprint.route('/upload', methods=['GET','POST'])
def upload_files():        
    if request.method == 'POST':
        f = request.files.getlist('file[]')
        return_list = []
        for file in f:        
            filename = secure_filename(file.filename)
            if not isFileAllowed(filename):
                return redirect(url_for('home_bp.home'), result="Invalid File type")
            file.save(img_path + filename)

            pred = get_prediction(img_path + filename)        
            results = ", ".join("({}, {})".format(x,y) for (x,y) in pred)
            return_list.append(results)

        return redirect(url_for('home_bp.home', results= return_list))
@utils_api.route('/upload_json')
class upload_files_json(Resource):
    
    @utils_api.response(200, 'Success')
    @utils_api.response(400, 'Bad Request')
    @utils_api.response(405, 'Invalid File Type')
    @utils_api.expect(upload_parser)
    @utils_api.doc(description="Uploads an image and returns the prediction")
    @utilities_blueprint.route('/upload_json', methods=['POST']) # LEGACY
    def post(self):
        # Checks if the model is valid before uploading
        model = request.args.get('model')
        if model and model not in available_models.get(self):
            return "Invalid Model", 400
        
        # Uploads the file and returns the prediction
        f = request.files.getlist('file[]')     
        return_list = []
        for file in f:        
            filename = secure_filename(file.filename)
            if not isFileAllowed(filename):
                return "Invalid File type", 405
            file.save(img_path + filename)

            if model:
                pred = get_prediction(img_path + filename, model)
            else:
                pred = get_prediction(img_path + filename)
            
            print(pred)
            return_list.append({"name":filename, "pred":pred})
                
        return return_list
        

@utils_api.route('/available_models')
class available_models(Resource):
    @utils_api.response(200, 'Success')
    def get(self):
        subfolders = [os.path.basename(f.path) for f in os.scandir(models_path) if f.is_dir()]
        return subfolders