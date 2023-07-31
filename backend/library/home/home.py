from flask import Blueprint,render_template,url_for,make_response,session

import backend.library.utilities.utilities as utilities
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


    