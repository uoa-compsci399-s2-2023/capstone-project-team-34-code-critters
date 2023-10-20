from sqlalchemy.orm import Session
from requests import Response
from time import time

from . import models, schemas

#### Genus (General) ####

def get_genus_by_genus_key(db: Session, genus_key: int):
    return db.query(models.Genus).filter(models.Genus.genus_key == genus_key).first()

def get_genus_by_name(db: Session, genus_name: str):
    return db.query(models.Genus).filter(models.Genus.genus_name == genus_name.lower()).first()

def get_genus_by_scientific_name(db: Session, scientific_name: str):
    return db.query(models.Genus).filter(models.Genus.scientific_name == scientific_name.lower()).first()

def get_genus_by_canonical_name(db: Session, canonical_name: str):
    return db.query(models.Genus).filter(models.Genus.canonical_name == canonical_name.lower()).first()

def get_genus_by_any_name(db: Session, name: str):
    return db.query(models.Genus).filter(models.Genus.genus_name == name.lower() or models.Genus.scientific_name == name.lower() or models.Genus.canonical_name == name.lower()).first()

def create_genus(db: Session, data: Response):
    current_time = str(time())
    json = data.json()
    db_genus = models.Genus(genus_key=json["genusKey"], scientific_name=json["scientificName"].lower(), canonical_name=json["canonicalName"].lower(), genus_name=json["genus"].lower(), status=json["status"].lower(), kingdom=json["kingdom"].lower(), phylum=json["phylum"].lower(), order=json["order"].lower(), family=json["family"].lower(), _class=json["class"].lower(), time_updated=current_time)
    # db_genus = models.Genus(genus_key=json["genusKey"], scientific_name=json["scientificName"], canonical_name=json["canonicalName"], genus_name=json["genus"], status=json["status"], kingdom=json["kingdom"], phylum=json["phylum"], order=json["order"], family=json["family"], _class=json["class"], time_updated=current_time)
    db.add(db_genus)
    db.commit()
    db.refresh(db_genus)
    return db_genus

def update_genus(db: Session, data: Response):
    current_time = str(time())
    json = data.json()
    db_genus = db.query(models.Genus).filter(models.Genus.genus_key == json["genusKey"]).first()
    db_genus.genus_key = json["genusKey"]
    db_genus.scientific_name = json["scientificName"].lower()
    db_genus.canonical_name = json["canonicalName"].lower()
    db_genus.genus_name = json["genus"].lower()
    db_genus.status = json["status"].lower()
    db_genus.kingdom = json["kingdom"].lower()
    db_genus.phylum = json["phylum"].lower()
    db_genus.order = json["order"].lower()
    db_genus.family = json["family"].lower()
    db_genus._class = json["class"].lower()
    db_genus.time_updated = current_time
    db.commit()
    db.refresh(db_genus)
    return db_genus

#### Genus Occurances ####

def get_genus_occurances_by_genus_key(db: Session, genus_key: int):
    return db.query(models.GenusOccurances).filter(models.GenusOccurances.genus_key == genus_key).first()

def create_genus_occurances(db: Session, data: Response, genusKey: int):
    current_time = str(time())
    json = data.json()
    db_genus_occurances = models.GenusOccurances(genus_key=genusKey, count=json["count"], offset=json["offset"], limit=json["limit"], end_of_records=json["endOfRecords"], results=json["results"], time_updated=current_time)
    # db_genus_occurances = models.GenusOccurances(genus_key=genus_occurances.genus_key, count=genus_occurances.count, offset=genus_occurances.offset, limit=genus_occurances.limit, end_of_records=genus_occurances.end_of_records, results=genus_occurances.results, time_updated=current_time)
    db.add(db_genus_occurances)
    db.commit()
    db.refresh(db_genus_occurances)
    return db_genus_occurances

def update_genus_occurances(db:Session, data: Response, genus_Key: int):
    current_time = str(time())
    json = data.json()
    db_genus_occurances = db.query(models.GenusOccurances).filter(models.GenusOccurances.genus_key == genus_Key).first()
    db_genus_occurances.count = json["count"]
    db_genus_occurances.offset = json["offset"]
    db_genus_occurances.limit = json["limit"]
    db_genus_occurances.end_of_records = json["endOfRecords"]
    db_genus_occurances.results = json["results"]
    db_genus_occurances.time_updated = current_time
    db.commit()
    db.refresh(db_genus_occurances)
    return db_genus_occurances


    