from app.core.config import settings
import math
from typing import Tuple, Optional
import logging

logger = logging.getLogger(__name__)


class GeolocationService:
    """Privacy-preserving geolocation services"""

    @staticmethod
    def anonymize_location(lat: float, lon: float, grid_size_km: Optional[int] = None) -> str:
        """
        Anonymize GPS coordinates to grid cell
        Returns: "lat,lon" rounded to nearest grid cell
        """
        grid_size = grid_size_km or settings.GRID_SIZE_KM
        
        # Convert km to degrees (approximate)
        # 1 degree latitude ≈ 111 km
        # 1 degree longitude varies by latitude
        grid_degrees = grid_size / 111.0

        # Round to nearest grid cell
        grid_lat = round(lat / grid_degrees) * grid_degrees
        grid_lon = round(lon / grid_degrees) * grid_degrees

        return f"{grid_lat:.4f},{grid_lon:.4f}"

    @staticmethod
    def calculate_distance(
        lat1: float, lon1: float, 
        lat2: float, lon2: float
    ) -> float:
        """
        Calculate distance between two points using Haversine formula
        Returns: distance in kilometers
        """
        # Earth's radius in km
        R = 6371.0

        # Convert to radians
        lat1_rad = math.radians(lat1)
        lat2_rad = math.radians(lat2)
        delta_lat = math.radians(lat2 - lat1)
        delta_lon = math.radians(lon2 - lon1)

        # Haversine formula
        a = (
            math.sin(delta_lat / 2) ** 2
            + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon / 2) ** 2
        )
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        distance = R * c

        return distance

    @staticmethod
    def parse_grid_location(grid_location: str) -> Tuple[float, float]:
        """
        Parse grid location string to lat, lon
        Example: "23.4567,77.8901" -> (23.4567, 77.8901)
        """
        try:
            lat_str, lon_str = grid_location.split(",")
            return float(lat_str), float(lon_str)
        except Exception as e:
            logger.error(f"Error parsing grid location: {str(e)}")
            return (0.0, 0.0)

    @staticmethod
    def is_nearby(
        grid_location1: str, 
        grid_location2: str, 
        radius_km: Optional[float] = None
    ) -> bool:
        """
        Check if two grid locations are within specified radius
        """
        radius = radius_km or settings.ALERT_RADIUS_KM
        
        lat1, lon1 = GeolocationService.parse_grid_location(grid_location1)
        lat2, lon2 = GeolocationService.parse_grid_location(grid_location2)
        
        distance = GeolocationService.calculate_distance(lat1, lon1, lat2, lon2)
        return distance <= radius


geolocation_service = GeolocationService()
