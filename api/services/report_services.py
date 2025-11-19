from datetime import datetime, timedelta
from bson import ObjectId
from fastapi import HTTPException

# import the exact helpers that exist in your helpers file
from ..utils.sales_metrics import (
    get_date_ranges,
    calculate_revenue_in_period,
    calculate_category_revenue_distribution_period,
    calculate_sales_counts,
    calculate_ticket_metrics,
    calculate_daily_metrics,
    calculate_month_revenue_metrics,
    calculate_sales_totals,
    calculate_monthly_sales_change
)

from typing import List, Dict, Any


def _parse_date_safe(d):
    """Normalize date value to a datetime instance (accepts datetime or ISO string)."""
    if isinstance(d, datetime):
        return d
    if isinstance(d, str):
        try:
            return datetime.fromisoformat(d)
        except Exception:
            try:
                return datetime.strptime(d, "%Y-%m-%d %H:%M:%S")
            except Exception:
                # last fallback: try date only
                try:
                    return datetime.strptime(d, "%Y-%m-%d")
                except Exception:
                    raise ValueError(f"Could not parse date: {d!r}")
    raise TypeError(f"Invalid date type: {type(d)}")


class SalesAnalyticsService:
    def __init__(self, db_client):
        self.db_client = db_client
        self.company_collection = self.db_client.get_collection("company")

    async def get_advanced_sales_overview(self, company_id: str, period: str):
        """
        Orchestrates helpers to produce the dashboard report.

        Uses helpers from `api.services.helpers.analytics`. Period affects:
          - categoryDistribution (filtered by period)
          - salesTotals / evolution (filtered by period)

        Fixed rules:
          - Active customers: customers who bought in the last 3 months
          - New customers: customers created in the current month
        """
        company = await self.company_collection.find_one({"_id": ObjectId(company_id)})
        if not company:
            raise HTTPException(status_code=404, detail="Company not found")

        # Raw data from DB
        raw_sales: List[Dict[str, Any]] = company.get("sales", [])
        inventory: List[Dict[str, Any]] = company.get("inventory", [])
        clients: List[Dict[str, Any]] = company.get("clients", [])

        # 1) Normalize dates in sales and clients so helpers can rely on datetime objects
        sales: List[Dict[str, Any]] = []
        for s in raw_sales:
            s_copy = dict(s)  # shallow copy
            try:
                s_copy["date"] = _parse_date_safe(s.get("date"))
            except Exception:
                # if a sale has an invalid date, skip it
                continue

            # ensure items exist and are well formed
            s_copy["items"] = s.get("items", []) or []
            sales.append(s_copy)

        # normalize client createdAt / last purchase fields (support multiple key variants)
        normalized_clients = []
        for c in clients:
            c_copy = dict(c)
            # try common keys present in different parts of the codebase
            if "createdAt" in c:
                try:
                    c_copy["createdAt"] = _parse_date_safe(c["createdAt"])
                except Exception:
                    c_copy["createdAt"] = None
            elif "created_at" in c:
                try:
                    c_copy["createdAt"] = _parse_date_safe(c["created_at"])
                except Exception:
                    c_copy["createdAt"] = None
            else:
                c_copy["createdAt"] = None

            # last purchase might be tracked differently; try 'last_purchase' or compute from sales later
            if "last_purchase" in c:
                try:
                    c_copy["last_purchase"] = _parse_date_safe(c["last_purchase"])
                except Exception:
                    c_copy["last_purchase"] = None
            else:
                c_copy["last_purchase"] = None

            normalized_clients.append(c_copy)

        # Dates ranges for helpers that need them
        dates = get_date_ranges()

        # -----------------------------
        # CATEGORY DISTRIBUTION (period-aware)
        # -----------------------------
        # The helper expects full sales list and inventory; it filters internally by 'period'
        category_distribution = calculate_category_revenue_distribution_period(
            sales=sales,
            inventory=inventory,
            period=period
        )

        # -----------------------------
        # SALES EVOLUTION / TOTALS (period-aware)
        # -----------------------------
        sales_totals = calculate_revenue_in_period(sales=sales, period=period)

        # -----------------------------
        # DAILY / TICKET / MONTH METRICS (reuse existing helpers where applicable)
        # -----------------------------
        daily_metrics = calculate_daily_metrics(sales, dates["today_start"], dates["yesterday_start"])
        ticket_metrics = calculate_ticket_metrics(sales, dates["month_start"], dates["last_month_start"], dates["last_month_end"])
        month_revenue = calculate_month_revenue_metrics(sales, dates["month_start"], dates["last_month_start"], dates["last_month_end"])
        sales_month_change = calculate_monthly_sales_change(
            sales,
            dates["month_start"],
            dates["last_month_start"]
        )
        sales_counts = calculate_sales_counts(sales, dates["week_start"])
        # calculate_sales_totals exists too (total, week)
        totals = calculate_sales_totals(sales, dates["week_start"])

        # -----------------------------
        # ACTIVE CUSTOMERS (fixed: last 3 months)
        # -----------------------------
        three_months_ago = datetime.utcnow() - timedelta(days=90)
        # use sales to determine which clientIds bought in last 3 months
        active_client_ids = {
            str(sale.get("clientId")) for sale in sales if sale.get("clientId") and sale["date"] >= three_months_ago
        }
        active_customers_count = sum(1 for c in normalized_clients if str(c.get("_id")) in active_client_ids)

        # -----------------------------
        # NEW CUSTOMERS (fixed: current month)
        # -----------------------------
        month_start = dates["month_start"]
        new_customers_count = sum(1 for c in normalized_clients if c.get("createdAt") and c["createdAt"] >= month_start)

        # -----------------------------
        # FINAL RESPONSE (structure ready for frontend)
        # -----------------------------
        response = {
            "period": period,
            "overview": {
                "monthRevenue": {
                    "total": month_revenue["total"],
                    "comparison": month_revenue["comparison"],
                },
                "sales": {
                    "total": sales_counts["totalCount"],
                    "monthComparison": sales_month_change["percentageChange"]
                },
                "newCustomers": new_customers_count,
                "activeCustomers": active_customers_count,
                "ticket": {
                    "average": ticket_metrics["average"],
                    "comparison": ticket_metrics["comparison"],
                },
                
                "categoryDistribution": category_distribution,  # percentages
                "salesTotals": sales_totals,  # per day or per month depending on period
            },
            
        }

        return response
