from apscheduler.schedulers.asyncio import AsyncIOScheduler
from ...infra.scheduler.jobs.update_client_category_jobs import update_client_category_job
from ...infra.scheduler.jobs.update_satisfaction_jobs import update_satisfaction_job
from ...infra.scheduler.jobs.update_inventory_total_products_job import update_inventory_total_products_job
from ...infra.scheduler.jobs.update_low_inventory_job import update_low_inventory_job
from ...infra.scheduler.jobs.update_inventory_critic_job import update_critical_inventory_job
from ...infra.scheduler.jobs.update_total_inventory_value_job import update_total_inventory_value_job
scheduler = AsyncIOScheduler()

def start_scheduler():
    """
    Initialize the system's scheduler
    """
    # For tests:
    # scheduler.add_job(update_client_category_job, "interval", hours=6, minutes=0)
    # scheduler.add_job(update_satisfaction_job, "interval", hours=0, minutes=5)
    # For production:
    scheduler.add_job(update_client_category_job, "cron", hour=3, minute=0)
    scheduler.add_job(update_satisfaction_job, "cron", hour=3, minute=15)


    # For tests:
    # scheduler.add_job(update_inventory_total_products_job, "interval", hours=0, minutes=1)
    # scheduler.add_job(update_low_inventory_job, "interval", hours=0, minutes=1)
    # scheduler.add_job(update_critical_inventory_job, "interval", hours=0, minutes=1)
    # scheduler.add_job(update_total_inventory_value_job, "interval", hours=1, minutes=0)

    scheduler.add_job(update_inventory_total_products_job, 'interval', hours=0, minutes=15, seconds=0)
    scheduler.add_job(update_low_inventory_job, "interval", hours=0, minutes=15, seconds=20)
    scheduler.add_job(update_critical_inventory_job, "interval", hours=0, minutes=15, seconds=40)
    scheduler.add_job(update_total_inventory_value_job, "interval", hours=0, minutes=16)

    scheduler.start()
