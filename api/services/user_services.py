from typing import Optional
from pymongo.errors import PyMongoError
from passlib.context import CryptContext
from fastapi import HTTPException, status
from bson import ObjectId
from datetime import datetime, date, timedelta
from jose import jwt, JWTError
import secrets
import hashlib

from ..services.company_services import CompanyService
from ..schemas.user_schemas import UserCreate, UserInDB
from ..schemas.company_schemas import CompanyCreate
from ..infra.database import AsyncIOMotorClient
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema
from typing import Dict
import os

# ----------------------------------------------
# Password hashing configuration (argon2)
# ----------------------------------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("SUPORT_MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("SUPORT_MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_FROM_NAME=os.getenv("MAIL_FROM_NAME"),
    MAIL_PORT=int(os.getenv("MAIL_PORT")),
    MAIL_SERVER=os.getenv("MAIL_SERVER"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
    TEMPLATE_FOLDER="api/templates"
)


frontend_verify_url = os.getenv("FRONTEND_VERIFY_URL")

fm = FastMail(conf)

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

    def _hash_reset_code(self, code: str) -> str:
        """Hash the reset code for secure storage."""
        return hashlib.sha256(code.encode()).hexdigest()

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
        
    async def send_verification_email(self, email: str, token: str, full_name: str | None = None):
        """
        Send a verification email containing a unique confirmation link.
        """
        verification_url = f"{frontend_verify_url}?token={token}"
        message = MessageSchema(
            subject="Verifique seu email - Startcom",
            recipients=[email],
            subtype="html",
            template_body={"name": full_name or "", "link": verification_url}
        )
        await fm.send_message(message, template_name="verify_email.html")



    async def find_by_email(self, email: str):
        """
        Find and return a user document based on the provided email.
        """
        user = await self.users_collection.find_one({"email": email})
        if user:
            user["_id"] = str(user["_id"])
        return user



    async def verify_email_token(self, token: str):
        """
        Validate the email verification token and activate the user's account.
        """

        algorithm = os.getenv("ALGORITHM_EMAIL_VERIFICATION")
        secret_key = os.getenv("SECRET_KEY_EMAIL_VERIFICATION")

        # 1) Decode JWT
        try:
            payload = jwt.decode(token, secret_key, algorithms=[algorithm])

            user_id = payload.get("userId")
            token_id = payload.get("tokenId")

            if not user_id or not token_id:
                raise HTTPException(400, "Invalid token.")

        except JWTError:
            raise HTTPException(400, "Invalid or corrupted token.")

        # 2) Search user in the database
        user = await self.users_collection.find_one({"_id": ObjectId(user_id)})

        if not user:
            raise HTTPException(400, "User not found.")

        db_token = user.get("emailToken")

        if not db_token:
            raise HTTPException(400, "Expired or already used token.")

        # 3) Check if token matches
        if db_token["tokenId"] != token_id:
            raise HTTPException(400, "Invalid token.")

        # 4) Check expiration
        if db_token["expiresAt"] < datetime.utcnow():
            raise HTTPException(400, "Expired token.")

        # 5) Mark email as verified and remove token
        await self.users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "emailVerified": True,
                    "emailVerifiedAt": datetime.utcnow()
                },
                "$unset": {"emailToken": ""}
            }
        )

        return True
    
    async def send_contact_email(self, name: str, email: str, message_text: str):
        """
        Send contact form content to the support mailbox.

        - Subject: "Forms de Contato"
        - Recipient: suportstartcomtech@gmail.com
        """
        support_email = "suportstartcomtech@gmail.com"
        subject = "Forms de Contato"

        # Simple HTML body
        body = f"""
            <p><strong>From:</strong> {name} &lt;{email}&gt;</p>
            <p><strong>Message:</strong></p>
            <div>{message_text}</div>
        """

        try:
            message = MessageSchema(
                subject=subject,
                recipients=[support_email],
                subtype="html",
                body=body
            )
            await fm.send_message(message)
            return True
        except Exception as e:
            # Bubble up as HTTPException for route handling
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to send contact email: {e}")

    async def send_password_reset_email(self, email: str) -> None:
        """
        Generate a 6-digit reset code, store it (hashed) in DB,
        and send it via email.
        """
        # 1) Verify user exists
        user = await self.users_collection.find_one({"email": email})
        if not user:
            # Security: don't confirm if email exists
            return

        # 2) Generate 6-digit code
        reset_code = str(secrets.randbelow(1000000)).zfill(6)
        code_hash = self._hash_reset_code(reset_code)

        # 3) Store in DB (expires in 10 minutes)
        expires_at = datetime.utcnow() + timedelta(minutes=10)
        await self.users_collection.update_one(
            {"_id": user["_id"]},
            {
                "$set": {
                    "passwordReset": {
                        "codeHash": code_hash,
                        "expiresAt": expires_at,
                        "attempts": 0
                    }
                }
            }
        )

        # 4) Send email with code
        try:
            message = MessageSchema(
                subject="Código de Recuperação de Senha - Startcom",
                recipients=[email],
                subtype="html",
                template_body={"code": reset_code, "name": user.get("name", "")}
            )
            await fm.send_message(message, template_name="password_reset.html")
        except Exception as e:
            print(f"[UserService] ⚠ Failed to send password reset email: {e}")


    async def verify_reset_code(self, email: str, code: str) -> str:
        """
        Verify the reset code and return a temporary JWT token.
        
        Returns:
            str: Temporary JWT token valid for 15 minutes
        """
        # 1) Find user
        user = await self.users_collection.find_one({"email": email})
        if not user:
            raise HTTPException(400, "Invalid email or code.")

        # 2) Check if reset request exists
        reset_data = user.get("passwordReset")
        if not reset_data:
            raise HTTPException(400, "Invalid email or code.")

        # 3) Check expiration
        if reset_data["expiresAt"] < datetime.utcnow():
            await self.users_collection.update_one(
                {"_id": user["_id"]},
                {"$unset": {"passwordReset": ""}}
            )
            raise HTTPException(400, "Code has expired. Request a new one.")

        # 4) Check attempts (prevent brute force)
        attempts = reset_data.get("attempts", 0)
        if attempts >= 5:
            await self.users_collection.update_one(
                {"_id": user["_id"]},
                {"$unset": {"passwordReset": ""}}
            )
            raise HTTPException(429, "Too many attempts. Request a new code.")

        # 5) Verify code
        code_hash = self._hash_reset_code(code)
        if not secrets.compare_digest(code_hash, reset_data["codeHash"]):
            # Increment attempts
            await self.users_collection.update_one(
                {"_id": user["_id"]},
                {"$inc": {"passwordReset.attempts": 1}}
            )
            raise HTTPException(400, "Invalid email or code.")

        # 6) Generate temporary JWT token (15 minutes)
        secret_key = os.getenv("SECRET_KEY")
        algorithm = "HS256"
        
        payload = {
            "userId": str(user["_id"]),
            "email": email,
            "type": "password_reset",
            "exp": datetime.utcnow() + timedelta(minutes=15)
        }
        temp_token = jwt.encode(payload, secret_key, algorithm=algorithm)

        return temp_token

    async def reset_password(self, user_id: str, email: str, new_password: str) -> None:
        """
        Update user's password and clean up reset token.
        """
        # Validate user
        user = await self.users_collection.find_one({
            "_id": ObjectId(user_id),
            "email": email
        })
        if not user:
            raise HTTPException(400, "Invalid request.")

        # Hash new password
        password_hash = self.get_password_hash(new_password)

        # Update password and remove reset data
        await self.users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "passwordHash": password_hash,
                    "updated_at": datetime.utcnow()
                },
                "$unset": {"passwordReset": ""}
            }
        )
    async def ensure_user_email_verified(self, email: str):
        """
        Ensure that if a user record exists for `email`, its emailVerified flag is True.

        - If the user exists and emailVerified is falsy/missing -> raise 403 with a clear message.
        - If the user does not exist, do nothing (AuthService will handle invalid credentials).
        """
        user = await self.find_by_email(email)
        if not user:
            return

        # user may be a dict (from DB) or a Pydantic model
        verified = user.get("emailVerified") if isinstance(user, dict) else getattr(user, "emailVerified", None)
        if not verified:
            raise HTTPException(
    status_code=400,
    detail={"error_code": "EMAIL_NOT_VERIFIED", "message": "Email not verified. Please verify your email before logging in."}
)

    async def create_account_deletion_token(self, user_id: str, email: str, hours_valid: int = 24):
        """
        Create a one-time JWT token for account deletion, store tokenId + expiry in user doc.
        Returns (token, token_id, expires_at).
        """
        token_id = secrets.token_urlsafe(16)
        expires_at = datetime.utcnow() + timedelta(hours=hours_valid)
        payload = {
            "userId": str(user_id),
            "email": email,
            "tokenId": token_id,
            "type": "account_deletion",
            "exp": expires_at
        }
        secret_key = os.getenv("SECRET_KEY")
        algorithm = "HS256"
        token = jwt.encode(payload, secret_key, algorithm=algorithm)

        # store token meta in user doc
        await self.users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"deletionToken": {"tokenId": token_id, "expiresAt": expires_at}}}
        )
        return token, token_id, expires_at

    async def send_account_deletion_email(self, email: str, token: str, full_name: str | None = None):
        """
        Send account deletion email with link containing the token.
        Uses FRONTEND_DELETE_ACCOUNT_URL environment variable as target page.
        """
        frontend_delete_url = os.getenv("FRONTEND_DELETE_ACCOUNT_URL", "").rstrip("/")
        if not frontend_delete_url:
            # fallback to a reasonable path if not configured
            frontend_delete_url = os.getenv("FRONTEND_URL", "https://startcomtech.com.br/").rstrip("/") + "/excluir-conta"

        deletion_link = f"{frontend_delete_url}?token={token}"
        subject = "Solicitação de Exclusão de Conta - Startcom"
        try:
            message = MessageSchema(
                subject=subject,
                recipients=[email],
                subtype="html",
                template_body={"name": full_name or "", "link": deletion_link}
            )
            # try template first (delete_account.html), fallback to inline if template missing
            try:
                await fm.send_message(message, template_name="delete_account.html")
            except Exception:
                body = f"""
                    <p>Olá {full_name or ''},</p>
                    <p>Você solicitou a exclusão da sua conta Startcom. Se você realmente quer prosseguir, siga o link abaixo:</p>
                    <p><a href="{deletion_link}">Deletar minha conta</a></p>
                    <p>Esse link expira em 24 horas.</p>
                """
                message2 = MessageSchema(
                    subject=subject,
                    recipients=[email],
                    subtype="html",
                    body=body
                )
                await fm.send_message(message2)
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to send deletion email: {e}")

    async def verify_account_deletion_token(self, token: str) -> dict:
        """
        Verify deletion token and return claims (user_id, email, payload).
        Also checks stored deletionToken tokenId and expiry in DB.
        """
        algorithm = os.getenv("ALGORITHM_ACCOUNT_DELETION", "HS256")
        secret_key = os.getenv("SECRET_KEY")
        if not secret_key:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Server missing secrets")

        try:
            payload = jwt.decode(token, secret_key, algorithms=[algorithm])
        except JWTError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

        token_type = payload.get("type")
        if token_type != "account_deletion":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token type")

        user_id = payload.get("userId")
        token_id = payload.get("tokenId")
        email = payload.get("email")
        if not user_id or not token_id or not email:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Token missing required claims")

        # verify stored token meta
        user = await self.users_collection.find_one({"_id": ObjectId(user_id)}, {"deletionToken": 1, "email": 1})
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        deletion_meta = user.get("deletionToken")
        if not deletion_meta or deletion_meta.get("tokenId") != token_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or used token")

        if deletion_meta.get("expiresAt") < datetime.utcnow():
            raise HTTPException(status_code=status.HTTP_410_GONE, detail="Token expired")

        return {"user_id": str(user_id), "email": email, "payload": payload}

    async def delete_account_by_user_id(self, user_id: str):
        """
        Delete user document and optionally remove companies owned by the user if CompanyService supports it.
        """
        # remove user
        await self.users_collection.delete_one({"_id": ObjectId(user_id)})

        # try to remove companies owned by this user (best-effort, ignore if method missing)
        try:
            if hasattr(self.company_service, "delete_companies_by_owner"):
                await self.company_service.delete_companies_by_owner(user_id)
            elif hasattr(self.company_service, "delete_company_by_owner"):
                await self.company_service.delete_company_by_owner(user_id)
        except Exception as e:
            # don't fail deletion if company cleanup fails, but log
            print(f"[UserService] ⚠ company cleanup failed for user {user_id}: {e}")





