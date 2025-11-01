from fastapi import APIRouter, Depends, status
from ...infra.database import get_database_client
from ...schemas.inventory_schemas import InventoryFullRequest
from ...services.inventory_services import InventoryService

router = APIRouter(prefix="/inventory", tags=["Inventory"])


@router.post("/full", status_code=status.HTTP_200_OK)
async def get_inventory_full_route(
    body: InventoryFullRequest,
    db_client=Depends(get_database_client)
):
    """
    Returns **all products** from a company's inventory.

    Each product includes:
    - `_id`
    - `name`
    - `description`
    - `price`
    - `quantity`

    `createdAt` is intentionally excluded.

    Example request:
    ```json
    {
      "companyId": "653b2f9d3e2b123456789012"
    }
    ```

    Example response:
    ```json
    {
      "status": "success",
      "products": [
        {
          "_id": "69019f25b407b09e0d09d000",
          "name": "Notebook Gamer",
          "description": "Notebook Gamer description",
          "price": 4500,
          "quantity": 45
        }
      ]
    }
    ```
    """
    service = InventoryService(db_client)
    return await service.get_inventory_full(body.companyId)
