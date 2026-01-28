from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.base import get_db
from app.services.ml.inference import inference_service
from app.services.ml.explainability import explainability_service
from app.services.storage_service import storage_service
from app.services.geolocation_service import geolocation_service
from app.models.diagnosis import Diagnosis
from app.models.disease_alert import DiseaseAlert
from app.schemas.diagnosis import DiagnosisResponse, QualityMetrics, PredictionItem
from sqlalchemy import select
from sqlalchemy.future import select as future_select
from datetime import datetime, date
import uuid
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/diagnosis", tags=["diagnosis"])


@router.post("/upload", response_model=DiagnosisResponse)
async def upload_and_diagnose(
    image: UploadFile = File(..., description="Crop image for diagnosis"),
    latitude: float = Form(None),
    longitude: float = Form(None),
    user_id: str = Form(None),
    db: AsyncSession = Depends(get_db),
):
    """
    Upload crop image and get disease diagnosis with confidence scoring
    
    - **image**: Image file (JPG/PNG, max 10MB)
    - **latitude**: Optional GPS latitude
    - **longitude**: Optional GPS longitude
    - **user_id**: Optional user ID
    """
    try:
        # Validate file
        if image.content_type not in ["image/jpeg", "image/jpg", "image/png"]:
            raise HTTPException(400, "Invalid file type. Only JPG/PNG allowed")

        # Read image bytes
        image_bytes = await image.read()

        # Run inference
        prediction_result = await inference_service.predict_disease(image_bytes)

        # Upload to S3
        file_ext = image.filename.split(".")[-1] if "." in image.filename else "jpg"
        image_url = await storage_service.upload_image(image_bytes, file_ext, "diagnoses")

        # Generate heatmap (optional)
        heatmap_bytes = explainability_service.generate_heatmap_simple(
            image_bytes, 
            prediction_result["confidence"]
        )
        heatmap_url = await storage_service.upload_image(heatmap_bytes, "jpg", "heatmaps")

        # Anonymize location if provided
        grid_location = None
        if latitude and longitude:
            grid_location = geolocation_service.anonymize_location(latitude, longitude)

        # Save to database
        diagnosis = Diagnosis(
            id=uuid.uuid4(),
            user_id=uuid.UUID(user_id) if user_id else None,
            crop_name=prediction_result["cropName"],
            disease_name=prediction_result["diseaseName"],
            confidence_score=prediction_result["confidence"],
            image_url=image_url,
            image_quality_score=prediction_result.get("qualityScore", 85),
            model_version=prediction_result.get("modelVersion", "1.0"),
            metadata={
                "latitude": latitude,
                "longitude": longitude,
                "filename": image.filename,
            },
            grid_location=grid_location,
            needs_retry=prediction_result.get("needsRetry"),
        )

        db.add(diagnosis)
        await db.commit()
        await db.refresh(diagnosis)

        # Update disease alert if applicable
        if grid_location and not prediction_result["isHealthy"]:
            await update_disease_alert(
                db, 
                prediction_result["diseaseName"],
                prediction_result["cropName"],
                grid_location
            )

        # Build response compatible with mobile app
        response = DiagnosisResponse(
            id=str(diagnosis.id),
            crop_name=diagnosis.crop_name,
            disease_name=diagnosis.disease_name,
            confidence=diagnosis.confidence_score,
            is_healthy=prediction_result["isHealthy"],
            needs_retry=diagnosis.needs_retry,
            image_url=diagnosis.image_url,
            quality_metrics=QualityMetrics(
                quality_score=prediction_result.get("qualityScore", 85),
                blur_score=0,
                brightness=0,
                is_acceptable=True,
                issues=[]
            ),
            top_3_predictions=[
                PredictionItem(**pred) for pred in prediction_result.get("top3Predictions", [])
            ],
            suggestions=prediction_result.get("suggestions", []),
            model_version=diagnosis.model_version,
            heatmap_url=heatmap_url,
            created_at=diagnosis.created_at,
        )

        logger.info(f"Diagnosis created: {diagnosis.id}")
        return response

    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        raise HTTPException(500, f"Error processing image: {str(e)}")


@router.get("/{diagnosis_id}", response_model=DiagnosisResponse)
async def get_diagnosis(
    diagnosis_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get diagnosis by ID"""
    try:
        result = await db.execute(
            select(Diagnosis).where(Diagnosis.id == uuid.UUID(diagnosis_id))
        )
        diagnosis = result.scalars().first()

        if not diagnosis:
            raise HTTPException(404, "Diagnosis not found")

        # Reconstruct response
        response = DiagnosisResponse(
            id=str(diagnosis.id),
            crop_name=diagnosis.crop_name,
            disease_name=diagnosis.disease_name,
            confidence=diagnosis.confidence_score,
            is_healthy="healthy" in diagnosis.disease_name.lower(),
            needs_retry=diagnosis.needs_retry,
            image_url=diagnosis.image_url,
            quality_metrics=QualityMetrics(
                quality_score=diagnosis.image_quality_score or 0,
                blur_score=0,
                brightness=0,
                is_acceptable=True,
                issues=[]
            ),
            top_3_predictions=[],  # Not stored in DB
            suggestions=[],
            model_version=diagnosis.model_version,
            heatmap_url=None,  # TODO: Store heatmap URL in DB
            created_at=diagnosis.created_at,
        )

        return response

    except ValueError:
        raise HTTPException(400, "Invalid diagnosis ID format")
    except Exception as e:
        logger.error(f"Get diagnosis error: {str(e)}")
        raise HTTPException(500, str(e))


async def update_disease_alert(
    db: AsyncSession,
    disease_name: str,
    crop_name: str,
    grid_location: str
):
    """Update or create disease alert for location"""
    try:
        # Check if alert exists for today
        result = await db.execute(
            select(DiseaseAlert).where(
                DiseaseAlert.grid_location == grid_location,
                DiseaseAlert.crop_name == crop_name,
                DiseaseAlert.alert_date == date.today(),
            )
        )
        alert = result.scalars().first()

        if alert:
            # Update existing alert
            alert.detection_count += 1
            alert.severity_level = min(5, (alert.detection_count // 3) + 1)
            alert.last_detected_at = date.today()
        else:
            # Create new alert
            alert = DiseaseAlert(
                id=uuid.uuid4(),
                disease_id=None,  # TODO: Link to disease table
                crop_name=crop_name,
                grid_location=grid_location,
                detection_count=1,
                severity_level=1,
            )
            db.add(alert)

        await db.commit()
        logger.info(f"Disease alert updated: {grid_location}")

    except Exception as e:
        logger.error(f"Alert update error: {str(e)}")
