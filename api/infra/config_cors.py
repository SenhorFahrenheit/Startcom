from fastapi.middleware.cors import CORSMiddleware

# Configure and apply CORS middleware to the FastAPI app
def setup_cors(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],       # Allow requests from all origins (adjust in production)
        allow_credentials=True,    # Allow cookies and authorization headers
        allow_methods=["*"],       # Allow all HTTP methods (GET, POST, etc.)
        allow_headers=["*"],       # Allow all headers in requests
    )
