from pydantic import BaseModel, Field
from ..schemas.base_objectid import PyObjectId
from typing import List
from typing import Optional
from datetime import datetime



class InventoryCountRequest(BaseModel):
    """
    Request body to (re)calculate the total number of products
    for a given company.
    """
    companyId: str = Field(..., description="Company ID whose inventory count will be calculated")



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


class InventoryCreate(BaseModel):
    name: str = Field(..., min_length=2, description="Product name")
    description: Optional[str] = Field(None, description="Product description")
    price: float = Field(..., gt=0, description="Unit sale price")
    costPrice: float = Field(..., gt=0, description="Product cost price")
    quantity: int = Field(..., ge=0, description="Current stock quantity")
    minQuantity: int = Field(..., ge=0, description="Minimum quantity to keep in stock")
    category: str = Field(..., description="Product category")


class InventoryItemInDB(InventoryCreate):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    createdAt: datetime = Field(default_factory=lambda: datetime.utcnow())

    class Config:
        from_attributes = True
        populate_by_name = True


class InventoryCreateRequest(BaseModel):
    product: InventoryCreate = Field(..., description="Product data to be inserted")

class InventoryAddProduct(BaseModel):
    name: str = Field(..., description="Name of the product to increase stock")
    amount: int = Field(..., gt=0, description="How many units to add")

class DeleteProductRequest(BaseModel):
    productId: str = Field(..., description="ID of the product to be deleted")


