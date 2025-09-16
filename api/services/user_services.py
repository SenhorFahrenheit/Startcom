from api.config.database import mongo
from api.schemas.user_schemas import UserCreate
from bson import ObjectId
import hashlib

class UserService:
    def __init__(self):
        # Access the "user" collection from MongoDB
        self.collection = mongo.get_collection("user")

    async def create_user(self, user_data: UserCreate) -> dict:
        """
        Creates a new user in the database.
        """
        # Hash the password (simple hashing example; in production use bcrypt or argon2)
        hashed_password = hashlib.sha256(user_data.password.encode()).hexdigest()
        
        # Create the document to be stored in MongoDB
        user_document = {
            "name": user_data.name,
            "email": user_data.email,
            "passwordHash": hashed_password
        }

        # Insert the document into the MongoDB collection
        result = await self.collection.insert_one(user_document)

        # Fetch the newly created user from the database
        user_created = await self.collection.find_one({"_id": result.inserted_id})

        # Convert ObjectId to string for easier handling
        user_created["id"] = str(user_created["_id"])
        
        # Remove fields that should not be exposed to the client
        del user_created["_id"]
        del user_created["passwordHash"]  # Never return a password or its hash

        return user_created
