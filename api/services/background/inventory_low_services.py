from bson import ObjectId
from datetime import datetime
from fastapi import HTTPException

class InventoryLowService:
    """
    Service responsible for calculating the number of products that are below
    their defined minimum stock threshold (low inventory).
    """

    def __init__(self, db_client):
        self.db = db_client
        self.company_collection = self.db.get_collection("company")

    async def recalc_all_companies_low_inventory(self):
        """
        Recalculates low-inventory product counts for all companies.
        """
        companies = self.company_collection.find({})
        updated = 0
        errors = 0

        async for company in companies:
            try:
                inventory = company.get("inventory", [])
                
                low_count = 0
                for product in inventory:
                    qty = product.get("quantity", 0)
                    min_qty = product.get("minQuantity", 0)

                    if qty > min_qty and qty <= (min_qty + 10):
                        low_count += 1

                await self.company_collection.update_one(
                    {"_id": company["_id"]},
                    {
                        "$set": {
                            "inventoryStats.lowInventory": low_count,
                            "updatedAt": datetime.utcnow()
                        }
                    }
                )
                updated += 1

            except Exception:
                errors += 1

        return {"updatedCompanies": updated, "errors": errors}
