import cv2
import numpy as np
from PIL import Image
from io import BytesIO
from typing import Tuple
import tensorflow as tf
import logging

logger = logging.getLogger(__name__)


class ExplainabilityService:
    """
    Generate GradCAM heatmaps for model interpretability
    Note: GradCAM works best with full TensorFlow models, not TFLite
    This is a simplified version for demonstration
    """

    @staticmethod
    def generate_heatmap_simple(
        image_bytes: bytes, 
        confidence: float
    ) -> bytes:
        """
        Generate a simple attention heatmap based on edge detection
        This is a placeholder for demonstration - ideally use GradCAM with full TF model
        """
        try:
            # Load image
            nparr = np.frombuffer(image_bytes, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            # Convert to grayscale
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Apply Gaussian blur
            blurred = cv2.GaussianBlur(gray, (5, 5), 0)
            
            # Edge detection (simulates attention areas)
            edges = cv2.Canny(blurred, 50, 150)
            
            # Dilate edges to make them more visible
            kernel = np.ones((5, 5), np.uint8)
            edges = cv2.dilate(edges, kernel, iterations=1)
            
            # Create heatmap (red for high attention)
            heatmap = cv2.applyColorMap(edges, cv2.COLORMAP_JET)
            
            # Blend with original image
            overlay = cv2.addWeighted(image, 0.6, heatmap, 0.4, 0)
            
            # Add confidence text
            text = f"Confidence: {confidence:.1%}"
            cv2.putText(
                overlay, text, (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2
            )
            
            # Convert to bytes
            _, buffer = cv2.imencode('.jpg', overlay)
            return buffer.tobytes()
            
        except Exception as e:
            logger.error(f"Heatmap generation error: {str(e)}")
            return image_bytes  # Return original if error

    @staticmethod
    def generate_gradcam_placeholder(
        image_bytes: bytes,
        predicted_class: int,
        confidence: float
    ) -> dict:
        """
        Placeholder for full GradCAM implementation
        Returns metadata about what would be shown
        """
        return {
            "heatmap_available": False,
            "explanation": "Model focused on leaf discoloration and spot patterns",
            "key_features": [
                "Irregular spots on leaf surface",
                "Color changes in affected areas",
                "Leaf texture abnormalities"
            ],
            "note": "Full GradCAM requires TensorFlow model (not TFLite)"
        }


explainability_service = ExplainabilityService()
