from datetime import datetime, timedelta
from typing import List, Dict


def get_date_ranges():
    """Return commonly used date ranges for sales analytics."""
    now = datetime.utcnow()
    today_start = datetime(now.year, now.month, now.day)
    yesterday_start = today_start - timedelta(days=1)
    week_start = today_start - timedelta(days=7)

    month_start = datetime(now.year, now.month, 1)
    last_month_end = month_start - timedelta(days=1)
    last_month_start = datetime(last_month_end.year, last_month_end.month, 1)

    return {
        "today_start": today_start,
        "yesterday_start": yesterday_start,
        "week_start": week_start,
        "month_start": month_start,
        "last_month_start": last_month_start,
        "last_month_end": last_month_end,
    }


def calculate_daily_metrics(sales: List[Dict], today_start, yesterday_start):
    """Calculate today's total and yesterday comparison (%)."""
    today_total = 0
    yesterday_total = 0

    for s in sales:
        date = s["date"]
        total = float(s.get("total", 0))

        if date >= today_start:
            today_total += total
        elif yesterday_start <= date < today_start:
            yesterday_total += total

    today_total = round(today_total, 2)

    if yesterday_total == 0:
        if today_total == 0:
            comparison = 0.0
        else:
            comparison = 100.0
    else:
        comparison = round(((today_total - yesterday_total) / yesterday_total) * 100, 2)

    return {
        "today_total": today_total,
        "comparison": comparison
    }


def calculate_sales_totals(sales: List[Dict], week_start):
    """Calculate total sales overall and in the last 7 days."""
    total_sales = 0
    week_total = 0

    for s in sales:
        value = float(s.get("total", 0))
        total_sales += value

        if s["date"] >= week_start:
            week_total += value

    return {
        "total": round(total_sales, 2),
        "week": round(week_total, 2)
    }


def calculate_ticket_metrics(sales: List[Dict], month_start, last_month_start, last_month_end):
    """Calculate average ticket and monthly variation (%)."""
    total_sales = sum(float(s.get("total", 0)) for s in sales)
    avg_ticket = round(total_sales / len(sales), 2) if sales else 0

    this_month_values = []
    last_month_values = []

    for s in sales:
        date = s["date"]
        value = float(s.get("total", 0))

        if date >= month_start:
            this_month_values.append(value)
        elif last_month_start <= date < last_month_end:
            last_month_values.append(value)

    avg_this_month = round(sum(this_month_values) / len(this_month_values), 2) if this_month_values else 0
    avg_last_month = round(sum(last_month_values) / len(last_month_values), 2) if last_month_values else 0

    if avg_last_month == 0:
        if avg_this_month == 0:
            comparison = 0.0
        else:
            comparison = 100.0
    else:
        comparison = round(((avg_this_month - avg_last_month) / avg_last_month) * 100, 2)

    return {
        "average": avg_ticket,
        "comparison": comparison
    }

def calculate_sales_counts(sales, week_start):
    """
    Calculate sales counts (not values).

    Returns:
        - total_sales_count: total number of sales
        - weekly_sales_count: number of sales from week_start to now
    """
    total_sales_count = len(sales)
    weekly_sales_count = sum(1 for sale in sales if sale["date"] >= week_start)

    return {
        "totalCount": total_sales_count,
        "weekCount": weekly_sales_count
    }

def calculate_monthly_sales_change(sales, current_month_start, last_month_start):

    current_month_count = sum(
        1 for sale in sales
        if sale["date"] >= current_month_start
    )

    last_month_count = sum(
        1 for sale in sales
        if last_month_start <= sale["date"] < current_month_start
    )

    if last_month_count == 0:
        if current_month_count == 0:
            percentage_change = 0
        else:
            percentage_change = 100 
    else:
        percentage_change = ((current_month_count - last_month_count) / last_month_count) * 100

    return {
        "currentMonthCount": current_month_count,
        "lastMonthCount": last_month_count,
        "percentageChange": percentage_change
    }


def calculate_month_revenue_metrics(sales: List[Dict], month_start, last_month_start, last_month_end):
    """
    Calculate total revenue for the current month and its variation compared to last month (%).
    """

    current_month_total = 0.0
    last_month_total = 0.0

    for s in sales:
        date = s["date"]
        value = float(s.get("total", 0))

        if date >= month_start:
            current_month_total += value
        elif last_month_start <= date < last_month_end:
            last_month_total += value

    current_month_total = round(current_month_total, 2)
    last_month_total = round(last_month_total, 2)

    if last_month_total == 0:
        comparison = 0.0
    else:
        comparison = round(((current_month_total - last_month_total) / last_month_total) * 100, 2)

    return {
        "total": current_month_total,
        "comparison": comparison
    }


from datetime import datetime, timedelta
from typing import List, Dict
import calendar


from datetime import datetime, timedelta
from typing import List, Dict, Any
from bson import ObjectId
import calendar


def _parse_date_safe(d):
    """Return a datetime when d is datetime or ISO string; raise otherwise."""
    if isinstance(d, datetime):
        return d
    if isinstance(d, str):
        # fromisoformat suporta 'YYYY-MM-DDTHH:MM:SS' e variantes
        try:
            return datetime.fromisoformat(d)
        except Exception:
            # tentativa extra: datetimes típicos do mongo str()
            try:
                return datetime.strptime(d, "%Y-%m-%d %H:%M:%S")
            except Exception:
                raise ValueError(f"Could not parse date: {d!r}")
    raise TypeError(f"Invalid date type: {type(d)}")


def calculate_category_revenue_distribution_period(
    sales: List[Dict[str, Any]],
    inventory: List[Dict[str, Any]],
    period: str
) -> Dict[str, float]:
    """
    Calculate revenue percentage by category within a given period.

    Period options:
        - "7d" : last 7 days
        - "30d": last 30 days
        - "6m" : last 6 months
        - "1y" : last 12 months

    Returns a dict:
    {
        "Eletrônicos": 35.2,
        "Roupas": 27.8,
        ...
    }
    """

    now = datetime.utcnow()

    # Determine start date
    if period == "7d":
        start = now - timedelta(days=7)
    elif period == "30d":
        start = now - timedelta(days=30)
    elif period == "6m":
        # retrocede 6 meses com segurança (aproximação por 6 * 30 dias)
        # Se preferir contar mês a mês exato, a lógica pode ser ajustada.
        start = now - timedelta(days=180)
    elif period == "1y":
        start = now - timedelta(days=365)
    else:
        raise ValueError("Invalid period. Use '7d', '30d', '6m' or '1y'.")

    # Build robust lookup: both str(_id) and raw ObjectId map to category.
    product_categories: Dict[str, str] = {}
    raw_id_map: Dict[Any, str] = {}

    for product in inventory:
        pid = product.get("_id")
        cat = product.get("category", "Unknown")
        if pid is None:
            continue
        product_categories[str(pid)] = cat
        raw_id_map[pid] = cat

    category_totals: Dict[str, float] = {}
    total_revenue = 0.0

    for sale in sales:
        # safe parse date (sale["date"] might be datetime or string)
        try:
            sale_date = _parse_date_safe(sale.get("date"))
        except Exception:
            # ignore malformed-date sales
            continue

        if sale_date < start:
            continue

        for item in sale.get("items", []):
            # possíveis formas de productId virem: ObjectId, str(ObjectId), None
            product_id = item.get("productId")
            product_id_str = str(product_id) if product_id is not None else None

            # prefer lookup in these orders:
            # 1) raw_id_map (ObjectId)
            # 2) product_categories[str(id)]
            # 3) fallback to productName (se disponível)
            category = None
            if product_id in raw_id_map:
                category = raw_id_map[product_id]
            elif product_id_str and product_id_str in product_categories:
                category = product_categories[product_id_str]
            else:
                # fallback: se item contém nome, procure no inventário por nome (case-insensitive)
                item_name = item.get("productName") or item.get("name")
                if item_name:
                    # procura primeira correspondência por nome
                    for prod in inventory:
                        if str(prod.get("name")).strip().lower() == str(item_name).strip().lower():
                            category = prod.get("category", "Unknown")
                            break

            if not category:
                category = "Unknown"

            quantity = item.get("quantity", 0) or 0
            price = item.get("price", 0.0) or 0.0
            try:
                value = float(price) * int(quantity)
            except Exception:
                # se tiver dados inválidos no item, ignora este item
                continue

            total_revenue += value
            category_totals[category] = category_totals.get(category, 0.0) + value

    # If no revenue collected (or no mapped categories), return empty dict or zeros
    if total_revenue == 0:
        # Retornar categorias conhecidas com 0.0 é útil para o frontend; aqui mantemos apenas as categorias encontradas.
        return {cat: 0.0 for cat in category_totals} if category_totals else {}

    # Convert totals → percentages (2 decimals)
    category_percentages: Dict[str, float] = {
        category: round((value / total_revenue) * 100, 2)
        for category, value in category_totals.items()
    }

    return category_percentages


from datetime import datetime, timedelta
from typing import List, Dict
import calendar


def calculate_revenue_in_period(sales: List[Dict], period: str):
    """
    Calculate revenue grouped by time for predefined periods:
    - "7d" : last 7 days (group by day)
    - "30d": last 30 days (group by day)
    - "6m" : last 6 months (group by month name)
    - "1y" : last 12 months (group by month name)
    """

    now = datetime.utcnow()

    # Determine range and grouping mode
    if period == "7d":
        start = now - timedelta(days=7)
        group_by = "day"
    elif period == "30d":
        start = now - timedelta(days=30)
        group_by = "day"
    elif period == "6m":
        start = now.replace(month=now.month - 6 if now.month > 6 else 12 - (6 - now.month),
                            year=now.year if now.month > 6 else now.year - 1)
        group_by = "month"
    elif period == "1y":
        start = now.replace(year=now.year - 1)
        group_by = "month"
    else:
        raise ValueError("Invalid period. Use one of: '7d', '30d', '6m', '1y'.")

    results = {}

    for s in sales:
        date = s["date"]
        value = float(s.get("total", 0))

        if date < start:
            continue

        if group_by == "day":
            key = date.strftime("%Y-%m-%d")
        else:
            # Convert month number → month name in PT-BR
            month_name = calendar.month_name[date.month].capitalize()
            key = month_name  # e.g. "Janeiro"

        results[key] = results.get(key, 0.0) + value

    # Round values
    results = {k: round(v, 2) for k, v in results.items()}
    
    return results
