from ....services.background.client_category_services import ClientCategoryService


async def update_client_category_job():
    """
    Scheduled job responsible for automatically updating client categories
    (regular, premium, VIP) across all companies.

    This function is triggered by the application's scheduler and
    delegates the update process to the `ClientCategoryService`.

    Execution:
        - Runs periodically according to the scheduler configuration.
        - Fetches all companies from the database.
        - Recalculates and updates each client's category.
    """
    # Create a service instance to handle client category updates
    service = ClientCategoryService()

    # Perform the update operation asynchronously
    await service.update_all_clients()

    # Log job completion for monitoring
    print("[Job] Automatic client category update completed successfully.")
