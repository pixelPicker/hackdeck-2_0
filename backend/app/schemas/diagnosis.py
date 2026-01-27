from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class DiagnosisCreate(BaseModel):
    crop_name: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    user_id: Optional[str] = None


class QualityMetrics(BaseModel):
    quality_score: float
    blur_score: float
    brightness: float
    is_acceptable: bool
    issues: List[str]


class PredictionItem(BaseModel):
    class_name: str
    confidence: float
    crop_name: str
    disease_name: str


class DiagnosisResponse(BaseModel):
    id: str
    crop_name: str
    disease_name: str
    confidence: float
    is_healthy: bool
    needs_retry: Optional[str]
    image_url: str
    quality_metrics: QualityMetrics
    top_3_predictions: List[PredictionItem]
    suggestions: List[str]
    model_version: str
    heatmap_url: Optional[str] = None
    created_at: datetime


class TreatmentResponse(BaseModel):
    id: str
    type: str
    name: str
    dosage: Optional[dict]
    instructions: dict
    effectiveness_score: Optional[float]
    precautions: Optional[List[str]]
    cost_estimate: Optional[str]


class AlertResponse(BaseModel):
    id: str
    disease_name: str
    crop_name: str
    detection_count: int
    severity_level: int
    distance_km: float
    alert_date: str


class HistoryItem(BaseModel):
    id: str
    crop_name: str
    disease_name: str
    confidence: float
    image_url: str
    created_at: datetime


class ProgressItem(BaseModel):
    id: str
    crop_name: str
    health_score: float
    image_url: str
    stage: Optional[str]
    notes: Optional[str]
    recorded_at: datetime


class ModelInfo(BaseModel):
    version: str
    download_url: Optional[str]
    size_mb: Optional[float]
    last_updated: Optional[str]
