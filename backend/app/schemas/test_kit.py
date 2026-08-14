from pydantic import BaseModel
from datetime import datetime


class TestKitBase(BaseModel):
    name: str
    kit_type: str
    manufacturer: str | None = None
    kit_code: str | None = None
    status: str = "active"
    description: str | None = None
    instructions: str | None = None


class TestKitCreate(TestKitBase):
    added_by: str


class TestKitUpdate(BaseModel):
    name: str | None = None
    kit_type: str | None = None
    manufacturer: str | None = None
    kit_code: str | None = None
    status: str | None = None
    description: str | None = None
    instructions: str | None = None


class TestKitOut(TestKitBase):
    id: str
    added_by: str
    created_at: datetime

    class Config:
        from_attributes = True
