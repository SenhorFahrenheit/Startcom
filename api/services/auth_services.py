from passlib.context import CryptContext
import jwt, os
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

# Load environment variables from the .env file
load_dotenv()

class AuthService:
    def __init__(self, client):
        # 'client' is an instance of AsyncIOMotorClient (MongoDB asynchronous client)
        # Select the correct database
        self.db = client["Startcom_Database"]

        # Select the 'user' collection from the database
        self.user_collection = self.db["user"]

        # Initialize the password context for hashing and verifying passwords
        # Using bcrypt (a strong, secure algorithm)
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

        # Load the secret key from environment variables (.env)
        # This key is used to sign and verify JWT tokens
        self.secret_key = os.getenv("SECRET_KEY")

        # Algorithm used for encoding and decoding JWTs
        self.algorithm = os.getenv("ALGORITHM", "HS256")

        # Token expiration time in minutes (default: 60)
        self.access_token_expire_minutes = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

    async def verify_password(self, plain_password, hashed_password):
        """
        Verify if a plain text password matches the stored (hashed) password.
        Returns True if the password is correct, otherwise False.
        """
        return self.pwd_context.verify(plain_password, hashed_password)

    async def get_user_by_email(self, email):
        """
        Retrieve a user document from the database using the provided email.
        Returns the user object if found, otherwise None.
        """
        return await self.user_collection.find_one({"email": email})

    async def login(self, email, password):
        """
            Authenticate a user by email and password.
            - Verifies that the user exists.
            - Checks that the password is correct.
            - Creates and returns a JWT access token if authentication succeeds.
        """
        user = await self.get_user_by_email(email)
        if not user:
            raise Exception("Invalid email or password")

        # Verify password
        if not await self.verify_password(password, user["passwordHash"]):
            raise Exception("Invalid email or password")

        # Define expiration time for the token
        expire = datetime.utcnow() + timedelta(minutes=self.access_token_expire_minutes)

        # Extract companyId (first item in array, if exists)
        company_ids = user.get("companyIds", [])
        companyId = str(company_ids[0]) if company_ids else None

        # Build JWT payload
        payload = {
            "sub": str(user["_id"]),            # User ID
            "companyId": companyId,           # First companyId
            "exp": expire                       # Expiration timestamp
        }

        # Encode token
        token = jwt.encode(payload, self.secret_key, algorithm=self.algorithm)

        # Return both token and decoded info (optional for frontend convenience)
        return {
            "access_token": token,
            "token_type": "bearer",
            "company_id": companyId
        }

