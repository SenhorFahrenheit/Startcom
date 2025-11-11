from datetime import datetime
from bson import ObjectId
from fastapi import HTTPException

class InventoryCountService:
    """
    Service responsible for calculating and updating the total number
    of products in a company's inventory.

    It writes the result to company.inventoryStats.totalProducts.
    """

    def __init__(self, db_client):
        # db_client: AsyncIOMotorClient (already connected)
        self.db = db_client
        self.company_collection = self.db.get_collection("company")

    async def recalc_total_products(self, company_id: str) -> dict:
        """
        Recalculate the number of products for a single company and persist it in inventoryStats.totalProducts.

        - Finds the company by _id
        - Counts `len(inventory)` safely
        - Sets inventoryStats.totalProducts
        - Updates updatedAt for traceability
        """
        company = await self.company_collection.find_one({"_id": ObjectId(company_id)})
        if not company:
            raise HTTPException(status_code=404, detail="Company not found")

        inventory = company.get("inventory", [])
        total_products = int(len(inventory))

        await self.company_collection.update_one(
            {"_id": ObjectId(company_id)},
            {
                "$set": {
                    "inventoryStats.totalProducts": total_products,
                    "updatedAt": datetime.utcnow()
                }
            }
        )

        return {
            "status": "success",
            "message": f"Total products updated for company {company_id}.",
            "inventoryStats": {
                "totalProducts": total_products
            }
        }

    async def recalc_all_companies_total_products(self) -> dict:
        """
        Recalculate the number of products for all companies.

        This is intended for a background routine (scheduler).
        """
        updated = 0
        errors = 0

        # Using an async cursor to iterate over all companies
        cursor = self.company_collection.find({}, {"_id": 1, "inventory": 1})
        async for company in cursor:
            try:
                company_id = str(company["_id"])
                inventory = company.get("inventory", [])
                total_products = int(len(inventory))

                await self.company_collection.update_one(
                    {"_id": company["_id"]},
                    {
                        "$set": {
                            "inventoryStats.totalProducts": total_products,
                            "updatedAt": datetime.utcnow()
                        }
                    }
                )
                updated += 1
            except Exception:
                # Do not fail the whole batch; count and continue
                errors += 1
                continue

        return {
            "status": "success",
            "updatedCompanies": updated,
            "errors": errors
        }
