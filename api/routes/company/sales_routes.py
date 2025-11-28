from fastapi import APIRouter, Depends, status, HTTPException
from ...schemas.sale_schemas import SaleCreate
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


@router.get("/get_all", status_code=status.HTTP_200_OK)
async def get_all_sales_route(
    db_client=Depends(get_database_client),
    current_user=Depends(get_current_user)
):
    """
    Retrieve all sales for the authenticated user's company.

    ## Authentication
    Requires a valid **JWT token** in the `Authorization` header:
    ```
    Authorization: Bearer <access_token>
    ```

    ## Description
    Returns all sales belonging to the company associated with the authenticated user.

    Each sale includes:
    - Client and product names
    - Sale total and date
    - All internal IDs replaced by human-readable values

    ## Request
    **No body required.**
    The authenticated user's `companyId` is automatically extracted from the JWT token.

    ## Responses

    ### 200 OK
    ```json
    {
      "status": "success",
      "count": 2,
      "sales": [
        {
          "_id": "672aaf29cf845a764b3f118a",
          "clientName": "João Silva",
          "items": [
            {
              "productName": "Notebook Gamer",
              "quantity": 1,
              "price": 4500.0
            }
          ],
          "total": 4500.0,
          "date": "2025-01-12T14:32:00Z"
        },
        {
          "_id": "672aaf29cf845a764b3f118b",
          "clientName": "Maria Oliveira",
          "items": [
            {
              "productName": "Mouse Logitech",
              "quantity": 2,
              "price": 150.0
            }
          ],
          "total": 300.0,
          "date": "2025-01-10T09:21:00Z"
        }
      ]
    }
    ```

    ### 401 Unauthorized
    ```json
    {
      "detail": "Invalid or missing token"
    }
    ```

    ### 404 Not Found
    ```json
    {
      "detail": "Company not found"
    }
    ```

    ### 500 Internal Server Error
    ```json
    {
      "detail": "Unexpected error: <error_message>"
    }
    ```

    ---
    """
    company_id = current_user["companyId"]
    service = SaleService(db_client)
    sales = await service.get_all_sales(company_id)

    return {
        "status": "success",
        "count": len(sales),
        "sales": sales
    }


@router.get("/overview", status_code=status.HTTP_200_OK)
async def get_sales_overview_route(
    db_client=Depends(get_database_client),
    current_user=Depends(get_current_user)
):
    """
    Retrieve sales overview and performance analytics for the authenticated user's company.

    ## Authentication
    Requires a valid **JWT token** in the `Authorization` header:
    ```
    Authorization: Bearer <access_token>
    ```

    ## Description
    Returns sales analytics for the authenticated company, including:
    - Total sold **today** and comparison to **yesterday (%)**
    - Total sales **overall**
    - Total sales **this week**
    - **Average ticket** value and comparison to **last month (%)**

    ## Request
    **No body required.**
    The authenticated user's `companyId` is automatically extracted from the JWT token.

    ## Responses

    ### 200 OK
    ```json
    {
      "status": "success",
      "overview": {
        "today": {
          "total": 1200.0,
          "comparison": 15.6
        },
        "sales": {
          "total": 18900.0,
          "week": 5600.0
        },
        "ticket": {
          "average": 315.0,
          "comparison": -5.2
        }
      }
    }
    ```

    ### 401 Unauthorized
    ```json
    {
      "detail": "Invalid or missing token"
    }
    ```

    ### 404 Not Found
    ```json
    {
      "detail": "Company not found"
    }
    ```

    ### 500 Internal Server Error
    ```json
    {
      "detail": "Unexpected error: <error_message>"
    }
    ```
    """
    company_id = current_user["companyId"]
    service = SaleService(db_client)
    overview = await service.get_sales_overview(company_id)

    return {
        "status": "success",
        "overview": overview
    }
