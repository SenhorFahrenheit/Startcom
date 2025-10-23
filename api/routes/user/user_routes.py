from fastapi import APIRouter, HTTPException
from api.services.user_services import UserService
from api.schemas.user_schemas import UserCreate, UserCreatedResponse
from ...config.database import mongo

# Create a router instance to group all user-related routes
router = APIRouter()

# Service layer to handle user-related business logic
user_service = UserService(mongo)

from fastapi import APIRouter, HTTPException, status

router = APIRouter(tags=["User"])

@router.post(
    "/register",
    response_model=UserCreatedResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description=(
        "Registers a new user in the system. "
        "It receives user data (name, email, password, etc.), "
        "creates the user in the database, and returns the created user's basic info."
    ),
    responses={
        201: {"description": "User successfully created"},
        400: {"description": "Invalid input data"},
        409: {"description": "Email or CPF/CPNJ already registered"},
        500: {"description": "Internal server error"}
    }
)
async def create_user_route(user: UserCreate):
    """
    Creates a new user based on the provided UserCreate schema.
    Returns the created user information (without sensitive data).
    """
    try:
        created_user = await user_service.create_user(user)
        return created_user
    except ValueError as e:
        # Example: invalid email format or missing field
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # Generic fallback for unexpected server errors
        raise HTTPException(status_code=500, detail=str(e))

