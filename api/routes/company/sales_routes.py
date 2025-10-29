from fastapi import APIRouter, Depends, status
from ...schemas.sale_schemas import SaleCreate
from ...services.sale_services import SaleService
from ...config.database import get_database_client

router = APIRouter(prefix="/sales", tags=["Sales"])

@router.post("/create_sale", status_code=status.HTTP_201_CREATED)
async def create_sale_route(
    sale_data: SaleCreate,
    db_client=Depends(get_database_client)
):
    """
    Registers a new sale for a company.

    Security:
    - The companyId is received in the request body (JSON), not in the URL.
    - Prevents exposing IDs via browser logs or query strings.
    """
    service = SaleService(db_client)
    await service.create_sale(sale_data)
    return {"status": "success", "message": "Sale created successfully."}
