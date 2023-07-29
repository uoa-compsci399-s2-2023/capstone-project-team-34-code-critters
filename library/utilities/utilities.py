from flask import Blueprint, render_template, redirect, url_for, request
from werkzeug.utils import secure_filename

# import library.adapters.repository as repo
from library.utilities.standardise_images import standardise_images


# Configure Blueprint.
utilities_blueprint = Blueprint(
    'utilities_bp', __name__)


# def get_search_url():
#     return url_for('search_bp.search_interface')

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
    
    

# def get_list_url():
#     return url_for('book_bp.list_books')

# def get_register_url():
#     return url_for('authentication_bp.register')

# def get_login_url():
#     return url_for('authentication_bp.login')

# def get_logout_url():
#     return url_for('authentication_bp.logout')

# def get_selected_articles(quantity=3):
#     articles = services.get_random_articles(quantity, repo.repo_instance)

#     for article in articles:
#         article['hyperlink'] = url_for('news_bp.articles_by_date', date=article['date'].isoformat())
#     return articles
