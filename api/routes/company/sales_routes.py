from fastapi import APIRouter, Depends, status
from ...schemas.sale_schemas import SaleCreate, SaleSearchQuery, CompanyAllSalesRequest, CompanyOverviewRequest
from ...services.sale_services import SaleService
from ...infra.database import get_database_client
from ...utils.security import get_current_user

router = APIRouter(prefix="/sales", tags=["Sales"])

@router.post(
    "/create_sale",
    status_code=status.HTTP_201_CREATED,
    summary="Register a new sale",
    response_description="Confirmation of successful sale registration"
)
async def create_sale_route(
    sale_data: SaleCreate,
    db_client=Depends(get_database_client),
    current_user=Depends(get_current_user)
):
    """
    Register a new sale for the authenticated user's company.

    ## Description
    This endpoint allows authenticated users to register a new sale linked
    to their company (extracted automatically from the JWT token).

    - **Client Handling**: If the client name does not exist, a new client is automatically created.
    - **Products**: Products are referenced by name and validated internally.
    - **Inventory**: Quantities are updated according to the sold items.
    - **Security**: Requires a valid JWT token in the `Authorization` header.

    ## Request Body Example
    ```json
    {
      "clientName": "John Doe",
      "items": [
        { "productName": "Notebook Gamer", "quantity": 2, "price": 4500 }
      ]
    }
    ```

    ## Responses
    - **201 Created**: Sale successfully registered.
    - **401 Unauthorized**: Missing or invalid JWT token.
    - **404 Not Found**: Company not found.
    - **500 Internal Server Error**: Unexpected server or database error.
    """
    companyId = current_user["companyId"]
    service = SaleService(db_client)
    await service.create_sale(sale_data, companyId)
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


@router.post("/get_all", status_code=status.HTTP_200_OK)
async def get_all_sales_route(
    body: CompanyAllSalesRequest,
    db_client=Depends(get_database_client)
):
    """
    Returns all sales for a specific company.

    - Receives companyId in the JSON body.
    - Returns each sale with client and product names.
    - Only the sale ID (`_id`) is kept; all other IDs are replaced by readable names.
    - Values and dates are properly formatted.
    """
    service = SaleService(db_client)
    sales = await service.get_all_sales(body.companyId)

    return {
        "status": "success",
        "count": len(sales),
        "sales": sales
    }


@router.post("/overview", status_code=status.HTTP_200_OK)
async def get_sales_overview_route(
    body: CompanyOverviewRequest,
    db_client=Depends(get_database_client)
):
    """
    Returns analytical insights and sales overview for a company.
    
    Includes:
    - Total sold today and comparison to yesterday (%)
    - Total sales overall
    - Total sales this week
    - Average ticket and comparison with last month's average ticket (%)
    """
    service = SaleService(db_client)
    overview = await service.get_sales_overview(body.companyId)
    return {
        "status": "success",
        "overview": overview
    }
