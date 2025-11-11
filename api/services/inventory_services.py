from bson import ObjectId
from fastapi import HTTPException
from ..utils.helper_functions import serialize_mongo
from ..utils.helper_functions import serialize_doc
from datetime import datetime
from fastapi import status
from ..schemas.inventory_schemas import InventoryItemInDB, InventoryCreate

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
    
    async def get_inventory_overview(self, company_id: str):
        company = await self.company_collection.find_one({"_id": ObjectId(company_id)})

        if not company:
            raise HTTPException(status_code=404, detail="Company not found")

        inventory = company.get("inventory", [])
        stats = company.get("inventoryStats", {})

        formatted_products = []
        for p in inventory:
            name = p.get("name")
            category = p.get("category", "Outros") or "Outros"
            quantity = int(p.get("quantity", 0))
            min_quantity = int(p.get("minQuantity", 0))
            unit_price = float(p.get("price", 0))

            if quantity == 0:
                status = "Esgotado"
            elif quantity <= min_quantity:
                status = "Crítico"
            elif quantity <= (min_quantity + 10):
                status = "Baixo"
            else:
                status = "Normal"


            total_value = round(quantity * unit_price, 2)

            formatted_products.append({
                "name": name,
                "category": category,
                "quantity": quantity,
                "minQuantity": min_quantity,
                "unitPrice": unit_price,
                "status": status,
                "totalValue": total_value,
            })

        return {
            "totalProducts": stats.get("totalProducts", len(inventory)),
            "lowInventory": stats.get("lowInventory", 0),
            "criticalInventory": stats.get("criticalInventory", 0),
            "totalValue": stats.get("totalValue", 0.0),
            "products": formatted_products
        }
    
    async def create_product(self, company_id: str, product_data: InventoryCreate) -> InventoryItemInDB:
        """
        Inserts a new product into company's inventory.
        Rejects duplicate product names in same company.
        """
        company = await self.company_collection.find_one({"_id": ObjectId(company_id)})
        if not company:
            raise HTTPException(status_code=404, detail="Company not found")

        # Check duplicate product name
        existing = next((p for p in company.get("inventory", []) if p.get("name") == product_data.name), None)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Product '{product_data.name}' already exists in this company."
            )

        new_product = InventoryItemInDB(**product_data.dict())

        result = await self.company_collection.update_one(
            {"_id": ObjectId(company_id)},
            {
                "$push": {"inventory": new_product.dict(by_alias=True)},
                "$set": {"updatedAt": datetime.utcnow()}
            }
        )

        if result.modified_count == 0:
            raise HTTPException(status_code=500, detail="Failed to add product to inventory.")

        return new_product