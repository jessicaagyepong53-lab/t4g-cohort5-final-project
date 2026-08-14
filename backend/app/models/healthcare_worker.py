from pydantic import BaseModel
from typing import Optional


class HealthcareWorker(BaseModel):
    user_id: str
    specialization: str
    license_number: Optional[str] = None
    department: Optional[str] = None
    years_of_experience: Optional[int] = None
    