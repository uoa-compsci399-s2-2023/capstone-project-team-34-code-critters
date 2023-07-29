from sqlalchemy import (
    Table, MetaData, Column, Integer, String, Date, DateTime,
    ForeignKey
)
from sqlalchemy.orm import interfaces, mapper, relation, relationship, synonym,registry
from sqlalchemy.sql.expression import column, false

from library.domain import model

# global variable giving access to the MetaData (schema) information of the database
metadata = MetaData()

users_table = Table(
    'users', metadata,
    Column('id', Integer, unique=True, autoincrement=True),
    Column('user_name', String(255), primary_key=True),
    Column('password', String(255), nullable=False)
)

def map_model_to_tables():
    mapper_registry = registry()
    mapper_registry.map_imperatively(model.User, users_table, properties={
        '_User__user_id': users_table.c.id,
        '_User__user_name': users_table.c.user_name,
        '_User__password': users_table.c.password
    })
