from fastapi import APIRouter, HTTPException
from api.services.user_services import UserService
from api.schemas.user_schemas import UserCreate, UserCreatedResponse
from ...infra.database import mongo

# Create a router instance to group all user-related routes
router = APIRouter()

# Service layer to handle user-related business logic
user_service = UserService(mongo)

from fastapi import APIRouter, HTTPException, status

router = APIRouter(tags=["User"])

@router.post(
    "/register",
    # response_model=UserCreatedResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_user_route(user: UserCreate):
    """
    Register a new user in the system.

    ## Request Body
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "strongpassword123",
      "cpfCnpj": "12345678900"
    }
    ```

    ## Successful Response (201)
    ```json
    {
      "id": "653b2f9d3e2b123456789012",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2025-01-10T14:22:00Z"
    }
    ```

    ## Possible Errors
    - **400 Bad Request** — Invalid data format or missing fields.
    - **409 Conflict** — Email or CPF/CNPJ already registered.
    - **500 Internal Server Error** — Unexpected error while creating the user.

    ## Notes
    - Password is securely hashed before being stored.
    - Returned data **never** includes sensitive fields (e.g., password).
    """
    try:
        created_user = await user_service.create_user(user)
        # return {"status": "success", "created user:": created_user}
        return {"status": "success", "message":  "User created"}
    except HTTPException as e:
        raise e
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


