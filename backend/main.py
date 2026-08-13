from fastapi import FastAPI
from app.database.connection import client
from app.routes.auth import router as auth_router

app = FastAPI(
    title="AFRA Connect API",
    description="Backend API for the AFRA Connect healthcare management system",
    version="1.0.0"
)

app.include_router(auth_router)


@app.get("/")
def root():
    return {
        "message": "AFRA Connect API is running!",
        "status": "success"
    }


@app.get("/health")
def health_check():
    try:
        client.admin.command("ping")

        return {
            "status": "healthy",
            "database": "connected"
        }

    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }