from bson import ObjectId

def serialize_doc(doc):
    if not doc:
        return doc
    doc["_id"] = str(doc["_id"])
    return doc

def serialize_mongo(document):
    """
    Recursively converts all ObjectId fields in MongoDB documents (or lists)
    into strings, so FastAPI/JSON can serialize them.
    """
    if isinstance(document, list):
        return [serialize_mongo(item) for item in document]
    if isinstance(document, dict):
        new_doc = {}
        for key, value in document.items():
            if isinstance(value, ObjectId):
                new_doc[key] = str(value)
            else:
                new_doc[key] = serialize_mongo(value)
        return new_doc
    return document