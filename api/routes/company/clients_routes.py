from fastapi import APIRouter, Depends, status
from ...infra.database import get_database_client
from ...schemas.client_schemas import ClientOverviewRequest
from ...services.client_services import ClientService

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

