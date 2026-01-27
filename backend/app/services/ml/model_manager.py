import tensorflow as tf
import numpy as np
from pathlib import Path
from app.core.config import settings
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class ModelManager:
    """Manages TensorFlow Lite model loading and versioning"""

    def __init__(self):
        self.interpreter: Optional[tf.lite.Interpreter] = None
        self.input_details = None
        self.output_details = None
        self.current_version = settings.MODEL_VERSION
        self.load_model()

    def load_model(self, model_path: Optional[str] = None):
        """Load TensorFlow Lite model"""
        try:
            path = model_path or settings.MODEL_PATH
            
            if not Path(path).exists():
                logger.warning(f"Model file not found at {path}")
                return False

            # Load TFLite model and allocate tensors
            self.interpreter = tf.lite.Interpreter(model_path=path)
            self.interpreter.allocate_tensors()

            # Get input and output details
            self.input_details = self.interpreter.get_input_details()
            self.output_details = self.interpreter.get_output_details()

            logger.info(f"Model loaded successfully from {path}")
            logger.info(f"Input shape: {self.input_details[0]['shape']}")
            logger.info(f"Output shape: {self.output_details[0]['shape']}")
            
            return True

        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            return False

    def predict(self, image_array: np.ndarray) -> np.ndarray:
        """Run inference on preprocessed image"""
        if self.interpreter is None:
            raise RuntimeError("Model not loaded")

        # Ensure correct input shape
        input_shape = self.input_details[0]['shape']
        if image_array.shape != tuple(input_shape):
            raise ValueError(
                f"Input shape {image_array.shape} doesn't match model input {input_shape}"
            )

        # Set input tensor
        self.interpreter.set_tensor(
            self.input_details[0]['index'], 
            image_array.astype(np.float32)
        )

        # Run inference
        self.interpreter.invoke()

        # Get output
        output_data = self.interpreter.get_tensor(self.output_details[0]['index'])
        return output_data

    def get_model_info(self):
        """Return model metadata"""
        return {
            "version": self.current_version,
            "path": settings.MODEL_PATH,
            "input_shape": self.input_details[0]['shape'].tolist() if self.input_details else None,
            "output_shape": self.output_details[0]['shape'].tolist() if self.output_details else None,
        }


# Global model instance
model_manager = ModelManager()
