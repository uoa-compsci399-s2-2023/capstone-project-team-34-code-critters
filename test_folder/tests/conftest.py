import pytest

from library import create_app
from library.adapters import memory_repository
from library.adapters.memory_repository import MemoryRepository, populate#,populate_books

from utils import get_project_root

TEST_DATA_PATH = get_project_root() /'test_folder'/ "tests" / "data"

import os
import pytest


@pytest.fixture
def in_memory_repo():
    # repo = MemoryRepository("tests\data\\books.json","tests\data\\authors.json")
    repo = MemoryRepository()
    populate(repo,"test_folder\\tests")
    
    # populate_books(repo,"tests")
    
    return repo


@pytest.fixture
def client():
    my_app = create_app({
        'TESTING': True,                                # Set to True during testing.
        'WTF_CSRF_ENABLED': False,                       # test_client will not send a CSRF token, so disable validation.
        'REPOSITORY': 'memory'
    })

    return my_app.test_client()


class AuthenticationManager:
    def __init__(self, client):
        self.__client = client

    def login(self, user_name='thorke', password='cLQ^C#oFXloS'):
        return self.__client.post(
            'authentication/login',
            data={'user_name': user_name, 'password': password}
        )

    def logout(self):
        return self.__client.get('/auth/logout')


@pytest.fixture
def auth(client):
    return AuthenticationManager(client)
