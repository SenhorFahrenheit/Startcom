from ....services.background.satisfaction_services import SatisfactionService

async def update_satisfaction_job():
    """
    Scheduled job that recomputes and persists the company satisfaction metric.
    """
    service = SatisfactionService()
    await service.update_all_companies_satisfaction()
    print("[Job] Company satisfaction metric updated.")
