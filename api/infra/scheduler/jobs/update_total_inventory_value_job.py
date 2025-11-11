from ...database import get_database_client
from ....services.background.inventory_total_value_services import InventoryTotalValueService

async def update_total_inventory_value_job():
    """
    Scheduled job that recalculates total inventory value across all companies.
    """
    db_client = await get_database_client()
    service = InventoryTotalValueService(db_client)

    await service.update_total_inventory_value_for_all_companies()
