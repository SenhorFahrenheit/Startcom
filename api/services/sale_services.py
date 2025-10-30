from datetime import datetime
from bson import ObjectId
from fastapi import HTTPException, status
from pymongo.errors import PyMongoError
from ..schemas.sale_schemas import SaleCreate, SaleInDB
from ..schemas.client_schemas import ClientCreate  
from ..services.client_services import ClientService  
import re
from ..utils.helper_functions import serialize_mongo
import math
from datetime import timedelta

class SaleService:
    """
    Handles all sale-related business logic and DB operations.
    """

    def __init__(self, db_client):
        self.db = db_client
        self.company_collection = self.db.get_collection("company")
        self.client_service = ClientService(db_client) 

    # dont forget to decrement inventory
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

            # Step 1: Find or create client inside company
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
            total = round(sum(item.price * item.quantity for item in sale_data.items), 2)

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

    async def get_all_sales(self, company_id: str):
        """
        Retrieves all sales for a specific company.
        Returns sales enriched with client and product names,
        removing unnecessary internal IDs.
        """
        company = await self.company_collection.find_one({"_id": ObjectId(company_id)})
        if not company:
            raise HTTPException(status_code=404, detail="Company not found")

        sales = company.get("sales", [])
        clients = {str(c["_id"]): c for c in company.get("clients", [])}
        inventory = {str(p["_id"]): p for p in company.get("inventory", [])}

        result = []

        for sale in sales:
            # 🔹 Resolve client name
            client = clients.get(str(sale.get("clientId")))
            client_name = client["name"] if client else "Unknown Client"

            # 🔹 Resolve product names for each item
            item_list = []
            for item in sale.get("items", []):
                product = inventory.get(str(item.get("productId")))
                product_name = product["name"] if product else "Unknown Product"
                item_list.append({
                    "productName": product_name,
                    "quantity": item["quantity"],
                    "price": item["price"]
                })

            result.append({
                "_id": str(sale["_id"]),
                "clientName": client_name,
                "items": item_list,
                "total": round(float(sale["total"]), 2),
                "date": sale["date"]
            })

        # ✅ Serialize possible ObjectIds/dates
        return serialize_mongo(result)
    
    async def get_sales_overview(self, company_id: str):
        """
        Generates sales insights and performance overview for a company.
        Includes daily, weekly, and average ticket analytics.
        """
        company = await self.company_collection.find_one({"_id": ObjectId(company_id)})
        if not company:
            raise HTTPException(status_code=404, detail="Company not found")

        sales = company.get("sales", [])
        if not sales:
            return {
                "todayTotal": 0.0,
                "yesterdayComparison": 0.0,
                "totalSales": 0.0,
                "weekSales": 0.0,
                "averageTicket": 0.0,
                "averageTicketComparison": 0.0,
            }

        # Dates
        now = datetime.utcnow()
        today_start = datetime(now.year, now.month, now.day)
        yesterday_start = today_start - timedelta(days=1)
        week_start = today_start - timedelta(days=7)
        month_start = datetime(now.year, now.month, 1)
        last_month_end = month_start - timedelta(days=1)
        last_month_start = datetime(last_month_end.year, last_month_end.month, 1)

        # Helper vars
        today_total = 0
        yesterday_total = 0
        week_total = 0
        total_sales = 0
        today_count = 0
        last_month_ticket_values = []
        this_month_ticket_values = []

        # Iterate over all sales
        for sale in sales:
            sale_date = sale.get("date")
            total_value = float(sale.get("total", 0))
            total_sales += total_value

            if sale_date >= week_start:
                week_total += total_value

            if sale_date >= today_start:
                today_total += total_value
                today_count += 1
            elif yesterday_start <= sale_date < today_start:
                yesterday_total += total_value

            # Tickets médios (mês atual e anterior)
            if sale_date >= month_start:
                this_month_ticket_values.append(total_value)
            elif last_month_start <= sale_date < last_month_end:
                last_month_ticket_values.append(total_value)

        # ✅ Cálculos de métricas
        today_total = round(today_total, 2)
        week_total = round(week_total, 2)
        total_sales = round(total_sales, 2)

        # Comparação diária (%)
        if yesterday_total == 0:
            daily_comparison = 0.0
        else:
            daily_comparison = round(((today_total - yesterday_total) / yesterday_total) * 100, 2)

        # Ticket médio atual e do mês passado
        avg_ticket = round(total_sales / len(sales), 2) if sales else 0
        avg_ticket_this_month = round(sum(this_month_ticket_values) / len(this_month_ticket_values), 2) if this_month_ticket_values else 0
        avg_ticket_last_month = round(sum(last_month_ticket_values) / len(last_month_ticket_values), 2) if last_month_ticket_values else 0

        # Comparação de ticket médio mensal
        if avg_ticket_last_month == 0:
            ticket_comparison = 0.0
        else:
            ticket_comparison = round(((avg_ticket_this_month - avg_ticket_last_month) / avg_ticket_last_month) * 100, 2)

        return {
            "overview": {
                "today": {
                    "total": today_total,
                    "comparison": daily_comparison
                },
                "sales": {
                    "total": total_sales,
                    "week": week_total
                },
                "ticket": {
                    "average": avg_ticket,
                    "comparison": ticket_comparison
                }
            }
        }

