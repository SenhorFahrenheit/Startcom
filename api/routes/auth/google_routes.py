from fastapi import APIRouter
from fastapi.responses import RedirectResponse
import os, urllib.parse

router = APIRouter(prefix="/google", tags=["Google Auth"])

@router.get("/auth")
async def google_add_account():
    redirect_uri = os.getenv("BACKEND_URL") + "auth/google/callback"
    params = {
        "client_id": os.getenv("GOOGLE_CLIENT_ID"),
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent"
    }

    auth_url = "https://accounts.google.com/o/oauth2/v2/auth?" + urllib.parse.urlencode(params)
    return RedirectResponse(auth_url)

@router.get("/callback")
async def google_callback(code: str):
    return {"code": code}