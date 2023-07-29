from flask import Blueprint, render_template, redirect, url_for, request
from werkzeug.utils import secure_filename

# import library.adapters.repository as repo
from library.utilities.standardise_images import standardise_images


# Configure Blueprint.
utilities_blueprint = Blueprint(
    'utilities_bp', __name__)

def get_home_url():
    return url_for('home_bp.home')

@utilities_blueprint.route('/upload', methods=['GET', 'POST'])
def upload_files():
    if request.method == 'POST':
        f = request.files['file']
        filename = secure_filename(f.filename)
        f.save('/path/to/save/' + filename)
        standardise_images(filename)
        return 'File uploaded successfully'