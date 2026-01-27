import uuid
from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    phone_number = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=True)
    language_preference = Column(String, default="en")
    region = Column(String, nullable=True)  # e.g., "India-Maharashtra"
    latitude = Column(String, nullable=True)  # Grid-based, anonymized
    longitude = Column(String, nullable=True)  # Grid-based, anonymized
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)

    def __repr__(self):
        return f"<User {self.phone_number}>"
