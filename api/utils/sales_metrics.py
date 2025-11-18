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
        comparison = 0.0
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
        comparison = 0.0
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
