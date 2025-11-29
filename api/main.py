from fastapi import FastAPI
from api.routes.auth.google_routes import router as google_router
from api.routes.auth.apple_routes import router as apple_router
from api.routes.user.user_routes import router as user_router
from api.routes.auth.auth_routes import router as auth_router
from api.routes.company.sales_routes import router as sale_routes
from api.routes.company.clients_routes import router as client_routes
from api.routes.company.inventory_routes import router as inventory_routes
from api.routes.company.report_routes import router as report_routes

from api.infra.scheduler.scheduler import start_scheduler
import logging

app = FastAPI()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)


# HTTP routes
app.include_router(google_router, prefix="/AuthGoogle")
app.include_router(apple_router, prefix="/AuthApple")
app.include_router(user_router, prefix="/User")
app.include_router(auth_router, prefix="/Auth")
app.include_router(sale_routes, prefix="/Company")
app.include_router(client_routes, prefix="/Company")
app.include_router(inventory_routes, prefix="/Company")
app.include_router(report_routes, prefix="/Company")

@app.on_event("startup")
async def startup_event():
    start_scheduler()
    print("[App] Scheduler successfully initialized.")