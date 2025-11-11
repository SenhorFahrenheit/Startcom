from datetime import datetime
from ....services.background.inventory_count_services import InventoryCountService
from ....infra.database import get_database_client

async def update_inventory_total_products_job():
    """
    Background job responsible for updating the total number of products
    in inventory for all companies.

    This job is scheduled periodically by APScheduler.
    """
    print(f"[{datetime.utcnow().isoformat()}] Starting job: update_inventory_total_products_job")

    db_client = await get_database_client()

    service = InventoryCountService(db_client)
    result = await service.recalc_all_companies_total_products()

    print(f"[{datetime.utcnow().isoformat()}] Job finished. Updated: {result['updatedCompanies']} | Errors: {result['errors']}")
    return result
