from pydantic import BaseModel

class Genus(BaseModel):
    genus_key: int
    scientific_name: str
    canonical_name: str
    genus_name: str
    status: str
    kingdom: str
    phylum: str
    order: str
    family: str
    _class: str
    time_updated: str

    class Config:
        orm_mode = True

class GenusOccurances(BaseModel):
    genus_key: int
    count: int
    offset: int
    limit: int
    end_of_records: bool
    results: dict
    time_updated: str

    class Config:
        orm_mode = True

class GenusCreate(Genus):
    pass

class GenusOccurancesCreate(GenusOccurances):
    pass