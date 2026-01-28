import uuid
from sqlalchemy import Column, String, Float, DateTime, Enum, JSON
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime, timezone
import enum
from app.db.base import Base


class DiagnosisStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    REJECTED = "rejected"
    REVIEWED = "reviewed"


class Diagnosis(Base):
    __tablename__ = "diagnoses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=True)  # TODO: Add foreign key when users table exists
    crop_name = Column(String, nullable=False)  # e.g., "Tomato", "Potato"
    disease_name = Column(String, nullable=True)  # e.g., "Early Blight"
    confidence_score = Column(Float, nullable=False)  # 0.0 - 1.0
    image_url = Column(String, nullable=False)
    image_quality_score = Column(Float, nullable=True)  # 0.0 - 100.0
    model_version = Column(String, nullable=False)
    
    # Additional Information
    extra_metadata = Column(JSON, nullable=True)  # GPS, timestamp, device info
    grid_location = Column(String, nullable=True)  # Anonymized grid cell
    
    status = Column(Enum(DiagnosisStatus), default=DiagnosisStatus.PENDING)
    needs_retry = Column(String, nullable=True)  # "low_confidence", "poor_quality", null
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Diagnosis {self.crop_name} - {self.disease_name}>"
