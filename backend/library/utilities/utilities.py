from flask import Blueprint, render_template, redirect, url_for, request, current_app
from werkzeug.utils import secure_filename

# import library.adapters.repository as repo
from backend.library.utilities.standardise_images import standardise_image
from backend.library.utilities.inference import get_prediction

# Configure Blueprint.
utilities_blueprint = Blueprint(
    'utilities_bp', __name__)


img_path = current_app.config['UPLOAD_FOLDER']

def get_home_url():
    return url_for('home_bp.home')

@utilities_blueprint.route('/upload', methods=['GET', 'POST'])
def upload_files():
    if request.method == 'POST':
        
        f = request.files['file']
        
        filename = secure_filename(f.filename)

        f.save(img_path + filename)
        # standardise_image(img_path, filename)
        pred = get_prediction(img_path + filename)
        print(pred)
        results = ", ".join("({:.5f}, {})".format(x,y) for (x,y) in pred)
        # print(results)
        return redirect(url_for('home_bp.home', results= results))
        return 'File uploaded successfully'