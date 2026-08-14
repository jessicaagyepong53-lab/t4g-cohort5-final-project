from pydantic import BaseModel
from typing import Optional


class PatientCreate(BaseModel):
    date_of_birth: str
    gender: str
    address: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    blood_group: Optional[str] = None


class PatientResponse(BaseModel):
    id: str
    user_id: str
    date_of_birth: str
    gender: str
    address: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    blood_group: Optional[str] = None