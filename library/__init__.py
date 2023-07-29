"""Initialize Flask app."""
import os
from flask import Flask, url_for, request,send_from_directory

def create_app(test_config=None):
    app = Flask(__name__)
    app.config.from_object('config.Config')

    # if test_config is not None:
    #     app.config.from_mapping(test_config)
    #     tests = True
    #     # populate(repo.repo_instance,"tests")
    # else:
    #     # populate(repo.repo_instance)
    #     tests = False
    
    with app.app_context():
    #     from .books import book
    #     app.register_blueprint(book.book_blueprint)

        from .home import home
        app.register_blueprint(home.home_blueprint)

    #     from .search import search
    #     app.register_blueprint(search.search_blueprint)

    #   from .authentication import authentication
    #   app.register_blueprint(authentication.authentication_blueprint)

        from .utilities import utilities
        app.register_blueprint(utilities.utilities_blueprint)

    # @app.route('/favicon.ico')
    # def favicon():
    #     return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')
        
    return app

