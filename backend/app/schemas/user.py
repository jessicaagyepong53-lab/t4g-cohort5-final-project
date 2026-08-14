from pydantic import BaseModel, EmailStr
from datetime import datetime
from enum import Enum


class UserRoleSchema(str, Enum):
    management = "management"
    user = "user"


class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: UserRoleSchema = UserRoleSchema.user


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    role: UserRoleSchema | None = None


class UserOut(UserBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True