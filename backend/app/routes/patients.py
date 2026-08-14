from fastapi import APIRouter, Depends, HTTPException

from app.database.connection import db
from app.schemas.patient import PatientCreate, PatientResponse
from app.security import get_current_user

from bson import ObjectId


router = APIRouter(
    prefix="/api/patients",
    tags=["Patients"]
)


@router.post("/profile", response_model=PatientResponse)
def create_patient_profile(
    patient: PatientCreate,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["user_id"]

    existing_profile = db.patients.find_one({
        "user_id": user_id
    })

    if existing_profile:
        raise HTTPException(
            status_code=400,
            detail="Patient profile already exists."
        )

    new_patient = {
        "user_id": user_id,
        "date_of_birth": patient.date_of_birth,
        "gender": patient.gender,
        "address": patient.address,
        "emergency_contact_name": patient.emergency_contact_name,
        "emergency_contact_phone": patient.emergency_contact_phone,
        "blood_group": patient.blood_group
    }

    result = db.patients.insert_one(new_patient)

    return {
        "id": str(result.inserted_id),
        **new_patient
    }


@router.get("/profile", response_model=PatientResponse)
def get_patient_profile(
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["user_id"]

    patient = db.patients.find_one({
        "user_id": user_id
    })

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient profile not found."
        )

    return {
        "id": str(patient["_id"]),
        **{
            key: value
            for key, value in patient.items()
            if key != "_id"
        }
    }