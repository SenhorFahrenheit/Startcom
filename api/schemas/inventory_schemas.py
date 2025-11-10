from pydantic import BaseModel, Field


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

