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
from ..utils.sales_metrics import (
    get_date_ranges,
    calculate_daily_metrics,
    calculate_sales_totals,
    calculate_ticket_metrics,
    calculate_sales_counts
)


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
            Retrieve a summarized sales overview for a given company.

            This endpoint aggregates sales data to provide daily totals and comparisons,
            weekly sales count, total sales count, and average ticket metrics. If the
            company has no registered sales, all values are returned as zero.

            Args:
                company_id (str): The ID of the company to retrieve sales data for.

            Returns:
                dict: A structured overview containing:
                    - today.total: Total sales for today.
                    - today.comparison: Percentage change compared to yesterday.
                    - sales.total: Total number of sales.
                    - sales.week: Number of sales in the current week.
                    - ticket.average: Average ticket value for the current month.
                    - ticket.comparison: Comparison with last month's average ticket.

            Raises:
                HTTPException: If the company does not exist (404).
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
        dates = get_date_ranges()

        # Metrics
        daily = calculate_daily_metrics(
            sales,
            dates["today_start"],
            dates["yesterday_start"]
        )
        tickets = calculate_ticket_metrics(
            sales,
            dates["month_start"],
            dates["last_month_start"],
            dates["last_month_end"]
        )
        sales_counts = calculate_sales_counts(
            sales,
            dates["week_start"]
        )

        return {
                "today": {
                    "total": daily["today_total"],
                    "comparison": daily["comparison"]
                },
                "sales": {
                    "total": sales_counts["totalCount"],
                    "week": sales_counts["weekCount"],
                },
                "ticket": {
                    "average": tickets["average"],
                    "comparison": tickets["comparison"]
                }
        }

