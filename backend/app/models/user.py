import uuid
from sqlalchemy import Column, String, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.database.connection import Base


class UserRole(str, enum.Enum):
    management = "management"
    user = "user"


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.user, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    test_results = relationship(
        "TestResult", back_populates="user", cascade="all, delete-orphan"
    )
    test_kits = relationship(
        "TestKit", back_populates="added_by_user", cascade="all, delete-orphan"
    )
    user_test_kits = relationship(
        "UserTestKit", back_populates="user", cascade="all, delete-orphan"
    )
