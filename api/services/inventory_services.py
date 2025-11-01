from bson import ObjectId
from fastapi import HTTPException
from ..utils.helper_functions import serialize_mongo

class InventoryService:
    """
    Handles inventory-related operations inside a company's subdocument array.
    """

    def __init__(self, db_client):
        self.db = db_client
        self.company_collection = self.db.get_collection("company")

    async def get_inventory_full(self, company_id: str):
        """
        Retrieves all products (except 'createdAt') from the company's 'inventory' array.

        Returns:
        {
            "status": "success",
            "products": [
                {
                    "_id": "69019f25b407b09e0d09d000",
                    "name": "Notebook Gamer",
                    "description": "Notebook Gamer description",
                    "price": 4500,
                    "quantity": 45
                },
                ...
            ]
        }
        """
        # Find the company
        company = await self.company_collection.find_one({"_id": ObjectId(company_id)})
        if not company:
            raise HTTPException(status_code=404, detail="Company not found")

        inventory = company.get("inventory", [])
        if not inventory:
            return {"status": "success", "products": []}

        # Exclude createdAt
        cleaned_inventory = []
        for item in inventory:
            cleaned_inventory.append({
                "_id": str(item.get("_id")),
                "name": item.get("name"),
                "description": item.get("description"),
                "price": item.get("price"),
                "quantity": item.get("quantity")
            })

        return {
            "status": "success",
            "products": serialize_mongo(cleaned_inventory)
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