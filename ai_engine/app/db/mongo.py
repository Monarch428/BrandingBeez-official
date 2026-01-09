from pymongo import MongoClient
from app.core.config import settings

_client: MongoClient | None = None

def get_mongo_client() -> MongoClient:
    global _client
    if _client is None:
        _client = MongoClient(settings.MONGO_URI)
    return _client

def get_db():
    client = get_mongo_client()
    if settings.MONGO_DB_NAME:
        return client[settings.MONGO_DB_NAME]
    # If DB name is encoded inside URI, pymongo will still allow default access,
    # but safer to require MONGO_DB_NAME in env.
    return client.get_default_database()

def get_reports_collection():
    db = get_db()
    return db[settings.MONGO_COLLECTION_REPORTS]
