from fastapi import APIRouter, Depends, HTTPException
from app.services.ml.model_manager import model_manager
from app.schemas.diagnosis import ModelInfo
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/models", tags=["models"])


@router.get("/latest", response_model=ModelInfo)
async def get_latest_model():
    """
    Get latest model information for offline sync
    
    Returns model version and download URL
    """
    try:
        model_info = model_manager.get_model_info()

        # In production, host model file on S3 or CDN
        download_url = f"https://your-cdn.com/models/plant_disease_{model_info['version']}.tflite"

        return ModelInfo(
            version=model_info["version"],
            download_url=download_url,
            size_mb=5.2,  # Approximate size
            last_updated="2026-01-27",
        )

    except Exception as e:
        logger.error(f"Get model info error: {str(e)}")
        raise HTTPException(500, str(e))


@router.get("/info")
async def get_model_details():
    """Get detailed model information"""
    try:
        return model_manager.get_model_info()
    except Exception as e:
        logger.error(f"Get model details error: {str(e)}")
        raise HTTPException(500, str(e))
