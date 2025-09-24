from fastapi import APIRouter, HTTPException
from api.services.user_services import UserService
from api.schemas.user_schemas import UserCreate
from ...config.database import mongo

# Create a router instance to group all user-related routes
router = APIRouter()

# Service layer to handle user-related business logic
user_service = UserService(mongo)

@router.post("/register")
async def create_user_route(user: UserCreate):
    """
    Route for registering a new user.
    It receives a UserCreate schema, calls the service to create the user,
    and returns the created user data.
    """
    try:
        created_user = await user_service.create_user(user)
        return created_user
    except Exception as e:
        # In case of any error, raise an HTTP 500 error with the exception message
        raise HTTPException(status_code=500, detail=str(e))
