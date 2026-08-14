import uuid
from sqlalchemy import Column, String, Text, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.connection import Base


class UserTestKit(Base):
    __tablename__ = "user_test_kits"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    kit_type = Column(String(100), nullable=False)
    serial_number = Column(String(150), nullable=False)
    manufacturer = Column(String(150), nullable=True)
    purchase_date = Column(Date, nullable=True)
    expiry_date = Column(Date, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="user_test_kits")
