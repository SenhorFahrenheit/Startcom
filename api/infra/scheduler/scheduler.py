# infra/scheduler/scheduler.py
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from ...infra.scheduler.jobs.update_client_category_jobs import update_client_category_job

scheduler = AsyncIOScheduler()

def start_scheduler():
    """
    Initialize the system's scheduler
    """
    scheduler.add_job(update_client_category_job, "interval", hours=6, minutes=0)
    # scheduler.add_job(update_client_category_job, "cron", hour=3, minute=0)
    scheduler.start()
