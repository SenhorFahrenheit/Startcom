from fastapi import APIRouter, Depends, status
from ...schemas.sale_schemas import SaleCreate, SaleSearchQuery
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



@router.post("/search_sale", status_code=status.HTTP_200_OK)
async def search_sale_route(
    data: SaleSearchQuery,
    db_client=Depends(get_database_client)
):
    """
    Performs a real-time search for sales using a single text query.
    The query is matched against:
    - sale ID
    - client name
    - product names
    - sale date (day, month, year)
    - total sale value

    Returns all matching sales.
    """
    service = SaleService(db_client)
    results = await service.search_sales(data.companyId, data.query)

    return {
        "status": "success",
        "count": len(results),
        "results": results
    }
