from fastapi import APIRouter, HTTPException
from api.services.auth_services import AuthService
from ...config.database import mongo
from ...schemas.auth_schemas import LoginRequest
# Create a router instance to group all auth-related routes
router = APIRouter()

# Service layer to handle authentication-related business logic
auth_service = AuthService(mongo.client)


@router.post("/auth")
async def login_route(login_data: LoginRequest):
    """
    Route for user login using email and password.
    Receives a LoginRequest schema, calls AuthService to verify credentials,
    and returns a token or raises an error if login fails.
    """
    try:
        # Call the AuthService to authenticate the user
        token = await auth_service.login(login_data.email, login_data.password)
        return {"access_token": token, "token_type": "bearer"}
    except Exception as e:
        # In case of failed login, raise an HTTP 401 Unauthorized
        raise HTTPException(status_code=401, detail=str(e))
