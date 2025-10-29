from datetime import datetime, timedelta
from bson import ObjectId
from ..infra.database import mongo


class ClientCategoryService:
    """
    Service responsible for automatically updating client categories
    (regular, premium, VIP) based on total spending and purchase frequency.
    """

    def __init__(self):
        # Access the 'company' collection from the MongoDB database
        self.company_collection = mongo.get_collection("company")

    async def update_all_clients(self):
        """
        Iterate through all companies in the database and update
        the category of every client according to their purchase behavior.
        """
        companies = self.company_collection.find({})
        async for company in companies:
            await self._update_company_clients(company)

    async def _update_company_clients(self, company: dict):
        """
        Calculate the score for each client based on purchases
        and update their categories accordingly.

        Args:
            company (dict): A company document containing clients and sales arrays.
        """
        sales = company.get("sales", [])
        clients = company.get("clients", [])
        now = datetime.utcnow()
        cutoff = now - timedelta(days=90)  # Analyze purchases made in the last 90 days

        # Dictionary to accumulate sales stats for each client
        stats = {}

        for sale in sales:
            sale_date = sale.get("date")
            if not sale_date or sale_date < cutoff:
                # Ignore sales outside the 90-day window
                continue

            client_id = str(sale.get("clientId"))
            total = sale.get("total", 0.0)

            # Initialize stats for a new client
            if client_id not in stats:
                stats[client_id] = {"total_spent": 0.0, "purchases": 0}

            # Aggregate total amount spent and number of purchases
            stats[client_id]["total_spent"] += total
            stats[client_id]["purchases"] += 1

        # Update the category of each client in the company document
        for client in clients:
            client_id = str(client.get("_id"))
            data = stats.get(client_id, {"total_spent": 0, "purchases": 0})

            # Scoring formula that combines total spending and purchase frequency
            score = (data["total_spent"] / 1000) + (data["purchases"] * 0.5)

            # Determine category thresholds
            if score >= 10:
                category = "VIP"
            elif score >= 5:
                category = "premium"
            else:
                category = "regular"

            # Update client's category and timestamp
            client["category"] = category
            client["updatedAt"] = now

        # Save updated client data back to the company document
        await self.company_collection.update_one(
            {"_id": company["_id"]},
            {"$set": {"clients": clients}}
        )

        # Uncomment for debugging/logging
        # print(f"[Service] Updated categories for company: {company.get('name')}")
