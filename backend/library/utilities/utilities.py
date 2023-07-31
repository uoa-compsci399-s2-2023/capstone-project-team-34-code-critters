from flask import Blueprint, render_template, redirect, url_for, request, current_app
from werkzeug.utils import secure_filename

# import library.adapters.repository as repo
from library.utilities.standardise_images import standardise_image
from library.utilities.inference import get_prediction

# Configure Blueprint.
utilities_blueprint = Blueprint(
    'utilities_bp', __name__)

img_path = current_app.config['UPLOAD_FOLDER']

def isFileAllowed(filename):
    if not "." in filename:
        return False
    ext = filename.rsplit(".", 1)[1]
    return ext.upper() in current_app.config["ALLOWED_IMAGE_EXTENSIONS"]

def get_home_url():
    return url_for('home_bp.home')


# Returns 
@utilities_blueprint.route('/upload', methods=['GET','POST'])
def upload_files():        
    if request.method == 'POST':
        f = request.files.getlist('file[]')
        return_list = []
        for file in f:        
            filename = secure_filename(file.filename)
            if not isFileAllowed(filename):
                return redirect(get_home_url(), result="Invalid File type")
            file.save(img_path + filename)

            pred = get_prediction(img_path + filename)        
            results = ", ".join("({:.5f}, {})".format(x,y) for (x,y) in pred)
            return_list.append(results)

        return redirect(url_for('home_bp.home', results= return_list))

# Returns a JSON object with filenames and predictions
@utilities_blueprint.route('/upload_json', methods=['POST'])
def upload_files_json():    
    f = request.files.getlist('file[]')
    return_list = []
    for file in f:        
        filename = secure_filename(file.filename)
        if not isFileAllowed(filename):
            return redirect(get_home_url(), result="Invalid File type")
        file.save(img_path + filename)
        # standardise_image(img_path, filename)
        pred = get_prediction(img_path + filename)
        return_list.append({"name":filename, "pred":pred})
            
    return return_list
        

