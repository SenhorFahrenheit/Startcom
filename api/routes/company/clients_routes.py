from fastapi import APIRouter, Depends, status
from ...infra.database import get_database_client
from ...schemas.client_schemas import ClientOverviewRequest, ClientCreateRequest
from ...services.client_services import ClientService
from fastapi import HTTPException
from ...utils.helper_functions import serialize_mongo

router = APIRouter(prefix="/clients", tags=["Clients"])


@router.post("/overview_full", status_code=status.HTTP_200_OK)
async def get_clients_overview_full(
    body: ClientOverviewRequest,
    db_client=Depends(get_database_client)
):
    """
    Returns an overview of all clients **and** all company sales.

    Combines both datasets for dashboard efficiency.
    Used by the frontend to display the overview and sales list together.
    """
    service = ClientService(db_client)
    return await service.get_clients_overview_full(body.companyId)


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