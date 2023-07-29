from datetime import date
from typing import List
from unicodedata import name

from sqlalchemy import desc, asc
from sqlalchemy.orm.exc import NoResultFound, MultipleResultsFound

from sqlalchemy.orm import scoped_session
from flask import _app_ctx_stack

from random import sample

from sqlalchemy.sql import base
from sqlalchemy.sql.schema import Table
from library.domain.model import User
from library.adapters.repository import AbstractRepository, RepositoryException

class SessionContextManager:
    def __init__(self, session_factory):
        self.__session_factory = session_factory
        self.__session = scoped_session(self.__session_factory, scopefunc=_app_ctx_stack.__ident_func__)

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.rollback()

    @property
    def session(self):
        return self.__session

    def commit(self):
        self.__session.commit()

    def rollback(self):
        self.__session.rollback()

    def reset_session(self):
        # this method can be used e.g. to allow Flask to start a new session for each http request,
        # via the 'before_request' callback
        self.close_current_session()
        self.__session = scoped_session(self.__session_factory, scopefunc=_app_ctx_stack.__ident_func__)

    def close_current_session(self):
        if not self.__session is None:
            self.__session.close()


class SqlAlchemyRepository(AbstractRepository):

    def __init__(self, session_factory):
        self._session_cm = SessionContextManager(session_factory)

    def close_session(self):
        self._session_cm.close_current_session()

    def reset_session(self):
        self._session_cm.reset_session()

########################################        Users

    def add_user(self, user: User):
        if self._session_cm.session.query(User).filter(User._User__user_id == user.user_id).first() == None:
            with self._session_cm as scm:
                scm.session.add(user)
                scm.commit()
        else:
            if self._session_cm.session.query(User).filter(User._User__user_name == user.user_name).first() == None:
                check = self._session_cm.session.query(User).order_by(desc(User._User__user_id)).first()
                temp = User(user_name=user.user_name,password=user.password,user_id=check.user_id + 1)
                for book in user.reading_list:
                    user.add_book_to_reading_list(book)

                with self._session_cm as scm:
                    scm.session.add(temp)
                    scm.commit()

            

    def get_user(self, user_name: str) -> User:
        user = None
        try:
            user = self._session_cm.session.query(User).filter(User._User__user_name == user_name.lower()).one()
        except NoResultFound:
            # Ignore any exception and return None.
            pass

        return user