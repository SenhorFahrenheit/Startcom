from datetime import datetime
from bson import ObjectId
from fastapi import HTTPException, status
from pymongo.errors import PyMongoError
from ..schemas.sale_schemas import SaleCreate, SaleInDB
from ..schemas.client_schemas import ClientCreate  
from ..services.client_services import ClientService
from ..services.inventory_services import InventoryService
import re
from ..utils.helper_functions import serialize_mongo
import math
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)


class SaleService:
    """
    Handles all sale-related business logic and DB operations.
    """

    def __init__(self, db_client):
        self.db = db_client
        self.company_collection = self.db.get_collection("company")
        self.client_service = ClientService(db_client) 
        self.inventory_service = InventoryService(db_client)

    # dont forget to decrement inventory
    async def create_sale(self, sale_data: SaleCreate, company_id: str) -> dict:
        """
        Create and register a sale in the corresponding company.

        Args:
            sale_data (SaleCreate): Sale payload containing client and items.
            company_id (str): MongoDB ObjectId of the company performing the sale.

        Returns:
            dict: The created sale document (serialized for JSON).

        Raises:
            HTTPException(404): If the company or product is not found.
            HTTPException(400): If stock is insufficient.
            HTTPException(500): On database or unexpected errors.
        """
        try:
            # Step 1: Validate company existence
            company = await self.company_collection.find_one({"_id": ObjectId(company_id)})
            if not company:
                raise HTTPException(status_code=404, detail="Company not found")

            logger.info(f"Creating sale for company {company_id}")

            # Step 2: Find or create client
            client = await self.client_service.get_client_by_name(company_id, sale_data.clientName)
            if not client:
                logger.info(f"Client '{sale_data.clientName}' not found — creating new one.")
                client_data = ClientCreate(
                    name=sale_data.clientName,
                    email=None,
                    phone=None,
                    city=None
                )
                new_client = await self.client_service.create_client(company_id, client_data)
                client_id = ObjectId(str(new_client.id))
            else:
                client_id = client["_id"]

            # Step 3: Resolve product IDs + validate stock
            sale_items = []
            inventory_updates = []
            for item in sale_data.items:
                product = await self.inventory_service.get_product_by_name(company_id, item.productName)
                product_id = product["_id"]
                current_qty = int(product.get("quantity", 0))

                if current_qty < item.quantity:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Insufficient stock for product '{item.productName}'. Available: {current_qty}, Requested: {item.quantity}"
                    )

                # Prepare sale item
                sale_items.append({
                    "productId": product_id,
                    "quantity": item.quantity,
                    "price": item.price
                })

                # Prepare inventory decrement operation
                inventory_updates.append({
                    "filter": {"_id": ObjectId(company_id), "inventory._id": product_id},
                    "update": {"$inc": {"inventory.$.quantity": -item.quantity}}
                })

            # Step 4: Calculate total
            total = round(sum(i["price"] * i["quantity"] for i in sale_items), 2)
            sale_doc = {
                "_id": ObjectId(),
                "clientId": client_id,
                "items": sale_items,
                "total": total,
                "date": datetime.utcnow(),
            }

            # Step 5: Save sale in company
            result = await self.company_collection.update_one(
                {"_id": ObjectId(company_id)},
                {
                    "$push": {"sales": sale_doc},
                    "$set": {"updatedAt": datetime.utcnow()},
                },
            )

            if result.modified_count == 0:
                raise HTTPException(status_code=500, detail="Failed to register sale")

            # Step 6: Decrement stock for each sold product
            for op in inventory_updates:
                await self.company_collection.update_one(op["filter"], op["update"])

            logger.info(f"Sale created successfully for company {company_id} — Total: R${total}")
            return {"status": "success", "sale": serialize_mongo(sale_doc)}

        except PyMongoError as e:
            logger.exception("Database error while creating sale")
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

        except HTTPException:
            raise

        except Exception as e:
            logger.exception("Unexpected error while creating sale")
            raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

    

    async def get_all_sales(self, company_id: str):
        """
    Retrieve all sales for a given company, returning enriched and serialized data.

    **Description:**
    Fetches all company sales, resolving:
    - `clientId` → client name  
    - `productId` → product name  
    - Formats totals and dates for frontend readability.

    **Args:**
        company_id (str): The ObjectId of the company as a string.

    **Returns:**
        list[dict]: Each sale with resolved client/product names and numeric totals.
        Example:
        ```json
        [
          {
            "_id": "672aaf29cf845a764b3f118a",
            "clientName": "João Silva",
            "items": [
              {"productName": "Notebook Gamer", "quantity": 1, "price": 4500.0}
            ],
            "total": 4500.0,
            "date": "2025-01-12T14:32:00Z"
          }
        ]
        ```

    **Raises:**
        HTTPException(404): Company not found.
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

        # Serialize possible ObjectIds/dates
        return serialize_mongo(result)
    
    async def get_sales_overview(self, company_id: str):
        """
    Generate analytical sales metrics for a company.

    Calculates and returns:
    - Total sold today and comparison with yesterday (%)
    - Total sales overall and in the last 7 days
    - Average ticket value and monthly variation (%)

    Args:
        company_id (str): The ObjectId of the company as a string.

    Returns:
        dict: Structured analytics overview, e.g.:
        ```json
        {
          "overview": {
            "today": {"total": 1200.0, "comparison": 15.6},
            "sales": {"total": 18900.0, "week": 5600.0},
            "ticket": {"average": 315.0, "comparison": -5.2}
          }
        }
        ```

    Raises:
        HTTPException(404): If the company is not found.
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

        # Metrics
        today_total = round(today_total, 2)
        week_total = round(week_total, 2)
        total_sales = round(total_sales, 2)

        # Daily comparison %
        if yesterday_total == 0:
            daily_comparison = 0.0
        else:
            daily_comparison = round(((today_total - yesterday_total) / yesterday_total) * 100, 2)

        # Current average ticket price and average ticket price last month
        avg_ticket = round(total_sales / len(sales), 2) if sales else 0
        avg_ticket_this_month = round(sum(this_month_ticket_values) / len(this_month_ticket_values), 2) if this_month_ticket_values else 0
        avg_ticket_last_month = round(sum(last_month_ticket_values) / len(last_month_ticket_values), 2) if last_month_ticket_values else 0

        # Comparison of average monthly ticket price
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

