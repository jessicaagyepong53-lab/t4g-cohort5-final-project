from fastapi import FastAPI
from app.database.connection import client
from app.routes.auth import router as auth_router
from app.routes.patients import router as patient_router
from app.routes.healthcare_worker import (
    router as healthcare_worker_router
)
from app.routes.admin import router as admin_router

app = FastAPI(
    title="AFRA Connect API",
    description="Backend API for the AFRA Connect healthcare management system",
    version="1.0.0"
)

app.include_router(auth_router)
app.include_router(patient_router)
app.include_router(healthcare_worker_router)
app.include_router(admin_router)


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