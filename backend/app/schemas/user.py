from pydantic import BaseModel, EmailStr
from typing import Optional


class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None


class UserResponse(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    role: str
    phone: Optional[str] = None