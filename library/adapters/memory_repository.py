import csv
from pathlib import Path
from datetime import date, datetime
from typing import List

from bisect import bisect, bisect_left, insort_left

from werkzeug.security import generate_password_hash
from library.adapters import jsondatareader

from library.adapters.repository import AbstractRepository, RepositoryException
from library.domain.model import User
from tqdm import tqdm

class MemoryRepository(AbstractRepository):
    # books ordered by date, not id. id is assumed unique.

    def __init__(self):
        self.__users = list()

    def __iter__(self):
        self._current = 0
        return self
    
    def __next__(self):
        if self._current >= len(self.__books_inventory):
            raise StopIteration
        else:
            self._current +=1
            return self.__books_inventory.all_books[self._current-1]

    def __len__(self):
        return len(self.__books_inventory)

########################################        Users

    def add_user(self, user: User):
        self.__users.append(user)

    def get_user(self, user_name = None) -> User:
        return next((user for user in self.__users if user.user_name == user_name), None)

def read_csv_file(filename: str):
    with open(filename) as infile:
        reader = csv.reader(infile)

        # Read first line of the the CSV file.
        headers = next(reader)

        # Read remaining rows from the CSV file.
        for row in reader:
            # Strip any leading/trailing white space from data read.
            row = [item.strip() for item in row]
            yield row
    
def populate(repo: MemoryRepository,data_path:str="library\\adapters"):

    # Load users into the repository.
    users = load_users(data_path, repo)

    # Load reviews into the repository.
    load_reviews(data_path, repo, users)
    print("Loading Complete")

def load_users(data_path: str, repo: MemoryRepository):
    users = []
    print("Loading Users")
    users_filename = data_path + "\\data\\users.csv"
    
    for data_row in tqdm(read_csv_file(users_filename)):
        user = User(
            user_name=data_row[1],
            password=generate_password_hash(data_row[2])
        )
        repo.add_user(user)
        users.append(user)
    return users


