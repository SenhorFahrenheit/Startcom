from datetime import datetime
from bson import ObjectId
from fastapi import HTTPException, status
from pymongo.errors import PyMongoError
from ..schemas.sale_schemas import SaleCreate, SaleInDB

class SaleService:
    """
    Handles all sale-related business logic and DB operations.
    """

    def __init__(self, db_client):
        self.db = db_client
        self.company_collection = self.db.get_collection("company")

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

            # Calculate total
            total = sum(item.price * item.quantity for item in sale_data.items)

            sale_doc = {
                "clientId": ObjectId(sale_data.clientId),
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

            # Push into company's sales array
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
