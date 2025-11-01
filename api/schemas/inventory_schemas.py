from pydantic import BaseModel, Field


class InventoryFullRequest(BaseModel):
    """
    Request body for retrieving all product details
    from a specific company's inventory.
    """
    companyId: str = Field(..., description="ID of the company to fetch inventory from")

