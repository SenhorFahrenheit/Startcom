from pydantic import BaseModel, EmailStr
# Schema for login request
class LoginRequest(BaseModel):
    email: EmailStr
    password: str