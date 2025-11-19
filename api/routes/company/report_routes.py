from fastapi import APIRouter, Depends, HTTPException
from ...utils.security import get_current_user
from ...schemas.report_schemas import SalesPeriodRequest
from ...services.report_services import SalesAnalyticsService
from ...infra.database import get_database_client
router = APIRouter(prefix="/report", tags=["Reports"])

@router.post("/sales/overview")
async def get_sales_overview(
    body: SalesPeriodRequest,
    current_user=Depends(get_current_user),
    db_client = Depends(get_database_client)
):
    """
    Retrieve advanced sales metrics including:
    - Category distribution based on the provided time period.
    - Total sales over the provided time period.
    - Active customers from the last 3 months (fixed).
    - New customers from the last month (fixed).

    The period provided in the request body affects ONLY:
    - Category distribution.
    - Total sales for the period.

    Accepted periods:
    - 7d
    - 30d
    - 6m
    - 1y
    """
    service = SalesAnalyticsService(db_client)

    companyId = current_user["companyId"]

    return await service.get_advanced_sales_overview(companyId, body.period)
