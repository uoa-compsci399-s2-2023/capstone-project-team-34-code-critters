from flask import Blueprint,render_template,url_for,make_response,session

import library.utilities.utilities as utilities
from secrets import token_urlsafe
import library.adapters.repository as repo

home_blueprint = Blueprint(
    'home_bp',__name__
)

@home_blueprint.route('/')
def home():
    res = make_response(render_template(
            'home/home.html'
        ))
    return res,200

    