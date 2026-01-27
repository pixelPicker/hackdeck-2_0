import uuid
from sqlalchemy import Column, String, Float, Enum, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
import enum
from app.db.base import Base


class TreatmentType(str, enum.Enum):
    CHEMICAL = "chemical"
    ORGANIC = "organic"
    CULTURAL = "cultural"  # Cultural practices like crop rotation


class CropStage(str, enum.Enum):
    SEEDLING = "seedling"
    VEGETATIVE = "vegetative"
    FLOWERING = "flowering"
    FRUITING = "fruiting"
    ANY = "any"


class Treatment(Base):
    __tablename__ = "treatments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    disease_id = Column(UUID(as_uuid=True), ForeignKey("diseases.id"), nullable=False)
    
    # Localization
    region = Column(String, nullable=True)  # null = global, else region-specific
    crop_stage = Column(Enum(CropStage), default=CropStage.ANY)
    
    # Treatment details
    type = Column(Enum(TreatmentType), nullable=False)
    name = Column(String, nullable=False)
    
    # Dosage information
    dosage = Column(JSON, nullable=True)  # {amount, unit, application_method, frequency}
    
    # Instructions (multilingual support)
    instructions = Column(JSON, nullable=False)  # {en: "...", hi: "...", etc.}
    
    # Effectiveness
    effectiveness_score = Column(Float, nullable=True)  # 0.0 - 1.0
    
    # Additional info
    precautions = Column(JSON, nullable=True)
    cost_estimate = Column(String, nullable=True)

    def __repr__(self):
        return f"<Treatment {self.name} ({self.type})>"
