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
    companyId: PyObjectId = Field(..., description="Company making the sale")
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


# 🔹 Search schema for text-based queries
class SaleSearchQuery(BaseModel):
    """
    Schema for performing a text-based search over all sales fields.
    """
    companyId: str = Field(..., description="ID of the company where to search sales")
    query: str = Field(..., description="Text to search across all sale fields")


# 🔹 Schema for retrieving all sales of a company
class CompanyAllSalesRequest(BaseModel):
    """
    JSON body schema for retrieving all sales from a company.
    """
    companyId: str = Field(..., description="ID of the company to fetch all sales for")


# 🔹 Schema for retrieving sales overview
class CompanyOverviewRequest(BaseModel):
    companyId: str = Field(..., description="Company ID to retrieve sales overview for")
