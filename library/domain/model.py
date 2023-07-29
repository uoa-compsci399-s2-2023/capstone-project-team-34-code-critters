from bisect import insort_left
import datetime
from random import choice, choices

class User:
    def __init__(self,user_name:str,password:str,user_id:int=0) -> None:
        self.__user_name = None
        self.__password = None
        self.__user_id = user_id

        if isinstance(user_name,str) and user_name.strip() != "":
            self.__user_name = user_name.strip().lower()
        if isinstance(password, str) and len(password) >=7:
            self.__password = password
    
    @property
    def user_id(self):
        return self.__user_id
        
    @property
    def user_name(self):
        return self.__user_name
    
    @property
    def password(self):
        return self.__password

    def __repr__(self) -> str:
        return f"<User {self.user_name}>"
    
    def __eq__(self, other) -> bool:
        if isinstance(other,User):
            return self.user_name == other.user_name
        else:
            return False
    
    def __lt__(self,other):
        if isinstance(other,User):
            return self.user_name < other.user_name
        else:
            return False
    
    def __hash__(self) -> int:
        return hash(self.user_name)

class ModelException(Exception):
    pass
