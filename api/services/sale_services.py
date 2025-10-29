from datetime import datetime
from bson import ObjectId
from fastapi import HTTPException, status
from pymongo.errors import PyMongoError
from ..schemas.sale_schemas import SaleCreate, SaleInDB
from ..schemas.client_schemas import ClientCreate  
from ..services.client_services import ClientService  
import re
from ..utils.helper_functions import serialize_mongo


class SaleService:
    """
    Handles all sale-related business logic and DB operations.
    """

    def __init__(self, db_client):
        self.db = db_client
        self.company_collection = self.db.get_collection("company")
        self.client_service = ClientService(db_client)  # ✅ initialize client service

    async def create_sale(self, sale_data: SaleCreate) -> SaleInDB:
        """
        Creates and registers a sale in the corresponding company.
        """
        try:
            company_id = sale_data.companyId

            # Check company exists
            company = await self.company_collection.find_one({"_id": ObjectId(company_id)})
            if not company:
                raise HTTPException(status_code=404, detail="Company not found")

            # ✅ Step 1: Find or create client inside company
            client = await self.client_service.get_client_by_name(company_id, sale_data.clientName)

            if not client:
                # Create client with generic data if not found
                client_data = ClientCreate(
                    name=sale_data.clientName,
                    email=None,
                    phone=None
                )
                new_client = await self.client_service.create_client(company_id, client_data)
                client_id = ObjectId(new_client.id)
            else:
                client_id = client["_id"]

            # ✅ Step 2: Calculate total
            total = sum(item.price * item.quantity for item in sale_data.items)

            sale_doc = {
                "_id": ObjectId(),
                "clientId": client_id,
                "items": [
                    {
                        "productId": ObjectId(i.productId),
                        "quantity": i.quantity,
                        "price": i.price
                    } for i in sale_data.items
                ],
                "total": total,
                "date": datetime.utcnow()
            }

            # ✅ Step 3: Push into company's sales array
            result = await self.company_collection.update_one(
                {"_id": ObjectId(company_id)},
                {
                    "$push": {"sales": sale_doc},
                    "$set": {"updatedAt": datetime.utcnow()}
                }
            )

            if result.modified_count == 0:
                raise HTTPException(status_code=500, detail="Failed to register sale")

            return SaleInDB(**sale_doc)

        except PyMongoError as e:
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

        except HTTPException:
            raise

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
    
    async def search_sales(self, company_id: str, query: str):
        """
        Searches all company sales by a single text query.
        Matches saleId, client name, product name, date, and total (partial and case-insensitive).
        Returns sales enriched with client and product names instead of internal IDs.
        """
        company = await self.company_collection.find_one({"_id": ObjectId(company_id)})
        if not company:
            raise HTTPException(status_code=404, detail="Company not found")

        sales = company.get("sales", [])
        clients = {str(c["_id"]): c for c in company.get("clients", [])}
        inventory = {str(p["_id"]): p for p in company.get("inventory", [])}

        query_pattern = re.compile(re.escape(query), re.IGNORECASE)
        results = []

        for sale in sales:
            # 🔹 Get related client
            client = clients.get(str(sale.get("clientId")))
            client_name = client["name"] if client else "Unknown Client"

            # 🔹 Get related product names
            product_names = []
            item_list = []
            for item in sale["items"]:
                product = inventory.get(str(item["productId"]))
                product_name = product.get("name", "Unknown Product") if product else "Unknown Product"
                product_names.append(product_name)
                item_list.append({
                    "productName": product_name,
                    "quantity": item["quantity"],
                    "price": item["price"]
                })

            # 🔹 Build searchable text
            searchable_text = " ".join([
                str(sale.get("_id", "")),
                client_name,
                " ".join(product_names),
                sale.get("date", datetime.utcnow()).strftime("%Y-%m-%d"),
                str(sale.get("total", ""))
            ])

            # 🔹 Match query in any field
            if query_pattern.search(searchable_text):
                results.append({
                    "_id": str(sale["_id"]),              # keep sale id
                    "clientName": client_name,            # human-readable name
                    "items": item_list,                   # product names instead of IDs
                    "total": sale["total"],
                    "date": sale["date"]
                })

        # ✅ Serialize all ObjectIds and datetimes
        return serialize_mongo(results)
