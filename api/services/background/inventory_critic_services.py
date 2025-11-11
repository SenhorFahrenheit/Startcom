from datetime import datetime
from bson import ObjectId
from fastapi import HTTPException

class InventoryCriticService:
    """
    Computes and updates aggregated inventory metrics for each company.
    """

    def __init__(self, db_client):
        self.db = db_client
        self.company_collection = self.db.get_collection("company")

    async def recalc_all_companies_critic_inventory(self):

        companies = self.company_collection.find({})

        async for company in companies:
            inventory = company.get("inventory", [])

            critical_inventory = len([
                p for p in inventory
                # if p.get("quantity", 0) <= p.get("minQuantity", 0) * 0.3
                if p.get("quantity", 0) <= p.get("minQuantity", 0)
            ])
            
            await self.company_collection.update_one(
                {"_id": company["_id"]},
                {
                    "$set": {
                        "inventoryStats.criticalInventory": critical_inventory,
                        "updatedAt": datetime.utcnow()
                    }
                }
                    
            )

            
 