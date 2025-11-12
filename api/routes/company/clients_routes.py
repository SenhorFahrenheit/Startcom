from fastapi import APIRouter, Depends, status
from ...infra.database import get_database_client
from ...schemas.client_schemas import ClientCreateRequest, ClientNamesRequest
from ...services.client_services import ClientService
from fastapi import HTTPException
from ...utils.helper_functions import serialize_mongo
from ...utils.security import get_current_user

router = APIRouter(prefix="/clients", tags=["Clients"])


@router.post("/overview_full", status_code=status.HTTP_200_OK)
async def get_clients_overview_full(
    db_client=Depends(get_database_client),
    current_user=Depends(get_current_user)
):
    """
    Retrieve a complete overview combining client data and company sales.

    ## Authentication
    Requires a valid **JWT token** in the `Authorization` header:
    ```
    Authorization: Bearer <access_token>
    ```

    ## Description
    Returns a **combined dataset** for dashboards, containing:
    - All clients (name, email, category, satisfaction)
    - All company sales (total, date, items, client names)
    - Summary statistics for both sections

    ## Request
    **No body required.**
    The `companyId` is automatically extracted from the token.

    ## Responses

    ### 200 OK
    ```json
    {
      "status": "success",
      "overview": {
        "status": "success",
        "overview": {
          "clients": {
            "total": 19,
            "vip": 3,
            "newThisMonth": 9,
            "averageSatisfaction": 2.23
          }
        },
        "clients": [
          {
            "id": "69019f25b407b09e0d09cff6",
            "name": "Client 1",
            "email": "client1@example.com",
            "phone": "+5511978922530",
            "address": "Street 1, 973",
            "category": "regular",
            "totalSpent": 13800,
            "lastPurchase": "2025-11-01"
          },
          {
            "id": "69019f25b407b09e0d09cff7",
            "name": "Client 2",
            "email": "client2@example.com",
            "phone": "+5511998166867",
            "address": "Street 2, 59",
            "category": "VIP",
            "totalSpent": 32550,
            "lastPurchase": "2025-11-01"
          }
          // ... more clients
        ]
      }
    }
    ```

    ### 401 Unauthorized
    ```json
    {"detail": "Invalid or missing token"}
    ```

    ### 404 Not Found
    ```json
    {"detail": "Company not found"}
    ```

    ### 500 Internal Server Error
    ```json
    {"detail": "Unexpected error: <error_message>"}
    ```
    """
    company_id = current_user["companyId"]

    service = ClientService(db_client)
    overview = await service.get_clients_overview_full(company_id)

    return {
        "status": "success",
        "overview": overview
    }


@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_client_route(
    body: ClientCreateRequest,
    db_client=Depends(get_database_client)
):
    """
    Creates a new client within a company's 'clients' subdocument array.

    Validation:
    - Rejects creation if another client with the same name **and** email already exists in this company.
    """
    service = ClientService(db_client)

    company_id = body.companyId

    # Check for duplicates by name and email
    existing_by_name = await service.get_client_by_name(company_id, body.name)
    existing_by_email = await service.get_client_by_email(company_id, body.email)

    if existing_by_name and existing_by_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A client with the same name and email already exists in this company."
        )

    created_client = await service.create_client(company_id, body)

    return {
        "status": "success",
        "message": "Client created successfully.",
        # "client": serialize_mongo(created_client)
    }

@router.post("/names", status_code=status.HTTP_200_OK)
async def get_client_names(
    body: ClientNamesRequest,
    db_client=Depends(get_database_client)
):
    """
    Returns only the names of all clients from the given company.
    
    Expected JSON body:
    ```json
    {
        "companyId": "653b2f9d3e2b123456789012"
    }
    ```

    Response example:
    ```json
    {
        "status": "success",
        "clients": ["Client 1", "Client 2", "Client 3"]
    }
    ```
    """
    service = ClientService(db_client)
    return await service.get_all_client_names(body.companyId)