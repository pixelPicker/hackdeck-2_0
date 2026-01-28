import uuid
from sqlalchemy import Column, String, Integer, Date, Boolean
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from app.db.base import Base


class DiseaseAlert(Base):
    __tablename__ = "disease_alerts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    disease_id = Column(UUID(as_uuid=True), nullable=True)  # TODO: Add foreign key when diseases table exists
    crop_name = Column(String, nullable=False)
    
    # Anonymized location (grid cell)
    grid_location = Column(String, nullable=False, index=True)  # "lat,lon" rounded
    
    # Alert metrics
    detection_count = Column(Integer, default=1)
    severity_level = Column(Integer, default=1)  # 1-5 based on detection count
    
    # Alert status
    alert_date = Column(Date, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    # Metadata
    last_detected_at = Column(Date, default=datetime.utcnow)

    def __repr__(self):
        return f"<DiseaseAlert {self.crop_name} at {self.grid_location}>"
