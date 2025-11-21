from fastapi import APIRouter, HTTPException
from api.services.user_services import UserService
from api.schemas.user_schemas import UserCreate, UserCreatedResponse
from ...infra.database import mongo
from ...utils.email_token import create_email_token
from bson import ObjectId

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

        # 1. generate token
        token, token_id, expire = create_email_token(created_user["_id"], created_user["email"])

        # 2. salvar token no usuário
        await user_service.users_collection.update_one(
            {"_id": created_user["_id"]},
            {
                "$set": {
                    "emailToken": {
                        "tokenId": token_id,
                        "expiresAt": expire
                    }
                }
            }
        )

        # 3. enviar email
        await user_service.send_verification_email(
            email=created_user["email"],
            token=token,
            full_name=created_user.get("fullName")
        )

        return {"status": "success", "message": "User created. Verification email sent."}
    
    except HTTPException as e:
        raise e
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.post("/verify-email/request")
async def request_email_verification(email: str):
    """
    Request a new email verification token and send a verification email.

    This endpoint is useful when the user did not receive the first email
    or if the previous token has expired.

    ## Query Parameter
    - **email** (string) — The user's registered email address.

    ## Successful Response (200)
    ```json
    {
      "message": "New verification email sent."
    }
    ```

    ## Possible Errors
    - **404 Not Found** — No user found with the provided email.
    - **500 Internal Server Error** — Unexpected error while generating or sending the token.

    ## Notes
    - If the user is already verified, the endpoint simply returns a confirmation message.
    - A new token replaces the previous one and is stored inside the user's document.
    """

    try:
        user = await user_service.find_by_email(email)
        if not user:
            raise HTTPException(404, "User not found.")

        if user.get("emailVerified"):
            return {"message": "Email already verified."}


        token, token_id, expire = create_email_token(user["_id"], user["email"])

        user_id = ObjectId(user["_id"])

        await user_service.users_collection.update_one(
            {"_id": user_id},
            {
                "$set": {
                    "emailToken": {
                        "tokenId": token_id,
                        "expiresAt": expire
                    }
                }
            }
        )

    
        await user_service.send_verification_email(
            email=user["email"],
            token=token,
            full_name=user.get("name") 
        )

        return {"message": "New verification email sended."}

    except Exception as e:
        raise HTTPException(500, str(e))



@router.post("/verify-email/confirm")
async def confirm_email_verification(token: str):
    """
    Confirm a user's email address using the verification token.

    This route is accessed when the user clicks the verification link
    sent by email. It validates the token, checks expiration, and marks
    the account as verified.

    ## Query Parameter
    - **token** (string) — The verification token sent to the user's email.

    ## Successful Response (200)
    ```json
    {
      "message": "Email successfully verified!"
    }
    ```

    ## Possible Errors
    - **400 Bad Request** — Token is invalid or malformed.
    - **410 Gone** — Token has expired.
    - **404 Not Found** — Token not associated with any user.
    - **500 Internal Server Error** — Unexpected error during verification.

    ## Notes
    - After verification, the token becomes invalid and cannot be reused.
    - The user's `emailVerified` flag is set to `true`.
    """
    try:
        await user_service.verify_email_token(token)

        return {"message": "Email verificado com sucesso!"}

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(500, str(e))


