# app/utils/security.py

import os
from datetime import datetime, timedelta, timezone
from typing import Dict, Any
from passlib.context import CryptContext
from jose import jwt
from jose.exceptions import JWTError, ExpiredSignatureError
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-for-development")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: Dict[str, Any], expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": int(expire.timestamp())})

    print("[JWT][CREATE] Payload:", to_encode)

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    print("[JWT][CREATE] Token gerado:", encoded_jwt)

    return encoded_jwt


def decode_access_token(token: str) -> Dict[str, Any]:
    print("\n[JWT][DECODE] Token recebido:", token)

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print("[JWT][DECODE] Payload decodificado:", payload)
        return payload

    except ExpiredSignatureError:
        print("[JWT][DECODE] ERRO: Token expirado!")
        raise HTTPException(status_code=419, detail="Token expired.")

    except JWTError as e:
        print("[JWT][DECODE] ERRO: Token inválido!", str(e))
        raise HTTPException(status_code=401, detail="Invalid token.")


bearer_scheme = HTTPBearer()

async def get_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)
):
    print("\n[AUTH] === Nova requisição ===")
    print("[AUTH] Headers:", dict(request.headers))

    token = credentials.credentials
    print("[AUTH] Token extraído do header Authorization:", token)

    try:
        print("[AUTH] Tentando decodificar token...")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print("[AUTH] Payload decodificado:", payload)

        user_id: str = payload.get("sub")
        companyId: str = payload.get("companyId")
        exp = payload.get("exp")

        print("[AUTH] user_id:", user_id)
        print("[AUTH] companyId:", companyId)
        print("[AUTH] exp:", exp)
        print("[AUTH] Agora:", datetime.now(timezone.utc).timestamp())

        if not user_id or not companyId:
            print("[AUTH] ERRO: Campos obrigatórios ausentes no payload.")
            raise HTTPException(
                status_code=401,
                detail="Invalid token payload."
            )

        if exp and datetime.now(timezone.utc).timestamp() > exp:
            print("[AUTH] ERRO: Token expirou (verificação manual).")
            raise HTTPException(
                status_code=419,
                detail="Token expired."
            )

        print("[AUTH] Token válido. Usuário autenticado.")
        return {
            "user_id": user_id,
            "companyId": companyId
        }

    except ExpiredSignatureError:
        print("[AUTH] EXCEPTION: Token expirado!")
        raise HTTPException(
            status_code=419,
            detail="Token expired."
        )

    except JWTError as e:
        print("[AUTH] EXCEPTION: Token inválido!", str(e))
        raise HTTPException(
            status_code=401,
            detail="Invalid token."
        )
