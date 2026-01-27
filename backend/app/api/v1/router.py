from fastapi import APIRouter
from app.api.v1.endpoints import diagnosis, alerts, history, models

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(diagnosis.router)
api_router.include_router(alerts.router)
api_router.include_router(history.router)
api_router.include_router(models.router)
