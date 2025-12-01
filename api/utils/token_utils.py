from jose import jwt, JWTError
from fastapi import HTTPException, status, Body
import os
from typing import Dict, Any
from api.schemas.user_schemas import PasswordResetConfirm

def verify_password_reset_token(token: str) -> Dict[str, Any]:
    """
    Validate a password-reset JWT and return extracted claims.

    Raises HTTPException on:
    - 400: missing token or required claims or wrong token type
    - 401: invalid or expired token
    - 500: secret not configured

    Returns:
        {
            "user_id": "<id>",
            "email": "<email>",
            "payload": { ...decoded token payload... }
        }
    """
    if not token:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing reset token")

    algorithm = os.getenv("ALGORITHM_PASSWORD_RESET", "HS256")
    secret_key = os.getenv("SECRET_KEY_PASSWORD_RESET") or os.getenv("SECRET_KEY")
    if not secret_key:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Password reset secret not configured")

    try:
        payload = jwt.decode(token, secret_key, algorithms=[algorithm])
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

    user_id = payload.get("userId") or payload.get("sub") or payload.get("id")
    email = payload.get("email")
    token_type = payload.get("type")

    if token_type != "password_reset":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token type")

    if not user_id or not email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Token missing required claims")

    return {"user_id": str(user_id), "email": email, "payload": payload}


async def _verify_reset_token_dependency(body: PasswordResetConfirm = Body(...)) -> dict:
    """
    FastAPI dependency: extract token string from request body, verify it,
    and return verified claims plus new_password (string).
    """
    token = getattr(body, "token", None) or getattr(body, "resetToken", None)
    if not token:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing reset token in request body")

    verified = verify_password_reset_token(token)
    return {"verified": verified, "new_password": body.new_password}
