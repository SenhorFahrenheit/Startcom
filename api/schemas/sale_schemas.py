from pydantic import BaseModel, Field
from bson import ObjectId
from datetime import datetime
from typing import List
from .base_objectid import PyObjectId

# 🔹 Individual item in sale
class SaleItem(BaseModel):
    productId: PyObjectId = Field(..., description="Product sold")
    quantity: int = Field(..., gt=0)
    price: float = Field(..., gt=0)


# 🔹 Sale creation request
class SaleCreate(BaseModel):
    companyId: PyObjectId = Field(..., description="Company making the sale")
    clientName: str = Field(..., description="Name of the client buying the products")
    items: List[SaleItem] = Field(..., description="List of products and quantities")


# 🔹 Sale model returned from DB
class SaleInDB(BaseModel):
    clientId: PyObjectId
    items: List[SaleItem]
    total: float
    date: datetime = Field(default_factory=lambda: datetime.utcnow())


class SaleSearchQuery(BaseModel):
    """
    Schema for performing a text-based search over all sales fields.
    """
    companyId: str = Field(..., description="ID of the company where to search sales")
    query: str = Field(..., description="Text to search across all sale fields")

class CompanyAllSalesRequest(BaseModel):
    """
    JSON body schema for retrieving all sales from a company.
    """
    companyId: str = Field(..., description="ID of the company to fetch all sales for")


class CompanyOverviewRequest(BaseModel):
    companyId: str = Field(..., description="Company ID to retrieve sales overview for")


