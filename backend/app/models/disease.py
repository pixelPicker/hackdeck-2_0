import uuid
from sqlalchemy import Column, String, Integer, Enum, JSON
from sqlalchemy.dialects.postgresql import UUID
import enum
from app.db.base import Base


class DiseaseSeverity(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class Disease(Base):
    __tablename__ = "diseases"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, nullable=False)
    scientific_name = Column(String, nullable=True)
    crop_name = Column(String, nullable=False)
    severity = Column(Enum(DiseaseSeverity), default=DiseaseSeverity.MEDIUM)
    
    # Disease details
    symptoms = Column(JSON, nullable=True)  # List of symptoms
    causes = Column(JSON, nullable=True)  # List of causes
    prevention_tips = Column(JSON, nullable=True)
    image_examples = Column(JSON, nullable=True)  # List of image URLs
    
    # Class index from model
    class_index = Column(Integer, unique=True, nullable=False)

    def __repr__(self):
        return f"<Disease {self.name} ({self.crop_name})>"
