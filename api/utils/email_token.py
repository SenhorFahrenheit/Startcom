from datetime import datetime, timedelta
from jose import jwt, JWTError
import os
from dotenv import load_dotenv
import uuid

load_dotenv()

email_token_expires = int(os.getenv("EMAIL_TOKEN_EXPIRES_MINUTES", "5"))
email_verification_key = os.getenv("SECRET_KEY_EMAIL_VERIFICATION")
email_algorithm = os.getenv("ALGORITHM_EMAIL_VERIFICATION")

def create_email_token(user_id: str, email: str):

    token_id = str(uuid.uuid4())
    expires_at = datetime.utcnow() + timedelta(minutes=email_token_expires)

    payload = {
        "sub": email,
        "userId": user_id,
        "tokenId": token_id,            
        "type": "email_verification",
        "exp": expires_at
    }

    token = jwt.encode(
        payload,
        email_verification_key,
        algorithm=email_algorithm
    )

    token_db_entry = {
        "tokenId": token_id,
        "userId": user_id,
        "email": email,
        "createdAt": datetime.utcnow(),
        "expiresAt": expires_at
    }

    return token, token_id, expires_at

def decode_email_token(token: str) -> str:
    try:
        payload = jwt.decode(token, email_verification_key, algorithms=[email_algorithm])
        if payload.get("type") != "email_verification":
            raise JWTError("Invalid token type")
        return payload.get("sub")
    except JWTError as e:
        raise e
