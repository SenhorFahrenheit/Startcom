from fastapi import FastAPI
from routes.login.auth_auth_routes import router as auth_router
from routes.user.user_routes import router as user_router
from config.config_cors import setup_cors

app = FastAPI()

# Set up CORS middleware
setup_cors(app)

# HTTP routes
app.include_router(auth_router)
app.include_router(user_router)

