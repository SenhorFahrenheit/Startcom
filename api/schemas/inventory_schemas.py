from pydantic import BaseModel, Field
from ..schemas.base_objectid import PyObjectId
from typing import List


class InventoryFullRequest(BaseModel):
    """
    Request body for retrieving all product details
    from a specific company's inventory.
    """
    companyId: str = Field(..., description="ID of the company to fetch inventory from")

class InventoryCountRequest(BaseModel):
    """
    Request body to (re)calculate the total number of products
    for a given company.
    """
    companyId: str = Field(..., description="Company ID whose inventory count will be calculated")


class InventoryOverviewRequest(BaseModel):
    companyId: PyObjectId = Field(..., description="ID da empresa")

class ProductOverview(BaseModel):
    name: str
    category: str
    quantity: int
    minQuantity: int
    unitPrice: float
    status: str
    totalValue: float

class InventoryOverviewResponse(BaseModel):
    totalProducts: int
    lowInventory: int
    criticalInventory: int
    totalValue: float
    products: List[ProductOverview]


