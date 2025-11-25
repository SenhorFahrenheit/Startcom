from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from bson import ObjectId
from .base_objectid import PyObjectId


class ClientBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Client full name")


class ClientCreate(ClientBase):
    """Schema used when automatically creating a client."""
    email: Optional[str] = Field(None, description="Client email (optional)")
    phone: Optional[str] = Field(None, description="Client phone (optional)")
    city: Optional[str] = Field(None, description="Client city/address")


class ClientInDB(ClientBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    email: Optional[str]
    phone: Optional[str]
    created_at: datetime = Field(default_factory=lambda: datetime.utcnow())

    class Config:
        from_attributes = True
        populate_by_name = True



class ClientCreateRequest(BaseModel):
    """
    Request body for creating a new client inside a company's embedded 'clients' array.
    Includes the company ID and client data.
    """
    name: str = Field(..., min_length=2, max_length=100, description="Client full name")
    email: Optional[str] = Field(None, description="Client email (optional)")
    phone: Optional[str] = Field(None, description="Client phone (optional)")
    city: Optional[str] = Field(None, description="Client address (optional)")


class ClientNamesResponse(BaseModel):
    """
    Response model containing all client names of the company.
    """
    status: str = Field(..., description="Operation result status")
    clients: list[str] = Field(..., description="List of all client names")


class ClientUpdateRequest(BaseModel):
    client_id: str
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    # category: Optional[str] = None
    class Config:
        json_schema_extra = {
            "example": {
                "client_id": "69019f25b407b09e0d09cff6",
                "name": "John Doe Updated",
                "email": "john.updated@example.com",
                "phone": "+5511999999999",
                "address": "Rua Central, 456",
                # "category": "VIP"
            }
        }

