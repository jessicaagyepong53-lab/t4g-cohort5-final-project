from pydantic import BaseModel, EmailStr
from typing import Optional


class User(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: str = "patient"
    phone: Optional[str] = None