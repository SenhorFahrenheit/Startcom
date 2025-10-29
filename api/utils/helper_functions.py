from bson import ObjectId

def serialize_doc(doc):
    if not doc:
        return doc
    doc["_id"] = str(doc["_id"])
    return doc