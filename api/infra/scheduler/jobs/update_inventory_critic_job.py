from ...database import get_database_client
from ....services.background.inventory_critic_services import InventoryCriticService

async def update_critical_inventory_job():
    """
    Job that runs periodically to update the number of products in critical stock
    for every company in the system.
    """
    db_client = await get_database_client()

    service = InventoryCriticService(db_client)
    company_collection = db_client.get_collection("company")

    async for company in company_collection.find({}):
        await service.recalc_all_companies_critic_inventory()
