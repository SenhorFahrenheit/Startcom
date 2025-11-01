from bson import ObjectId
from datetime import datetime
from fastapi import HTTPException, status
from ..schemas.client_schemas import ClientCreate, ClientInDB
from ..utils.helper_functions import serialize_mongo  # ou conforme o caminho certo


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
    async def get_client_by_email(self, company_id: str, client_email: str):
        """
        Searches for a client by email inside a specific company's embedded 'clients' array.
        Returns the client if found.
        """
        if not client_email:
            return None  # Email might be optional in some cases

        company = await self.company_collection.find_one(
            {
                "_id": ObjectId(company_id),
                "clients.email": client_email
            },
            {"clients.$": 1}
        )

        if company and "clients" in company and len(company["clients"]) > 0:
            return company["clients"][0]
        return None
    
    async def create_client(self, company_id: str, client_data: ClientCreate) -> ClientInDB:
        """
        Adds a new client inside the specified company's embedded 'clients' array.
        Returns the created client document.
        """
        new_client = {
            "_id": ObjectId(),  
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
    
    async def get_clients_overview_full(self, company_id: str):
        """
        Retrieves an overview of all clients for a given company, including:
        - Total number of clients
        - Total VIP clients
        - Clients added this month
        - Company's average satisfaction score

        Also returns the list of all clients, excluding 'createdAt' and 'updatedAt'.
        """
        # Find the company document by ID
        company = await self.company_collection.find_one({"_id": ObjectId(company_id)})
        if not company:
            raise HTTPException(status_code=404, detail="Company not found")

        # Extract client data and satisfaction metric
        clients = company.get("clients", [])
        avg_satisfaction = company.get("average_satisfaction", 0)

        # Overview metrics
        total_clients = len(clients)
        vip_clients = len([c for c in clients if c.get("category") == "VIP"])

        now = datetime.utcnow()
        new_clients = [
            c for c in clients
            if c.get("createdAt")
            and isinstance(c["createdAt"], datetime)
            and c["createdAt"].month == now.month
            and c["createdAt"].year == now.year
        ]
        total_new_clients = len(new_clients)

        # Clean clients (remove unneeded fields)
        cleaned_clients = []
        for c in clients:
            cleaned_clients.append({
                "id": str(c.get("_id")),
                "name": c.get("name"),
                "email": c.get("email"),
                "phone": c.get("phone"),
                "address": c.get("address"),
                "category": c.get("category", "regular"),
            })

        # Return structured response
        return {
            "status": "success",
            "overview": {
                "clients": {
                    "total": total_clients,
                    "vip": vip_clients,
                    "newThisMonth": total_new_clients,
                    "averageSatisfaction": round(avg_satisfaction, 2)
                }
            },
            "clients": serialize_mongo(cleaned_clients)
        }