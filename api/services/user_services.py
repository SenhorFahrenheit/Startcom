from typing import Optional
from pymongo.errors import PyMongoError
from passlib.context import CryptContext
from fastapi import HTTPException, status
from bson import ObjectId

from ..schemas.user_schemas import UserCreate, UserInDB
from ..config.database import AsyncIOMotorClient

# Setup CryptContext for password hashing.
# This ensures that passwords are never stored in plain text.
# The 'bcrypt' algorithm is a strong, industry-standard choice.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:
    """
    Service layer for user-related operations.
    Handles business logic, database interactions, and error handling.
    """
    def __init__(self, db_client: AsyncIOMotorClient):
        self.db = db_client
        self.users_collection = self.db.get_collection("user")

    def get_password_hash(self, password: str) -> str:
        """
        Hashes a plain text password using the configured CryptContext.
        
        Args:
            password (str): The plain text password.
        
        Returns:
            str: The hashed password string.
        """
        return pwd_context.hash(password)

    async def create_user(self, user_data: UserCreate) -> UserInDB:
        """
        Creates a new user in the database.
        
        Args:
            user_data (UserCreate): The Pydantic model containing the new user's data.
            
        Raises:
            HTTPException: If the email or CPF/CNPJ already exists in the database.
            HTTPException: For any database-related errors.
            
        Returns:
            UserInDB: The created user data as a Pydantic model, including the hashed password.
        """
        try:
            # Check for existing user with the same email or CPF/CNPJ
            existing_user = await self.users_collection.find_one({
                "$or": [{"email": user_data.email}, {"cpf_cnpj": user_data.cpf_cnpj}]
            })
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="A user with this email or CPF/CNPJ already exists."
                )

            # Hash the user's password for secure storage
            password_hash = self.get_password_hash(user_data.password)
            
            # Create a dictionary for the new user, replacing the plain password with the hash
            user_dict = user_data.model_dump()
            
            # Convert birth_date to datetime.datetime for MongoDB
            from datetime import datetime, date
            if isinstance(user_dict.get("birth_date"), date) and not isinstance(user_dict.get("birth_date"), datetime):
                user_dict["birth_date"] = datetime.combine(user_dict["birth_date"], datetime.min.time())
            
            user_dict["passwordHash"] = password_hash  # MongoDB expects camelCase
            del user_dict["password"]

            now = datetime.utcnow()
            user_dict["created_at"] = now
            user_dict["updated_at"] = now


            # Insert the new user into the database
            result = await self.users_collection.insert_one(user_dict)
            
            # Retrieve the created document to ensure consistency
            new_user_db = await self.users_collection.find_one({"_id": result.inserted_id})
            
            if not new_user_db:
                # This is a fallback for an unlikely scenario
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to retrieve newly created user."
                )
                
            # Convert the MongoDB object to a Pydantic model
            new_user_db["id"] = str(new_user_db["_id"])
            
            # Convert passwordHash from Mongo to password_hash for Pydantic
            if "passwordHash" in new_user_db:
                new_user_db["password_hash"] = new_user_db.pop("passwordHash")
            
            return UserInDB(**new_user_db)

        except PyMongoError as e:
            # Catch specific database errors and provide a generic 500 response
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {str(e)}"
            )


    # Note: Other methods like `get_user_by_email` or `verify_password` would be added here.
    # We will focus on the updated `create_user` method for this request.