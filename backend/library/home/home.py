import os
from flask import Blueprint,render_template,current_app,make_response, send_from_directory, send_file, abort

import library.utilities.utilities as utilities
from secrets import token_urlsafe

home_blueprint = Blueprint(
    'home_bp',__name__
)

@home_blueprint.route('/')
@home_blueprint.route('/<path:path>')
def home(path="upload"):
    # Check if react build exists
    if os.path.exists(current_app.root_path+'\index.html'):
        return send_file('index.html')
    return "React Build not found", 404


# Serve robots.txt
# Technically not needed as this endpoint is only available to pywebview
# which does not use or need it
@home_blueprint.route('/robots.txt')
def robots():
    if os.path.exists(current_app.static_folder+'\\robots.txt'):
        return send_from_directory(os.path.join(current_app.root_path, 'static'), 'robots.txt')
    else:
        abort(404)

# Serve favicon
@home_blueprint.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(current_app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')

    