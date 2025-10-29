from datetime import datetime
from bson import ObjectId
from fastapi import HTTPException, status
from pymongo.errors import PyMongoError
from ..schemas.sale_schemas import SaleCreate, SaleInDB
from ..schemas.client_schemas import ClientCreate  # ✅ import schema
from ..services.client_services import ClientService  # ✅ import service


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
