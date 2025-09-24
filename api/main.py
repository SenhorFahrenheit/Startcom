from fastapi import FastAPI
from api.routes.auth.google_routes import router as google_router
from api.routes.auth.apple_routes import router as apple_router
from api.routes.user.user_routes import router as user_router
from api.routes.auth.auth_routes import router as auth_router
from api.config.config_cors import setup_cors

app = FastAPI()

# Set up CORS middleware
setup_cors(app)

# HTTP routes
app.include_router(google_router, prefix="/AuthGoogle")
app.include_router(apple_router, prefix="/AuthApple")
app.include_router(user_router, prefix="/User")
app.include_router(auth_router, prefix="/Auth")
