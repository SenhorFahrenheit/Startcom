from apscheduler.schedulers.asyncio import AsyncIOScheduler
from ...infra.scheduler.jobs.update_client_category_jobs import update_client_category_job
from ...infra.scheduler.jobs.update_satisfaction_jobs import update_satisfaction_job
from ...infra.scheduler.jobs.update_inventory_total_products_job import update_inventory_total_products_job
scheduler = AsyncIOScheduler()

def start_scheduler():
    """
    Initialize the system's scheduler
    """
    scheduler.add_job(update_client_category_job, "interval", hours=6, minutes=0)
    # scheduler.add_job(update_client_category_job, "cron", hour=3, minute=0)

    scheduler.add_job(update_satisfaction_job, "interval", hours=0, minutes=5)
    # scheduler.add_job(update_satisfaction_job, "cron", hour=3, minutes=15)

    scheduler.add_job(update_inventory_total_products_job, 'interval', hours=0, minutes=1)
    # scheduler.add_job(update_inventory_total_products_job, 'interval', hours=0, minutes=30)

    scheduler.start()
