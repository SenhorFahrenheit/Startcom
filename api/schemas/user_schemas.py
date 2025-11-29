from typing import Optional, Union
from datetime import date
from pydantic import BaseModel, Field, EmailStr, validator
from datetime import datetime
import re

# Pydantic Schemas for the User module
# This file defines the data structures and validation rules for user-related data.

class UserBase(BaseModel):
    """
    Base schema for user data.
    This schema contains the common fields for user models.
    """
    name: str = Field(..., min_length=3, max_length=100, description="Full name of the user or company.")
    email: EmailStr = Field(..., description="Unique email address for the user.")
    birth_date: datetime = Field(..., description="User's date of birth.")
    phone_number: str = Field(..., description="User's phone number, including country code (e.g., '+5511999998888').")
    
    # Using Union to allow either CPF or CNPJ. 
    # This design provides flexibility for different types of users (individuals vs. companies).
    cpf_cnpj: str = Field(..., min_length=11, max_length=18, description="User's CPF (11 digits) or CNPJ (14 digits).")
    
    # Pydantic validation for the phone number format
    @validator("phone_number")
    def validate_phone_number(cls, v):
        """
        Validates the phone number format.
        It must start with a '+' followed by digits. This ensures international format.
        """
        if not re.match(r'^\+\d{11,15}$', v):
            raise ValueError("Phone number must be in international format (e.g., '+5511999998888').")
        return v

    # Pydantic validation for CPF or CNPJ
    @validator("cpf_cnpj")
    def validate_cpf_cnpj(cls, v):
        """
        Validates if the provided string is a valid CPF (11 digits) or CNPJ (14 digits).
        Removes non-digit characters for validation.
        """
        digits_only = re.sub(r'\D', '', v)
        if len(digits_only) == 11 or len(digits_only) == 14:
            return v
        raise ValueError("Invalid CPF (must have 11 digits) or CNPJ (must have 14 digits).")
        
class UserCreate(UserBase):
    """
    Schema for creating a new user.
    Extends UserBase and adds the password field, which is not returned in the response.
    """
    password: str = Field(..., min_length=8, description="User's password. It will be hashed and not stored in plain text.")

class UserResponse(UserBase):
    """
    Schema for returning a user's data to the client.
    Inherits from UserBase but does not include sensitive information like the password hash.
    It's used to control what data is exposed to the API consumer.
    """
    id: str = Field(..., description="Unique identifier for the user in the database.")

class UserCreatedResponse(BaseModel):
    """
    Response model returned after a successful user creation.
    Excludes sensitive fields like password or password hash.
    """
    name: str
    email: EmailStr
    cpf_cnpj: str
    birth_date: Optional[datetime] = None
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True
        json_schema_extra = {
            "example": {
                "id": "6718bfe56a9f3b2c8c90d74a",
                "name": "Yuri Silva",
                "email": "yuri@email.com",
                "cpf_cnpj": "123.456.789-00",
                "birth_date": "2005-10-10T00:00:00",
                "created_at": "2025-10-23T09:30:00"
            }
        }


class UserInDB(UserBase):
    """
    Schema for the user data as it is stored in the database.
    This model includes the hashed password for security.
    """
    id: Optional[str] = Field(None, description="Unique ID for the user in the database.")
    password_hash: str = Field(..., description="The cryptographic hash of the user's password.")
    created_at: Optional[datetime] = Field(None, description="Date and time when the user was created.")
    updated_at: Optional[datetime] = Field(None, description="Date and time when the user was last updated.")

from pydantic import BaseModel, EmailStr

class ContactFormRequest(BaseModel):
    name: str
    email: EmailStr
    message: str