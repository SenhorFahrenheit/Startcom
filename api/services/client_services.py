from bson import ObjectId
from datetime import datetime
from fastapi import HTTPException, status
from ..schemas.client_schemas import ClientCreate, ClientInDB


class ClientService:
    """
    Handles all client-related operations inside the company's subdocument array.
    """

    def __init__(self, db_client):
        self.db = db_client
        self.company_collection = self.db.get_collection("company")

    async def get_client_by_name(self, company_id: str, client_name: str):
        """
        Searches for a client by name inside a specific company's embedded 'clients' array.
        """
        company = await self.company_collection.find_one(
            {
                "_id": ObjectId(company_id),
                "clients.name": client_name
            },
            {"clients.$": 1}
        )

        # Return the single matched client (if found)
        if company and "clients" in company and len(company["clients"]) > 0:
            return company["clients"][0]
        return None

    async def create_client(self, company_id: str, client_data: ClientCreate) -> ClientInDB:
        """
        Adds a new client inside the specified company's embedded 'clients' array.
        Returns the created client document.
        """
        new_client = {
            "_id": ObjectId(),  # ✅ generate a new unique ObjectId
            "name": client_data.name,
            "email": client_data.email or "",
            "phone": client_data.phone or "",
            "address": getattr(client_data, "address", ""),
            "createdAt": datetime.utcnow()
        }

        result = await self.company_collection.update_one(
            {"_id": ObjectId(company_id)},
            {
                "$push": {"clients": new_client},
                "$set": {"updatedAt": datetime.utcnow()}
            }
        )

        if result.modified_count == 0:
            raise HTTPException(status_code=500, detail="Failed to add client to company.")

        return ClientInDB(**new_client)
