from fastapi import APIRouter, Depends, HTTPException

from app.database.connection import db
from app.schemas.healthcare_worker import (
    HealthcareWorkerCreate,
    HealthcareWorkerResponse
)
from app.security import get_current_user, require_roles


router = APIRouter(
    prefix="/api/healthcare-workers",
    tags=["Healthcare Workers"]
)


@router.post(
    "/profile",
    response_model=HealthcareWorkerResponse
)
def create_healthcare_worker_profile(
    worker: HealthcareWorkerCreate,
    current_user: dict = Depends(
        require_roles("doctor", "nurse")
    )
):
    user_id = current_user["user_id"]

    existing_profile = db.healthcare_workers.find_one({
        "user_id": user_id
    })

    if existing_profile:
        raise HTTPException(
            status_code=400,
            detail="Healthcare worker profile already exists."
        )

    new_worker = {
        "user_id": user_id,
        "specialization": worker.specialization,
        "license_number": worker.license_number,
        "department": worker.department,
        "years_of_experience": worker.years_of_experience
    }

    result = db.healthcare_workers.insert_one(new_worker)

    return {
        "id": str(result.inserted_id),
        **new_worker
    }


@router.get(
    "/profile",
    response_model=HealthcareWorkerResponse
)
def get_healthcare_worker_profile(
    current_user: dict = Depends(
        require_roles("doctor", "nurse")
    )
):
    user_id = current_user["user_id"]

    worker = db.healthcare_workers.find_one({
        "user_id": user_id
    })

    if not worker:
        raise HTTPException(
            status_code=404,
            detail="Healthcare worker profile not found."
        )

    return {
        "id": str(worker["_id"]),
        **{
            key: value
            for key, value in worker.items()
            if key != "_id"
        }
    }