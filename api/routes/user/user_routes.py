from fastapi import APIRouter, HTTPException, Depends
from api.services.user_services import UserService
from api.schemas.user_schemas import UserCreate, UserCreatedResponse, ContactFormRequest, PasswordResetRequest, PasswordResetCodeVerification, PasswordResetConfirm
from ...infra.database import mongo
from ...utils.email_token import create_email_token
from bson import ObjectId
from ...utils.security import get_current_user
from ...infra.database import get_database_client
from ...schemas.company_schemas import CompanyData, CompanyUpdate
from ...services.company_services import CompanyService
from datetime import timedelta
from jose import jwt, JWTError

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

        user_id = created_user.id
        user_email = created_user.email
        user_name = created_user.name

        # 1. generate token
        token, token_id, expire = create_email_token(user_id, user_email)

        # 2. salvar token no usuário
        await user_service.users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "emailToken": {
                        "tokenId": token_id,
                        "expiresAt": expire
                    }
                }
            }
        )
        print(token)
        # 3. enviar email
        await user_service.send_verification_email(
            email=user_email,
            token=token,
            full_name=user_name
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

@router.get("/my-company")
async def get_my_company(
    db_client=Depends(get_database_client),
    current_user=Depends(get_current_user),
):

    company_service = CompanyService(db_client) 


    try:
        company_id = current_user.get("companyId")

        if not company_id:
            raise HTTPException(
                status_code=404,
                detail="User has no company assigned"
            )

        data = await company_service.get_company_public_info(company_id)

        return data

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(500, str(e))


@router.put("/my-company")
async def update_my_company(
    update_data: CompanyUpdate,
    db_client=Depends(get_database_client),
    current_user=Depends(get_current_user),
):
    """
    Atualiza as informações da empresa do usuário.
    """
    company_service = CompanyService(db_client)

    try:
        company_id = current_user.get("companyId")

        if not company_id:
            raise HTTPException(
                status_code=404,
                detail="User has no company assigned"
            )

        updated = await company_service.update_company_public_info(
            company_id=company_id,
            name=update_data.name,
            cpf_cnpj=update_data.cpf_cnpj,
            email=update_data.email,
            telephone=update_data.telephone,
            address=update_data.address
        )

        return {
            "companyId": company_id,
            **updated
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(500, str(e))

@router.post("/contact", status_code=status.HTTP_200_OK)
async def send_contact_form(
    body: ContactFormRequest
):
    """
    Send a contact form message to Startcom support.

    ## Description
    Public endpoint (no auth). Receives visitor name, email and message,
    and forwards the content to the support mailbox.

    ## Request Example
    ```json
    {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "message": "I need help with my account..."
    }
    ```

    ## Successful Response
    ```json
    {
      "status": "success",
      "message": "Contact form sent successfully."
    }
    ```

    ## Possible Errors
    - 400 — Invalid request body (email format, missing fields).
    - 500 — Failed to send email.
    """
    try:
        await user_service.send_contact_email(body.name, body.email, body.message)
        return {"status": "success", "message": "Contact form sent successfully."}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post("/auth/send-password-reset")
async def send_password_reset(body: PasswordResetRequest):
    """
    Send a password reset code to the user's email.

    ## Description
    Public endpoint (no authentication required).
    Generates a 6-digit code and sends it via email.
    For security reasons, the response does NOT confirm if the email exists.

    ## Request Body
    ```json
    {
      "email": "user@example.com"
    }
    ```

    ## Response (Always 200, regardless of whether email exists)
    ```json
    {
      "status": "success",
      "message": "If the email is registered, a reset code will be sent."
    }
    ```

    ## Security Notes
    - Code expires in 10 minutes
    - Maximum 5 verification attempts before code invalidation
    - Always returns success to prevent email enumeration
    """
    try:
        await user_service.send_password_reset_email(body.email)
        return {
            "status": "success",
            "message": "If the email is registered, a reset code will be sent."
        }
    except Exception as e:
        # Log but don't expose error details
        print(f"[Password Reset] Error: {e}")
        return {
            "status": "success",
            "message": "If the email is registered, a reset code will be sent."
        }


@router.post("/auth/verify-reset-code")
async def verify_password_reset_code(body: PasswordResetCodeVerification):
    """
    Verify the reset code and return a temporary token.

    ## Request Body
    ```json
    {
      "email": "user@example.com",
      "code": "123456"
    }
    ```

    ## Successful Response (200)
    ```json
    {
      "status": "success",
      "resetToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 900
    }
    ```

    ## Possible Errors
    - **400** — Invalid code or email, code expired, too many attempts
    - **429** — Too many failed attempts (locked for security)
    - **500** — Unexpected error
    """
    try:
        temp_token = await user_service.verify_reset_code(body.email, body.code)
        return {
            "status": "success",
            "resetToken": temp_token,
            "expiresIn": 900  # 15 minutes in seconds
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(500, str(e))


@router.post("/auth/reset-password")
async def reset_password(
    body: PasswordResetConfirm,
):
    """
    Reset user password using the temporary reset token.

    ## Authentication
    Requires the temporary token from `/verify-reset-code` in the Authorization header:
    ```
    Authorization: Bearer <resetToken>
    ```

    ## Request Body
    ```json
    {
      "new_password": "NewSecurePassword123!"
    }
    ```

    ## Successful Response (200)
    ```json
    {
      "status": "success",
      "message": "Password reset successfully."
    }
    ```

    ## Possible Errors
    - **400** — Invalid token or user mismatch
    - **401** — Token expired or missing
    - **500** — Unexpected error

    ## Security Notes
    - New password must be at least 8 characters
    - Token is valid for 15 minutes
    - After reset, user should log in with new password
    """
    try:
        # Validate that token is password_reset type
        user_id = current_user.get("userId")
        email = current_user.get("email")
        token_type = current_user.get("type")

        if token_type != "password_reset":
            raise HTTPException(400, "Invalid token type.")

        await user_service.reset_password(user_id, email, body.new_password)

        return {
            "status": "success",
            "message": "Password reset successfully."
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(500, str(e))
