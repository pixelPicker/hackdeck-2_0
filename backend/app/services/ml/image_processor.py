import numpy as np
import cv2
from PIL import Image
from io import BytesIO
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class ImageProcessor:
    """Image preprocessing and quality validation"""

    @staticmethod
    def load_image(image_bytes: bytes) -> Image.Image:
        """Load image from bytes"""
        return Image.open(BytesIO(image_bytes))

    @staticmethod
    def preprocess_for_model(image: Image.Image) -> np.ndarray:
        """Preprocess image for model inference"""
        # Resize to model input size
        image = image.resize(
            (settings.IMAGE_SIZE, settings.IMAGE_SIZE), 
            Image.Resampling.LANCZOS
        )

        # Convert to RGB if not already
        if image.mode != "RGB":
            image = image.convert("RGB")

        # Convert to numpy array and normalize
        image_array = np.array(image, dtype=np.float32)
        image_array = image_array / 255.0  # Normalize to [0, 1]

        # Add batch dimension
        image_array = np.expand_dims(image_array, axis=0)

        return image_array

    @staticmethod
    def check_blur(image_bytes: bytes) -> float:
        """
        Calculate blur score using Laplacian variance
        Returns: variance value (higher = sharper, lower = blurrier)
        Typically: variance < 100 is blurry
        """
        # Convert bytes to cv2 image
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Calculate Laplacian variance
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        return float(laplacian_var)

    @staticmethod
    def check_brightness(image_bytes: bytes) -> float:
        """
        Calculate average brightness
        Returns: value 0-255 (ideal: 80-180)
        """
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        return float(np.mean(gray))

    @staticmethod
    def enhance_image(image_bytes: bytes) -> bytes:
        """Auto-enhance image quality"""
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Convert to LAB color space
        lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)

        # Apply CLAHE (Contrast Limited Adaptive Histogram Equalization)
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
        l = clahe.apply(l)

        # Merge channels
        lab = cv2.merge([l, a, b])
        enhanced = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)

        # Sharpen
        kernel = np.array([[-1, -1, -1], [-1, 9, -1], [-1, -1, -1]])
        enhanced = cv2.filter2D(enhanced, -1, kernel)

        # Convert back to bytes
        _, buffer = cv2.imencode('.jpg', enhanced)
        return buffer.tobytes()

    @staticmethod
    def calculate_quality_score(blur_score: float, brightness: float) -> float:
        """
        Calculate overall image quality score (0-100)
        """
        # Blur scoring (100 is good, <100 is blurry)
        blur_quality = min(100, blur_score)

        # Brightness scoring (ideal range: 80-180)
        if 80 <= brightness <= 180:
            brightness_quality = 100
        elif brightness < 80:
            brightness_quality = (brightness / 80) * 100
        else:
            brightness_quality = max(0, 100 - ((brightness - 180) / 75) * 100)

        #  Weighted average
        quality_score = (blur_quality * 0.7) + (brightness_quality * 0.3)
        return round(quality_score, 2)

    @staticmethod
    def validate_image(image_bytes: bytes) -> dict:
        """
        Validate image quality and return metrics
        """
        blur_score = ImageProcessor.check_blur(image_bytes)
        brightness = ImageProcessor.check_brightness(image_bytes)
        quality_score = ImageProcessor.calculate_quality_score(blur_score, brightness)

        # Determine issues
        issues = []
        if blur_score < 100:
            issues.append("Image is blurry - try to focus better")
        if brightness < 60:
            issues.append("Image is too dark - use better lighting")
        if brightness > 200:
            issues.append("Image is overexposed - reduce lighting")

        return {
            "quality_score": quality_score,
            "blur_score": blur_score,
            "brightness": brightness,
            "is_acceptable": quality_score >= 50,
            "issues": issues,
        }
