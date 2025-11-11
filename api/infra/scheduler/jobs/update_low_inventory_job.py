from ....services.background.inventory_low_services import InventoryLowService
from datetime import datetime
from ...database import get_database_client

async def update_low_inventory_job():
    """
    Scheduler job that updates the count of products with low inventory.
    """
    print(f"[{datetime.utcnow().isoformat()}] Running update_low_inventory_job...")

    db_client = await get_database_client()

    service = InventoryLowService(db_client)
    result = await service.recalc_all_companies_low_inventory()

    print(f"[{datetime.utcnow().isoformat()}] lowInventory updated -> {result}")
    return result
