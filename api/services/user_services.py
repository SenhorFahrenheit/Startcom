from typing import Optional
from pymongo.errors import PyMongoError
from passlib.context import CryptContext
from fastapi import HTTPException, status
from bson import ObjectId
from datetime import datetime, date

from ..services.company_services import CompanyService
from ..schemas.user_schemas import UserCreate, UserInDB
from ..schemas.company_schemas import CompanyCreate
from ..infra.database import AsyncIOMotorClient


# ----------------------------------------------
# Password hashing configuration (argon2)
# ----------------------------------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class UserService:
    """
    Service layer responsible for user-related business logic and
    database operations.

    This class encapsulates all user-related functionality, ensuring
    secure user creation, password hashing, and automatic initialization
    of related resources such as default companies.
    """

    def __init__(self, db_client: AsyncIOMotorClient):
        """
        Initializes the UserService with a database client and its collections.

        Args:
            db_client (AsyncIOMotorClient): The asynchronous MongoDB client instance.
        """
        self.db = db_client
        self.users_collection = self.db.get_collection("user")
        self.company_service = CompanyService(db_client)

    # ---------------------------------------------------------------------
    # Password hashing
    # ---------------------------------------------------------------------
    def get_password_hash(self, password: str) -> str:
        """
        Hashes a plain text password using bcrypt.

        Args:
            password (str): Plain text password.

        Returns:
            str: The securely hashed password.
        """
        return pwd_context.hash(password)

    # ---------------------------------------------------------------------
    # User creation
    # ---------------------------------------------------------------------
    async def create_user(self, user_data: UserCreate) -> UserInDB:
        """
        Creates a new user in the database and automatically associates
        a default company with them.

        Workflow:
        1. Checks if the user already exists (by email or CPF/CNPJ).
        2. Hashes the user's password.
        3. Converts the birth_date (if necessary) to datetime.
        4. Inserts the new user into the database.
        5. Creates a default company ("My company") linked to the user.
        6. Updates the user's `companyIds` array with the company's ID.

        Args:
            user_data (UserCreate): A Pydantic model containing the new user's data.

        Raises:
            HTTPException:
                - 409 if a user with the same email or CPF/CNPJ already exists.
                - 500 if a database error occurs or the user cannot be retrieved.

        Returns:
            UserInDB: The newly created user as a Pydantic model.
        """
        try:
            # 1️ Check for existing user (by email or CPF/CNPJ)
            existing_user = await self.users_collection.find_one({
                "$or": [
                    {"email": user_data.email},
                    {"cpf_cnpj": user_data.cpf_cnpj}
                ]
            })
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="A user with this email or CPF/CNPJ already exists."
                )

            # 2️ Securely hash the password
            password_hash = self.get_password_hash(user_data.password)

            # 3️ Prepare the MongoDB-compatible document
            user_dict = user_data.model_dump()

            # Ensure date format is compatible with MongoDB (datetime)
            if isinstance(user_dict.get("birth_date"), date) and not isinstance(user_dict.get("birth_date"), datetime):
                user_dict["birth_date"] = datetime.combine(user_dict["birth_date"], datetime.min.time())

            user_dict["passwordHash"] = password_hash
            del user_dict["password"]

            now = datetime.utcnow()
            user_dict["created_at"] = now
            user_dict["updated_at"] = now
            user_dict["companyIds"] = []  # Initialize empty array

            # 4️ Insert user into the database
            result = await self.users_collection.insert_one(user_dict)
            new_user_db = await self.users_collection.find_one({"_id": result.inserted_id})

            if not new_user_db:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to retrieve newly created user."
                )

            # 5️ Convert DB document to Pydantic model
            new_user_db["id"] = str(new_user_db["_id"])
            if "passwordHash" in new_user_db:
                new_user_db["password_hash"] = new_user_db.pop("passwordHash")

            created_user = UserInDB(**new_user_db)

            # 6️ Create the default company and link it to the user
            try:
                company_data = CompanyCreate(
                    name="My company",
                    taxId=created_user.cpf_cnpj,
                    ownerId=str(created_user.id)
                )

                created_company = await self.company_service.create_company(company_data)

                # Add the new company ID to the user's companyIds list
                await self.users_collection.update_one(
                    {"_id": ObjectId(created_user.id)},
                    {"$push": {"companyIds": ObjectId(created_company.id)}}
                )

            except Exception as e:
                # Log company creation failure but continue the user flow
                print(f"[UserService] ⚠ Failed to create default company for user {created_user.id}: {e}")

            return created_user

        except PyMongoError as e:
            # Handle general database exceptions
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {str(e)}"
            )
