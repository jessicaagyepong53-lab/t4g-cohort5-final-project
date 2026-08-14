from pydantic import BaseModel
from datetime import datetime, date


class UserTestKitBase(BaseModel):
    kit_type: str
    serial_number: str
    manufacturer: str | None = None
    purchase_date: date | None = None
    expiry_date: date | None = None
    notes: str | None = None


class UserTestKitCreate(UserTestKitBase):
    user_id: str


class UserTestKitUpdate(BaseModel):
    kit_type: str | None = None
    serial_number: str | None = None
    manufacturer: str | None = None
    purchase_date: date | None = None
    expiry_date: date | None = None
    notes: str | None = None


class UserTestKitOut(UserTestKitBase):
    id: str
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True
