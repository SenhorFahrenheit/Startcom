from fastapi import APIRouter
from fastapi.responses import RedirectResponse
import os, urllib.parse

router = APIRouter(prefix="/apple", tags=["Apple Auth"])

@router.get("/adicionarConta")
async def apple_add_account():
    params = {
        "client_id": os.getenv("APPLE_CLIENT_ID"),
        "redirect_uri": os.getenv("APPLE_CLIENT_REDIRECT"),
        "response_type": "code",
        "scope": "name email"
    }
    auth_url = "https://appleid.apple.com/auth/authorize?" + urllib.parse.urlencode(params)
    return RedirectResponse(auth_url)
