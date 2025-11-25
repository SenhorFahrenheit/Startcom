from fastapi import APIRouter, Depends, status
from ...infra.database import get_database_client
from ...schemas.client_schemas import ClientCreateRequest, ClientUpdateRequest
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
    db_client=Depends(get_database_client),
    current_user=Depends(get_current_user)
):
    """
    Create a new client in the authenticated user's company.

    ## Authentication
    Requires a valid **JWT token** in the `Authorization` header:
    ```
    Authorization: Bearer <access_token>
    ```

    ## Description
    Adds a new client to the company's `clients` array.
    Prevents duplicates based on the combination of **name** and **email**.

    ## Request Body
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+5511999999999",
      "address": "Rua Central, 123",
      "category": "regular"
    }
    ```

    ## Responses

    ### 201 Created
    ```json
    {
      "status": "success",
      "message": "Client created successfully."
    }
    ```

    ### 409 Conflict
    ```json
    {"detail": "A client with the same name and email already exists in this company."}
    ```

    ### 401 Unauthorized
    ```json
    {"detail": "Invalid or missing token"}
    ```

    ### 500 Internal Server Error
    ```json
    {"detail": "Unexpected error: <error_message>"}
    ```
    """
    service = ClientService(db_client)
    company_id = current_user["companyId"]

    # Prevent duplicate clients
    existing_by_name = await service.get_client_by_name(company_id, body.name)
    existing_by_email = await service.get_client_by_email(company_id, body.email)

    if existing_by_name and existing_by_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A client with the same name and email already exists in this company."
        )

    await service.create_client(company_id, body)

    return {
        "status": "success",
        "message": "Client created successfully."
    }

@router.post("/names", status_code=status.HTTP_200_OK)
async def get_client_names(
    db_client=Depends(get_database_client),
    current_user=Depends(get_current_user)
):
    """
    Retrieve only the names of all clients from the authenticated user's company.

    ## Authentication
    Requires a valid **JWT token** in the `Authorization` header:
    ```
    Authorization: Bearer <access_token>
    ```

    ## Description
    Returns a minimal list containing only client names, used for dropdowns or quick selection.

    ## Request
    **No body required.**
    The `companyId` is automatically extracted from the JWT token.

    ## Responses

    ### 200 OK
    ```json
    {
      "status": "success",
      "clients": ["Client 1", "Client 2", "Client 3"]
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
    return await service.get_all_client_names(company_id)

@router.put("/update_client", status_code=status.HTTP_200_OK)
async def update_client_route(
    body: ClientUpdateRequest,
    db_client=Depends(get_database_client),
    current_user=Depends(get_current_user)
):
    """
    Update client information in the authenticated user's company.

    ## Authentication
    Requires a valid **JWT token** in the `Authorization` header:
    ```
    Authorization: Bearer <access_token>
    ```

    ## Description
    Updates an existing client's information. Only the fields provided in the request body will be updated.
    **Note:** The `category` field cannot be modified.

    ## Request Body
    ```json
    {
      "client_id": "69019f25b407b09e0d09cff6",
      "name": "John Doe Updated",
      "email": "john.updated@example.com",
      "phone": "+5511999999999",
      "address": "Rua Central, 456"
    }
    ```

    ## Responses

    ### 200 OK
    ```json
    {
      "status": "success",
      "message": "Client updated successfully."
    }
    ```

    ### 400 Bad Request
    ```json
    {"detail": "Invalid client_id format."}
    ```

    ### 404 Not Found
    ```json
    {"detail": "Client not found in this company."}
    ```

    ### 409 Conflict
    ```json
    {"detail": "A client with the same name and email already exists in this company."}
    ```

    ### 401 Unauthorized
    ```json
    {"detail": "Invalid or missing token"}
    ```

    ### 500 Internal Server Error
    ```json
    {"detail": "Failed to update client."}
    ```
    """
    try:
        service = ClientService(db_client)
        company_id = current_user["companyId"]
        client_id = body.client_id

        # Verify client exists
        existing_client = await service.get_client_by_id(company_id, client_id)
        if not existing_client:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Client not found in this company."
            )

        # Check for duplicate name and email if they are being updated
        if body.name or body.email:
            new_name = body.name or existing_client.get("name")
            new_email = body.email or existing_client.get("email")
            
            existing_by_name = await service.get_client_by_name(company_id, new_name)
            existing_by_email = await service.get_client_by_email(company_id, new_email)

            # Allow if it's the same client being updated
            if (existing_by_name and str(existing_by_name.get("_id")) != client_id) or \
               (existing_by_email and str(existing_by_email.get("_id")) != client_id):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="A client with the same name and email already exists in this company."
                )

        await service.update_client(company_id, client_id, body)

        return {
            "status": "success",
            "message": "Client updated successfully."
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error: {str(e)}"
        )
