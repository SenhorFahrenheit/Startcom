# app/utils/security.py

import os
from datetime import datetime, timedelta, timezone
from typing import Dict, Any
from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from dotenv import load_dotenv

# A CryptContext manages hashing algorithms. We'll use the 'argon2' algorithm.
# This algorithm is recommended for password hashing due to its resistance to GPU-based attacks.
# DO NOT hardcode secrets. Use environment variables.
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# JWT configuration
# Again, use environment variables for production.
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-for-development")  # A real key would be much longer and random.
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def get_password_hash(password: str) -> str:
    """
    Hashes a password using the configured CryptContext.
    """
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plain-text password against a hashed one.
    """
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: Dict[str, Any], expires_delta: timedelta | None = None) -> str:
    """
    Creates a new JWT access token.

    Args:
        data: The payload to be encoded in the token (e.g., {"sub": user_id}).
        expires_delta: The timedelta for the token's expiration.

    Returns:
        The encoded JWT token string.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Dict[str, Any]:
    """
    Decodes a JWT token and returns its payload.

    Args:
        token: The JWT token string.

    Returns:
        The decoded payload.

    Raises:
        JWTError: If the token is invalid or expired.
    """
    try:
        # JWT token validation is handled by the `jwt.decode` function.
        # It checks for expiration and signature validity.
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError as e:
        raise JWTError(f"Could not validate token: {str(e)}")
    

bearer_scheme = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    """
    Dependency to extract and validate the JWT token from the request header.
    Returns the decoded payload (user info) if valid.
    Raises 401 Unauthorized otherwise.
    """
    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        companyId: str = payload.get("companyId")
        exp = payload.get("exp")

        if not user_id or not companyId:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload."
            )

        # Optional: token expiration validation
        if exp and datetime.now(timezone.utc).timestamp() > exp:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expired."
            )

        return {
            "user_id": user_id,
            "companyId": companyId
        }

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired."
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token."
        )
