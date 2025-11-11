from fastapi import APIRouter, Depends, status
from ...infra.database import get_database_client
from ...schemas.inventory_schemas import InventoryFullRequest, InventoryOverviewRequest, InventoryOverviewResponse, InventoryCreateRequest
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


@router.post("/overview", response_model=InventoryOverviewResponse, status_code=status.HTTP_200_OK)
async def inventory_overview_route(
    body: InventoryOverviewRequest,
    db_client = Depends(get_database_client)
):
    service = InventoryService(db_client)
    
    return await service.get_inventory_overview(body.companyId)

@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_inventory_product(
    body: InventoryCreateRequest,
    db_client=Depends(get_database_client)
):
    """
    Creates a new product in a company's inventory.
    Ensures no duplicate product names exist in the same company.
    """
    service = InventoryService(db_client)

    created_product = await service.create_product(body.companyId, body.product)

    return {
        "status": "success",
        "message": "Product created successfully."

    }
