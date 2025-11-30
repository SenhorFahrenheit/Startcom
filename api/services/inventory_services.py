from fastapi import HTTPException, status
from bson import ObjectId, errors as bson_errors
from ..utils.helper_functions import serialize_mongo
from ..utils.helper_functions import serialize_doc
from datetime import datetime
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
        """
    Generate a summarized overview of a company's inventory.

    Retrieves product data and aggregate statistics from `inventoryStats`, 
    including total products, low and critical stock counts, and total 
    invested value based on cost price.

    Each product includes its name, category, quantity, minimum quantity, 
    unit price, stock status ("Normal", "Baixo", "Crítico", "Esgotado") 
    and total value (quantity × costPrice). Now also includes productId.
    """
        company = await self.company_collection.find_one({"_id": ObjectId(company_id)})

        if not company:
            raise HTTPException(status_code=404, detail="Company not found")

        inventory = company.get("inventory", [])
        stats = company.get("inventoryStats", {})

        formatted_products = []
        for p in inventory:
            id = p.get("_id")
            name = p.get("name")
            category = p.get("category", "Outros") or "Outros"
            quantity = int(p.get("quantity", 0))
            min_quantity = int(p.get("minQuantity", 0))
            unit_price = float(p.get("price", 0))
            cost_price = float(p.get("costPrice", 0))

            if quantity == 0:
                status = "Esgotado"
            elif quantity <= min_quantity:
                status = "Crítico"
            elif quantity <= (min_quantity + 10):
                status = "Baixo"
            else:
                status = "Normal"


            total_value = round(quantity * cost_price, 2)

            formatted_products.append({
                "productId": id.__str__(),
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
    
    async def increase_product_inventory(self, company_id: str, product_name: str, increment: int):
        """
        Increase the quantity of a product in the company's inventory.

        Steps:
        - Find company
        - Search for product inside embedded inventory array
        - Increase its quantity by the given 'increment'
        - Update the document atomically
        - Return the updated product

        Raises:
            404 - Company not found
            404 - Product not found
        """

        # 1. Check company
        company = await self.company_collection.find_one(
            {"_id": ObjectId(company_id)},
            {"inventory": 1}
        )
        if not company:
            raise HTTPException(status_code=404, detail="Company not found")

        # 2. Find product inside array
        product = next(
            (p for p in company.get("inventory", []) if p["name"].lower() == product_name.lower()),
            None
        )
        if not product:
            raise HTTPException(status_code=404, detail=f"Product '{product_name}' not found")

        new_quantity = int(product.get("quantity", 0)) + int(increment)

        # 3. Update using positional operator
        result = await self.company_collection.update_one(
            {
                "_id": ObjectId(company_id),
                "inventory._id": product["_id"]
            },
            {
                "$set": {
                    "inventory.$.quantity": new_quantity,
                    "updatedAt": datetime.utcnow()
                }
            }
        )

        if result.modified_count == 0:
            raise HTTPException(status_code=500, detail="Failed to update product inventory")

    
        return
    
    async def delete_product(self, company_id: str, product_id: str):
        """
        Delete a product from the company's inventory subarray by its id.

        Steps:
        - Validate product id
        - Ensure company exists
        - Pull the inventory item with matching _id from the company's inventory array
        - Update company's updatedAt timestamp

        Raises:
            400 - Invalid product id
            404 - Company not found
            404 - Product not found
            500 - Unexpected errors
        """
        try:
            oid = ObjectId(product_id)
        except (bson_errors.InvalidId, TypeError):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid product id")

        # Ensure company exists
        company = await self.company_collection.find_one({"_id": ObjectId(company_id)}, {"inventory": 1})
        if not company:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")

        try:
            # Only match the company document if it contains the inventory item with the given _id.
            result = await self.company_collection.update_one(
                {"_id": ObjectId(company_id), "inventory._id": oid},
                {
                    "$pull": {"inventory": {"_id": oid}},
                    "$set": {"updatedAt": datetime.utcnow()}
                }
            )

             # If no document matched the filter, the product wasn't found in the array
            if result.matched_count == 0:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

            return None
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


