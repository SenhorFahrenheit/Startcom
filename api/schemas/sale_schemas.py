from pydantic import BaseModel, Field
from bson import ObjectId
from datetime import datetime
from typing import List
from .base_objectid import PyObjectId


# 🔹 Each item in the sale now uses productName instead of productId
class SaleItem(BaseModel):
    productName: str = Field(..., description="Name of the product being sold")
    quantity: int = Field(..., gt=0, description="Quantity sold")
    price: float = Field(..., gt=0, description="Price per unit")


# 🔹 Sale creation request (frontend sends product names only)
class SaleCreate(BaseModel):
    clientName: str = Field(..., description="Name of the client buying the products")
    items: List[SaleItem] = Field(..., description="List of products and quantities")


# 🔹 Representation of sale items stored in DB
class SaleItemInDB(BaseModel):
    productId: PyObjectId = Field(..., description="Reference to the sold product")
    quantity: int
    price: float


# 🔹 Representation of a sale document stored in DB
class SaleInDB(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id") 
    clientId: PyObjectId
    items: List[SaleItemInDB]
    total: float
    date: datetime

    class Config:
        populate_by_name = True
        from_attributes = True

