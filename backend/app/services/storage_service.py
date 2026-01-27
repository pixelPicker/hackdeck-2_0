import boto3
from botocore.exceptions import ClientError
from app.core.config import settings
import uuid
from pathlib import Path
import logging

logger = logging.getLogger(__name__)


class StorageService:
    """AWS S3 storage service for images"""

    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION
        )
        self.bucket_name = settings.S3_BUCKET_NAME

    async def upload_image(
        self, 
        file_bytes: bytes, 
        file_extension: str = "jpg",
        folder: str = "diagnoses"
    ) -> str:
        """
        Upload image to S3 and return public URL
        """
        try:
            # Generate unique filename
            filename = f"{folder}/{uuid.uuid4()}.{file_extension}"

            # Upload to S3
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=filename,
                Body=file_bytes,
                ContentType=f"image/{file_extension}",
                ACL='public-read'  # Make publicly accessible
            )

            # Return public URL
            url = f"https://{self.bucket_name}.s3.{settings.AWS_REGION}.amazonaws.com/{filename}"
            logger.info(f"Image uploaded to S3: {url}")
            return url

        except ClientError as e:
            logger.error(f"S3 upload error: {str(e)}")
            raise

    async def delete_image(self, image_url: str) -> bool:
        """Delete image from S3"""
        try:
            # Extract key from URL
            key = image_url.split(f"{self.bucket_name}.s3.{settings.AWS_REGION}.amazonaws.com/")[1]
            
            self.s3_client.delete_object(
                Bucket=self.bucket_name,
                Key=key
            )
            
            logger.info(f"Image deleted from S3: {key}")
            return True

        except Exception as e:
            logger.error(f"S3 delete error: {str(e)}")
            return False


storage_service = StorageService()
