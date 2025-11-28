from fastapi import APIRouter, Depends, status
from ...infra.database import get_database_client
from ...utils.security import get_current_user
from ...schemas.inventory_schemas import (
    InventoryOverviewResponse,
    InventoryCreateRequest,
    InventoryAddProduct,
    DeleteProductRequest
)
from ...services.inventory_services import InventoryService

router = APIRouter(prefix="/inventory", tags=["Inventory"])

@router.get("/full", status_code=status.HTTP_200_OK)
async def get_inventory_full_route(
    db_client=Depends(get_database_client),
    current_user=Depends(get_current_user)
):
    """
    Retrieve all products from the authenticated user's company inventory.

    ## Authentication
    Requires a valid **JWT token** in the `Authorization` header:
    ```
    Authorization: Bearer <access_token>
    ```

    ## Description
    Returns all products stored in the company's inventory, excluding `createdAt`.
    Useful for listing and management views.

    ## Response Example
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
        },
        {
          "_id": "69019f25b407b09e0d09d001",
          "name": "Mouse Logitech",
          "description": "Mouse Logitech description",
          "price": 150,
          "quantity": 6
        }
      ]
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
    service = InventoryService(db_client)
    company_id = current_user["companyId"]

    return await service.get_inventory_full(company_id)

@router.get("/overview", response_model=InventoryOverviewResponse, status_code=status.HTTP_200_OK, summary="Get Inventory Overview")
async def inventory_overview_route(
    db_client=Depends(get_database_client),
    current_user=Depends(get_current_user)
):
    """
    Retrieve a summarized inventory overview for the authenticated company.

    ## Authentication
    Requires a valid **JWT token** in the `Authorization` header:
    ```
    Authorization: Bearer <access_token>
    ```

    ## Description
    Returns a complete inventory summary, including:
    - Total products
    - Low-stock and critical-stock counts
    - Total invested value (based on costPrice)
    - Each product’s status (Normal, Baixo, Crítico, Esgotado)

    ## Response Example
    ```json
    {
      "totalProducts": 15,
      "lowInventory": 3,
      "criticalInventory": 1,
      "totalValue": 12800.5,
      "products": [
        {
          "name": "Notebook Gamer",
          "category": "Informática",
          "quantity": 45,
          "minQuantity": 7,
          "unitPrice": 4500,
          "status": "Normal",
          "totalValue": 315000
        }
      ]
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
    service = InventoryService(db_client)
    company_id = current_user["companyId"]

    return await service.get_inventory_overview(company_id)



@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_inventory_product(
    body: InventoryCreateRequest,
    db_client=Depends(get_database_client),
    current_user=Depends(get_current_user)
):
    """
    Create a new product inside the authenticated company's inventory.

    ## Authentication
    Requires a valid **JWT token** in the `Authorization` header:
    ```
    Authorization: Bearer <access_token>
    ```

    ## Description
    Adds a new product into the company's inventory, ensuring **unique product names**.

    ## Request Example
    ```json
    {
      "product": {
        "name": "Mouse Gamer",
        "description": "Ergonomic RGB gaming mouse",
        "price": 120.0,
        "costPrice": 80.0,
        "quantity": 10,
        "minQuantity": 3,
        "category": "Eletrônicos"
      }
    }
    ```

    ## Response Example
    ```json
    {
      "status": "success",
      "message": "Product created successfully."
    }
    ```

    ### 409 Conflict
    ```json
    {"detail": "A product with this name already exists in the company."}
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
    service = InventoryService(db_client)
    company_id = current_user["companyId"]

    await service.create_product(company_id, body.product)

    return {
        "status": "success",
        "message": "Product created successfully."
    }

@router.post("/increase_inventory", status_code=status.HTTP_200_OK)
async def increase_inventory_product(
    body: InventoryAddProduct,
    db_client = Depends(get_database_client),
    current_user = Depends(get_current_user)
):
    """
    Increase the quantity of a specific product in the authenticated user's company.

    ## Authentication
    Requires a valid **JWT Token** in the `Authorization` header:

    ```
    Authorization: Bearer <access_token>
    ```

    ## Request Body
    The frontend must send the product name and the quantity to be added:
    ```json
    {
        "name": "Notebook Gamer",
        "amount": 5
    }
    ```

    ## Successful Response
    ```json
    {
        "status": "success",
        "message": "Product quantity increased successfully"
    }
    ```

    ## Possible Errors
    - **401 Unauthorized:** Missing or invalid JWT token  
    - **404 Not Found:** Company or product not found  
    - **500 Internal Server Error:** Unexpected database issues  
    """
    
    service = InventoryService(db_client)
    company_id = current_user["companyId"]

    await service.increase_product_inventory(company_id, body.name, body.amount)

    return {
        "status": "success",
        "message": "Product quantity increased successfully"
    }

@router.delete("/delete_product", status_code=status.HTTP_200_OK)
async def delete_inventory_product(
    body: DeleteProductRequest,
    db_client=Depends(get_database_client),
    current_user=Depends(get_current_user)
):
    """
    Delete a product from the authenticated company's inventory.

    ## Authentication
    Requires a valid **JWT token** in the `Authorization` header:
    ```
    Authorization: Bearer <access_token>
    ```

    ## Description
    Removes a product from the company's inventory by product id.
    The endpoint expects the product identifier in the request body and
    will return a success message when deletion completes.

    ## Request Example
    ```json
    {
      "productId": "69019f25b407b09e0d09d000"
    }
    ```

    ## Successful Response
    ```json
    {
      "status": "success",
      "message": "Product deleted successfully."
    }
    ```

    ### 401 Unauthorized
    ```json
    {"detail": "Invalid or missing token"}
    ```

    ### 404 Not Found
    ```json
    {"detail": "Product not found"}
    ```

    ### 500 Internal Server Error
    ```json
    {"detail": "Unexpected error: <error_message>"}
    ```
    """
    service = InventoryService(db_client)
    company_id = current_user["companyId"]

    await service.delete_product(company_id, body.productId)

    return {
        "status": "success",
        "message": "Product deleted successfully."
    }
