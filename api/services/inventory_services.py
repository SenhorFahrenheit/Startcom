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
