from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from .base_objectid import PyObjectId
from bson import ObjectId

class CompanyBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=100, description="Company name")
    taxId: str = Field(..., description="Unique company tax identifier (e.g., CNPJ)")

class CompanyCreate(CompanyBase):
    ownerId: PyObjectId = Field(..., description="ID of the user who owns the company")

class CompanyInDB(CompanyBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    ownerId: PyObjectId
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)
    clients: list = Field(default_factory=list)
    inventory: list = Field(default_factory=list)
    sales: list = Field(default_factory=list)

    class Config:
        json_encoders = {ObjectId: str}
        allow_population_by_field_name = True
