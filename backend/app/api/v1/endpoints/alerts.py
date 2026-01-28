from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.base import get_db
from app.models.disease_alert import DiseaseAlert
from app.services.geolocation_service import geolocation_service
from app.schemas.diagnosis import AlertResponse
from sqlalchemy import select, and_
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.get("/nearby")
async def get_nearby_alerts(
    latitude: float,
    longitude: float,
    radius_km: float = 50,
    days: int = 7,
    db: AsyncSession = Depends(get_db),
):
    """
    Get disease alerts near a location
    
    - **latitude**: User's latitude
    - **longitude**: User's longitude
    - **radius_km**: Search radius (default 50km)
    - **days**: Look back period (default 7 days)
    """
    try:
        # Anonymize user location
        user_grid = geolocation_service.anonymize_location(latitude, longitude)

        # Get all active alerts from recent days
        cutoff_date = datetime.now().date() - timedelta(days=days)
        
        result = await db.execute(
            select(DiseaseAlert).where(
                and_(
                    DiseaseAlert.is_active == True,
                    DiseaseAlert.alert_date >= cutoff_date
                )
            )
        )
        alerts = result.scalars().all()

        # Filter by distance
        nearby_alerts = []
        for alert in alerts:
            if geolocation_service.is_nearby(user_grid, alert.grid_location, radius_km):
                # Calculate approximate distance
                user_lat, user_lon = geolocation_service.parse_grid_location(user_grid)
                alert_lat, alert_lon = geolocation_service.parse_grid_location(alert.grid_location)
                distance = geolocation_service.calculate_distance(
                    user_lat, user_lon, alert_lat, alert_lon
                )

                nearby_alerts.append(
                    AlertResponse(
                        id=str(alert.id),
                        disease_name="Unknown",  # TODO: Join with disease table
                        crop_name=alert.crop_name,
                        detection_count=alert.detection_count,
                        severity_level=alert.severity_level,
                        distance_km=round(distance, 1),
                        alert_date=alert.alert_date.isoformat(),
                    )
                )

        # Sort by severity and distance
        nearby_alerts.sort(key=lambda x: (-x.severity_level, x.distance_km))

        logger.info(f"Found {len(nearby_alerts)} alerts near {user_grid}")
        return nearby_alerts

    except Exception as e:
        logger.error(f"Get alerts error: {str(e)}")
        raise HTTPException(500, str(e))


@router.get("/stats")
async def get_alert_stats(
    db: AsyncSession = Depends(get_db),
):
    """Get global alert statistics"""
    try:
        # Count active alerts
        result = await db.execute(
            select(DiseaseAlert).where(DiseaseAlert.is_active == True)
        )
        active_alerts = result.scalars().all()

        # Calculate stats
        total_alerts = len(active_alerts)
        total_detections = sum(alert.detection_count for alert in active_alerts)
        high_severity = len([a for a in active_alerts if a.severity_level >= 4])

        return {
            "total_active_alerts": total_alerts,
            "total_detections": total_detections,
            "high_severity_alerts": high_severity,
            "last_updated": datetime.now().isoformat(),
        }

    except Exception as e:
        logger.error(f"Get stats error: {str(e)}")
        raise HTTPException(500, str(e))
