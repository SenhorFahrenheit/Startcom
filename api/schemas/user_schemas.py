from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    """
    Schema for creating a new user.
    This schema is used to validate the incoming request body
    when registering a new user.
    """
    # User's full name (must be between 3 and 50 characters)
    name: str = Field(..., min_length=3, max_length=50)

    # User's email (validated automatically as a proper email format)
    email: EmailStr

    # User's password (must be at least 6 characters long)
    password: str = Field(..., min_length=6)
