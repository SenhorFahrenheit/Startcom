from datetime import datetime
from fastapi import HTTPException
from bson import ObjectId

class InventoryTotalValueService:
    """
    Calculates total inventory *cost value* (based on costPrice) for each company
    and updates the aggregated field in inventoryStats.
    """

    def __init__(self, db_client):
        self.db = db_client
        self.company_collection = self.db.get_collection("company")

    async def update_total_inventory_value_for_all_companies(self):
        """
        Iterates through all companies and updates inventoryStats.totalValue.
        totalValue = Σ (quantity * costPrice)
        """
        companies = self.company_collection.find({}, {"inventory": 1})

        async for company in companies:
            company_id = company["_id"]
            inventory = company.get("inventory", [])

            # Calculate total cost value of stock
            total_value = sum(
                float(p.get("quantity", 0)) * float(p.get("costPrice", 0))
                for p in inventory
            )

            value = float(round(total_value, 2))

            await self.company_collection.update_one(
                {"_id": ObjectId(company_id)},
                {
                    "$set": {
                        "inventoryStats.totalValue": value,
                        "updatedAt": datetime.utcnow()
                    }
                }
            )
