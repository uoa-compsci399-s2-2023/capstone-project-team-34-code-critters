import os
from flask import Blueprint,render_template,current_app,make_response,session, send_from_directory

import library.utilities.utilities as utilities
from secrets import token_urlsafe

home_blueprint = Blueprint(
    'home_bp',__name__
)

@home_blueprint.route('/')
@home_blueprint.route('/?<results>')
def home(results=None):
    if results is None:
        res = make_response(render_template(
                'home/home.html'
            ))
    else:
        print("this ran")
        print(results)
        res = make_response(render_template(
                'home/home.html',
                results=results
            ))
    return res,200

# Add favicon
@home_blueprint.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(current_app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')

    