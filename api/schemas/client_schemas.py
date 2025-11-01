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


class ClientInDB(ClientBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    email: Optional[str]
    phone: Optional[str]
    created_at: datetime = Field(default_factory=lambda: datetime.utcnow())

    class Config:
        from_attributes = True
        populate_by_name = True


class ClientOverviewRequest(BaseModel):
    """
    Request body for retrieving the full client overview,
    including overview stats and all company sales.
    """
    companyId: str = Field(..., description="ID of the company to fetch client and sales overview for")

class ClientCreateRequest(BaseModel):
    """
    Request body for creating a new client inside a company's embedded 'clients' array.
    Includes the company ID and client data.
    """
    companyId: str = Field(..., description="ID of the company where the client will be added")
    name: str = Field(..., min_length=2, max_length=100, description="Client full name")
    email: Optional[str] = Field(None, description="Client email (optional)")
    phone: Optional[str] = Field(None, description="Client phone (optional)")
    city: Optional[str] = Field(None, description="Client address (optional)")

