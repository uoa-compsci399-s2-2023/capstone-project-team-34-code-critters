import abc
import re
from typing import List

from library.domain.model import User

repo_instance = None

class RepositoryException(Exception):

    def __init__(self, message=None):
        pass

class AbstractRepository():

    def __iter__(self):
        raise NotImplementedError

    def __next__(self):
        raise NotImplementedError
    
    def __len__(self):
        raise NotImplementedError

########################################        Users

    def add_user(self, user: User):
        raise NotImplementedError

    def get_user(self, user_name:str) -> User:
        raise NotImplementedError