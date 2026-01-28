from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Environment
    ENVIRONMENT: str = "development"

    # Database
    DATABASE_URL: str
    REDIS_URL: str

    # AWS Configuration
    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str
    AWS_REGION: str = "us-east-1"
    S3_BUCKET_NAME: str

    # API Configuration
    API_V1_PREFIX: str = "/api/v1"
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # ML Configuration
    MODEL_PATH: str = "./models/plant_disease_model.onnx"  # Changed from .tflite to .onnx
    MODEL_VERSION: str = "v1.0"
    CONFIDENCE_THRESHOLD: float = 0.70
    IMAGE_SIZE: int = 224

    # Twilio
    TWILIO_ACCOUNT_SID: Optional[str] = None
    TWILIO_AUTH_TOKEN: Optional[str] = None
    TWILIO_PHONE_NUMBER: Optional[str] = None
    TWILIO_WHATSAPP_NUMBER: Optional[str] = None

    # Geolocation
    GRID_SIZE_KM: int = 10
    ALERT_RADIUS_KM: int = 50

    # File Upload
    MAX_FILE_SIZE_MB: int = 10
    ALLOWED_EXTENSIONS: Optional[list] = None

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # Ignore extra env vars like TF_ENABLE_ONEDNN_OPTS
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Set default allowed extensions if not provided
        if self.ALLOWED_EXTENSIONS is None:
            self.ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png"]


settings = Settings()
