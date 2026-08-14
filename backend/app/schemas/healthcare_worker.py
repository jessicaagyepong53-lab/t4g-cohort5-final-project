from pydantic import BaseModel
from typing import Optional


class HealthcareWorkerCreate(BaseModel):
    specialization: str
    license_number: Optional[str] = None
    department: Optional[str] = None
    years_of_experience: Optional[int] = None


class HealthcareWorkerResponse(BaseModel):
    id: str
    user_id: str
    specialization: str
    license_number: Optional[str] = None
    department: Optional[str] = None
    years_of_experience: Optional[int] = None