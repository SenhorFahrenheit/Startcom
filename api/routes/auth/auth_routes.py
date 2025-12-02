from fastapi import APIRouter, HTTPException
from api.services.auth_services import AuthService
from ...infra.database import mongo
from ...schemas.auth_schemas import LoginRequest
from ...services.user_services import UserService

# Service layer to handle authentication-related business logic
auth_service = AuthService(mongo.client)

# Create a router instance to group all auth-related routes
router = APIRouter(tags=["Login"])

@router.post("/login")
async def login_route(login_data: LoginRequest):
    """
    Authenticate a user and return a JWT access token.

    ## Request Body
    ```json
    {
      "email": "user@example.com",
      "password": "securePassword123"
    }
    ```

    ## Successful Response (200)
    ```json
    {
      "access_token": "<jwt_token>",
      "token_type": "bearer",
      "email": "emailexample@gmail.com",
      "name: ": "username"
    }
    ```

    ## Error Responses
    - **401 Unauthorized** — Invalid email or password.
    - **500 ** — Email not verified.
    - **500 Internal Server Error** — Unexpected error during authentication.

    ## JWT
    - The returned JWT contains user and company identifiers for route authentication.
    """

    try:
        user_service = UserService(mongo)
        # Ensure email is verified before attempting authentication
        await user_service.ensure_user_email_verified(login_data.email)

        # Call the AuthService to authenticate the user
        result = await auth_service.login(login_data.email, login_data.password)
        token = result["access_token"]
        return {"access_token": token, "token_type": "bearer", "email": result['email'], "name": result['name'], "companyId": result["company_id"]}
    except HTTPException:
        raise
    except Exception as e:
        # In case of failed login, raise an HTTP 401 Unauthorized
        raise HTTPException(status_code=401, detail=str(e))
