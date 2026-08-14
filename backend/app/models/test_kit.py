import uuid
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.connection import Base


class TestKit(Base):
    __tablename__ = "test_kits"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(150), nullable=False)
    kit_type = Column(String(100), nullable=False)
    manufacturer = Column(String(150), nullable=True)
    kit_code = Column(String(50), nullable=True)
    status = Column(String(20), default="active", nullable=False)
    description = Column(Text, nullable=True)
    instructions = Column(Text, nullable=True)
    added_by = Column(String(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    added_by_user = relationship("User", back_populates="test_kits")
