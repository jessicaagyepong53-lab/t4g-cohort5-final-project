from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class User(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: str = "patient"
    phone: Optional[str] = None
    is_active: bool = True
    created_at: datetime
    updated_at: datetime