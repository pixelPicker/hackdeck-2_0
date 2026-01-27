import uuid
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from app.db.base import Base


class CropHistory(Base):
    __tablename__ = "crop_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    diagnosis_id = Column(UUID(as_uuid=True), ForeignKey("diagnoses.id"), nullable=True)
    crop_name = Column(String, nullable=False)
    
    # Progress tracking
    image_url = Column(String, nullable=False)
    health_score = Column(Float, nullable=False)  # 0.0 - 100.0
    stage = Column(String, nullable=True)  # "before_treatment", "after_7_days", etc.
    
    # User notes
    notes = Column(Text, nullable=True)
    
    recorded_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<CropHistory {self.crop_name} - {self.health_score}%>"
