from fastapi import APIRouter, Depends, status
from ...infra.database import get_database_client
from ...schemas.inventory_schemas import InventoryNamesRequest
from ...services.inventory_services import InventoryService

router = APIRouter(prefix="/inventory", tags=["Inventory"])


@router.post("/names", status_code=status.HTTP_200_OK)
async def get_inventory_names_route(
    body: InventoryNamesRequest,
    db_client=Depends(get_database_client)
):
    """
    Retrieves all product names from a company's inventory.

    This route is typically used by the frontend to populate dropdowns,
    search filters, or selection lists when creating sales.
    """
    service = InventoryService(db_client)
    return await service.get_inventory_names(body.companyId)
