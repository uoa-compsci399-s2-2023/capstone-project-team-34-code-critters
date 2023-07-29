#from pathlib import Path

import csv
from tqdm import tqdm
from datetime import datetime
from werkzeug.security import generate_password_hash

import ast
from library.adapters.repository import AbstractRepository
from library.domain.model import User

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

def load_users(data_path: str, repo: AbstractRepository):
    users = []
    print("Loading Users")
    users_filename = data_path + "\\data\\users.csv"
    
    for data_row in tqdm(read_csv_file(users_filename)):
        user = User(
            user_name=data_row[1],
            password=generate_password_hash(data_row[2]),
            user_id=int(data_row[0])
        )
        repo.add_user(user)
        users.append(user)
    return users

def populate(repo: AbstractRepository,data_path:str="library\\adapters", database_mode: bool=False,lite=False):
    # Load users into the repository.
    users = load_users(data_path, repo)
    
