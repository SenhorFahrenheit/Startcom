from bson import ObjectId
from fastapi import HTTPException


class InventoryService:
    """
    Handles inventory-related operations inside a company's subdocument array.
    """

    def __init__(self, db_client):
        self.db = db_client
        self.company_collection = self.db.get_collection("company")

    async def get_inventory_names(self, company_id: str):
        """
        Retrieves the names of all products within the company's 'inventory' array.
        Returns only the product names as a list of strings.
        """
        company = await self.company_collection.find_one(
            {"_id": ObjectId(company_id)},
            {"inventory.name": 1, "_id": 0}
        )

        if not company:
            raise HTTPException(status_code=404, detail="Company not found")

        inventory = company.get("inventory", [])
        product_names = [item.get("name") for item in inventory if "name" in item]

        return {
            "status": "success",
            "products": product_names
        }
    async def get_product_by_name(self, company_id: str, product_name: str):
        """
        Retrieves a product document from a company's 'inventory' array by its name.
        Returns the full product document, or raises 404 if not found.
        """
        company = await self.company_collection.find_one(
            {"_id": ObjectId(company_id), "inventory.name": product_name},
            {"inventory.$": 1}
        )

        if not company or "inventory" not in company or not company["inventory"]:
            raise HTTPException(
                status_code=404,
                detail=f"Product '{product_name}' not found in company inventory."
            )

        return company["inventory"][0]