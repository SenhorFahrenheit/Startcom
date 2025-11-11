from bson import ObjectId
from datetime import datetime

def serialize_doc(doc):
    """
    Converts a single MongoDB document, replacing ObjectId and datetime fields
    with string representations.
    """
    if not doc:
        return doc
    if "_id" in doc and isinstance(doc["_id"], ObjectId):
        doc["_id"] = str(doc["_id"])
    for key, value in doc.items():
        if isinstance(value, datetime):
            doc[key] = value.isoformat()
    return doc


def serialize_mongo(document):
    """
    Recursively converts all ObjectId and datetime fields in MongoDB documents
    (or lists) into strings, so FastAPI/JSON can serialize them safely.
    """
    if isinstance(document, list):
        return [serialize_mongo(item) for item in document]
    if isinstance(document, dict):
        new_doc = {}
        for key, value in document.items():
            if isinstance(value, ObjectId):
                new_doc[key] = str(value)
            elif isinstance(value, datetime):
                new_doc[key] = value.isoformat()
            else:
                new_doc[key] = serialize_mongo(value)
        return new_doc
    return document
