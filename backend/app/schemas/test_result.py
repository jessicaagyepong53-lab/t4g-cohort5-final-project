from pydantic import BaseModel
from datetime import datetime


class TestResultBase(BaseModel):
    test_type: str
    result_data: str
    notes: str | None = None


class TestResultCreate(TestResultBase):
    user_id: str


class TestResultUpdate(BaseModel):
    test_type: str | None = None
    result_data: str | None = None
    notes: str | None = None


class TestResultOut(TestResultBase):
    id: str
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True
