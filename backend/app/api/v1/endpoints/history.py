from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.base import get_db
from app.models.diagnosis import Diagnosis
from app.schemas.diagnosis import HistoryItem
from sqlalchemy import select, desc
import uuid
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/history", tags=["history"])


@router.get("/user/{user_id}")
async def get_user_history(
    user_id: str,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
):
    """
    Get user's diagnosis history
    
    - **user_id**: User ID
    - **limit**: Maximum number of results (default 20)
    """
    try:
        result = await db.execute(
            select(Diagnosis)
            .where(Diagnosis.user_id == uuid.UUID(user_id))
            .order_by(desc(Diagnosis.created_at))
            .limit(limit)
        )
        diagnoses = result.scalars().all()

        history = [
            HistoryItem(
                id=str(d.id),
                crop_name=d.crop_name,
                disease_name=d.disease_name,
                confidence=d.confidence_score,
                image_url=d.image_url,
                created_at=d.created_at,
            )
            for d in diagnoses
        ]

        return history

    except ValueError:
        raise HTTPException(400, "Invalid user ID format")
    except Exception as e:
        logger.error(f"Get history error: {str(e)}")
        raise HTTPException(500, str(e))


@router.get("/")
async def get_all_history(
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
):
    """
    Get all diagnosis history (for frontend display)
    
    - **limit**: Maximum number of results (default 50)
    """
    try:
        result = await db.execute(
            select(Diagnosis)
            .order_by(desc(Diagnosis.created_at))
            .limit(limit)
        )
        diagnoses = result.scalars().all()

        history = [
            HistoryItem(
                id=str(d.id),
                crop_name=d.crop_name,
                disease_name=d.disease_name,
                confidence=d.confidence_score,
                image_url=d.image_url,
                created_at=d.created_at,
            )
            for d in diagnoses
        ]

        return history

    except Exception as e:
        logger.error(f"Get all history error: {str(e)}")
        raise HTTPException(500, str(e))


@router.get("/recent")
async def get_recent_diagnoses(
    limit: int = 10,
    db: AsyncSession = Depends(get_db),
):
    """Get recent diagnoses (for admin/stats)"""
    try:
        result = await db.execute(
            select(Diagnosis)
            .order_by(desc(Diagnosis.created_at))
            .limit(limit)
        )
        diagnoses = result.scalars().all()

        return [
            {
                "id": str(d.id),
                "crop_name": d.crop_name,
                "disease_name": d.disease_name,
                "confidence": d.confidence_score,
                "created_at": d.created_at.isoformat(),
            }
            for d in diagnoses
        ]

    except Exception as e:
        logger.error(f"Get recent error: {str(e)}")
        raise HTTPException(500, str(e))
