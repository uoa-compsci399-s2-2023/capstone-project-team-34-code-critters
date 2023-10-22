from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.types import JSON
from sqlalchemy.orm import relationship


from .database import Base

class Genus(Base):
    __tablename__ = "genus"

    species_key = Column(Integer, primary_key=True, index=True)
    genus_key = Column(Integer, index=True)
    
    scientific_name = Column(String, index=True)
    canonical_name = Column(String, index=True)
    genus_name = Column(String, index=True)

    status = Column(String)
    kingdom = Column(String)
    phylum = Column(String)
    order = Column(String)
    family = Column(String)
    _class = Column(String)
    time_updated = Column(String)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class GenusOccurances(Base):
    __tablename__ = "genus_occurances"

    genus_key = Column(Integer, primary_key=True, index=True)
    count = Column(Integer)

    offset = Column(Integer)
    limit = Column(Integer)
    end_of_records = Column(Boolean)
    
    results = Column(JSON)
    time_updated = Column(String)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
