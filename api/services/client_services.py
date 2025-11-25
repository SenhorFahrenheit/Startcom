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
            # "address": getattr(client_data, "address", ""),
            "address": client_data.city or "",
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

        Also returns the list of all clients, including:
        - Name, email, phone, address, category
        - Total spent
        - Last purchase
        """
        # Find the company document by ID
        company = await self.company_collection.find_one({"_id": ObjectId(company_id)})
        if not company:
            raise HTTPException(status_code=404, detail="Company not found")

        # Extract data
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

        # Build cleaned list with last purchase + total spent
        cleaned_clients = []
        for c in clients:
            client_id = c.get("_id")
            # Get total spent and last purchase using new methods
            total_spent = await self.get_client_total_spent(company, client_id)
            last_purchase = await self.get_client_last_purchase(company, client_id)

            cleaned_clients.append({
                "id": str(client_id),
                "name": c.get("name"),
                "email": c.get("email"),
                "phone": c.get("phone"),
                # o certo é address
                "address": c.get("address"),
                "category": c.get("category", "regular"),
                "totalSpent": total_spent,
                "lastPurchase": last_purchase["date"] if last_purchase else None,
            })

        # Return structured response
        return {
                    "total": total_clients,
                    "vip": vip_clients,
                    "newThisMonth": total_new_clients,
                    "averageSatisfaction": round(avg_satisfaction, 2),
                    "clients": serialize_mongo(cleaned_clients)
                }
    
    async def get_all_client_names(self, company_id: str):
        """
        Retrieves all client names for a given company.
        Returns a list of strings with client names only.
        """
        # Find the company
        company = await self.company_collection.find_one({"_id": ObjectId(company_id)})
        if not company:
            raise HTTPException(status_code=404, detail="Company not found")

        # Extract client names
        clients = company.get("clients", [])
        client_names = [c.get("name") for c in clients if "name" in c]

        return {
            "status": "success",
            "clients": client_names
        }
    
    async def get_client_last_purchase(self, company: dict, client_id: ObjectId):
        """
        Returns the last (most recent) purchase made by the given client
        within the company's embedded 'sales' array.

        Returns:
        {
            "date": "YYYY-MM-DD",
            "total": float
        }
        or None if no sales found.
        """
        sales = company.get("sales", [])
        # Filter only this client's sales
        client_sales = [s for s in sales if s.get("clientId") == client_id]

        if not client_sales:
            return None

        # Find the latest sale by date
        last_sale = max(client_sales, key=lambda s: s.get("date", datetime.min))

        last_date = last_sale.get("date")
        formatted_date = None
        if isinstance(last_date, datetime):
            # Keep only the date portion (YYYY-MM-DD)
            formatted_date = last_date.strftime("%Y-%m-%d")

        return {
            "date": formatted_date,
            "total": round(float(last_sale.get("total", 0)), 2)
        }
    
    async def get_client_total_spent(self, company: dict, client_id: ObjectId) -> float:
        """
        Calculates the total amount of money spent by a specific client
        across all their sales within the given company.
        """
        sales = company.get("sales", [])
        total = sum(float(s.get("total", 0)) for s in sales if s.get("clientId") == client_id)
        return round(total, 2)

    async def update_client(self, company_id: str, client_id: str, body) -> None:
        """
        Update a client inside the company's embedded 'clients' array.
        The update is based on company_id and client_id and the fields provided in body.
        IMPORTANT: category must not be changed/updated here.
        """
        # Validate ObjectIds
        if not ObjectId.is_valid(client_id):
            raise HTTPException(status_code=400, detail="Invalid client_id format.")
        if not ObjectId.is_valid(company_id):
            raise HTTPException(status_code=400, detail="Invalid company_id format.")
        
        # Prepare set operations for provided fields (ignore None)
        set_ops = {}
        if getattr(body, "name", None) is not None:
            set_ops["clients.$[elem].name"] = body.name
        if getattr(body, "email", None) is not None:
            set_ops["clients.$[elem].email"] = body.email
        if getattr(body, "phone", None) is not None:
            set_ops["clients.$[elem].phone"] = body.phone
        if getattr(body, "address", None) is not None:
            set_ops["clients.$[elem].address"] = body.address

        # Always update company's updatedAt
        set_ops["updatedAt"] = datetime.utcnow()

        # If no client-updatable fields provided, still touch updatedAt in company
        if len(set_ops) == 1 and "updatedAt" in set_ops:
            result = await self.company_collection.update_one(
                {"_id": ObjectId(company_id), "clients._id": ObjectId(client_id)},
                {"$set": {"updatedAt": set_ops["updatedAt"]}}
            )
            if result.modified_count == 0:
                raise HTTPException(status_code=500, detail="Failed to update client.")
            return

        # Perform array update with arrayFilters to target the specific client
        result = await self.company_collection.update_one(
            {"_id": ObjectId(company_id)},
            {"$set": set_ops},
            array_filters=[{"elem._id": ObjectId(client_id)}]
        )

        if result.modified_count == 0:
            raise HTTPException(status_code=500, detail="Failed to update client.")

    async def get_client_by_id(self, company_id: str, client_id: str):
        """
        Searches for a client by ID inside a specific company's embedded 'clients' array.
        Returns the client if found, None otherwise.
        """
        try:
            # Validate if client_id is a valid ObjectId
            if not ObjectId.is_valid(client_id):
                return None
                
            company = await self.company_collection.find_one(
                {
                    "_id": ObjectId(company_id),
                    "clients._id": ObjectId(client_id)
                },
                {"clients.$": 1}
            )

            if company and "clients" in company and len(company["clients"]) > 0:
                return company["clients"][0]
            return None
        except Exception:
            return None