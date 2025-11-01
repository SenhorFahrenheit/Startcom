from pydantic import BaseModel, Field


class InventoryNamesRequest(BaseModel):
    """
    Request body for retrieving all product names from a company's inventory.
    """
    companyId: str = Field(..., description="ID of the company whose inventory will be queried.")
