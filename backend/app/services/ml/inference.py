import numpy as np
import onnxruntime as ort
from app.services.ml.image_processor import ImageProcessor
from app.core.config import settings
from typing import Dict, Optional
from PIL import Image
import logging
from pathlib import Path

logger = logging.getLogger(__name__)


class ONNXInferenceService:
    """ONNX Runtime-based crop disease detection"""
    
    # PlantVillage 38 disease classes (matches trained model)
    CLASS_NAMES = [
        "Apple___Apple_scab",
        "Apple___Black_rot",
        "Apple___Cedar_apple_rust",
        "Apple___healthy",
        "Blueberry___healthy",
        "Cherry_(including_sour)___Powdery_mildew",
        "Corn_(maize)___Cercospora_leaf_spot_Gray_leaf_spot",
        "Corn_(maize)___Common_rust_",
        "Corn_(maize)___Northern_Leaf_Blight",
        "Corn_(maize)___healthy",
        "Grape___Black_rot",
        "Grape___Esca_(Black_Measles)",
        "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
        "Grape___healthy",
        "Orange___Haunglongbing_(Citrus_greening)",
        "Peach___Bacterial_spot",
        "Peach___healthy",
        "Pepper,_bell___Bacterial_spot",
        "Pepper,_bell___healthy",
        "Potato___Early_blight",
        "Potato___Late_blight",
        "Potato___healthy",
        "Raspberry___healthy",
        "Soybean___healthy",
        "Squash___Powdery_mildew",
        "Strawberry___Leaf_scorch",
        "Strawberry___healthy",
        "Tomato___Bacterial_spot",
        "Tomato___Early_blight",
        "Tomato___Late_blight",
        "Tomato___Leaf_Mold",
        "Tomato___Septoria_leaf_spot",
        "Tomato___Spider_mites_Two-spotted_spider_mite",
        "Tomato___Target_Spot",
        "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
        "Tomato___Tomato_mosaic_virus",
        "Tomato___healthy",
        "background"
    ]
    
    def __init__(self, model_path: str = "models/plant_disease_model.onnx"):
        """Initialize ONNX inference session"""
        self.model_path = Path(model_path)
        if not self.model_path.exists():
            logger.warning(f"Model not found at {model_path}, will fail on first prediction")
            self.session = None
        else:
            try:
                self.session = ort.InferenceSession(str(self.model_path))
                self.input_name = self.session.get_inputs()[0].name
                self.output_name = self.session.get_outputs()[0].name
                logger.info(f"✅ ONNX model loaded: {model_path}")
            except Exception as e:
                logger.error(f"Failed to load ONNX model: {e}")
                self.session = None
    
    @staticmethod
    def parse_class_name(class_name: str) -> tuple[str, str]:
        """Parse class name into crop and disease"""
        parts = class_name.split("___")
        crop = parts[0].replace("_", " ").replace("(", "").replace(")", "").strip()
        disease = parts[1].replace("_", " ") if len(parts) > 1 else "Unknown"
        disease = disease.replace("(", "").replace(")", "").strip()
        return crop, disease
    
    def preprocess_image(self, image: Image.Image) -> np.ndarray:
        """Preprocess image for ONNX model (256x256, ImageNet normalized)"""
        # Resize to 256x256
        img = image.resize((256, 256), Image.BILINEAR)
        
        # Convert to float32 array and normalize to [0, 1]
        img_array = np.array(img).astype(np.float32) / 255.0
        
        # ImageNet normalization
        mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
        std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
        img_array = (img_array - mean) / std
        
        # Convert HWC to CHW format
        img_array = np.transpose(img_array, (2, 0, 1))
        
        # Add batch dimension [1, 3, 256, 256]
        return np.expand_dims(img_array, axis=0).astype(np.float32)
    
    def softmax(self, logits: np.ndarray) -> np.ndarray:
        """Apply softmax to convert logits to probabilities"""
        exp_logits = np.exp(logits - np.max(logits))
        return exp_logits / np.sum(exp_logits)
    
    async def predict_disease(self, image_bytes: bytes) -> Dict:
        """Run disease prediction with confidence scoring"""
        if self.session is None:
            raise RuntimeError("ONNX model not loaded. Check model path.")
        
        try:
            # 1. Validate image quality
            quality_metrics = ImageProcessor.validate_image(image_bytes)
            
            # 2. Load image
            image = ImageProcessor.load_image(image_bytes)
            
            # 3. Preprocess for ONNX model
            input_tensor = self.preprocess_image(image)
            
            # 4. Run ONNX inference
            outputs = self.session.run([self.output_name], {self.input_name: input_tensor})
            logits = outputs[0][0]
            
            # 5. Apply softmax
            probabilities = self.softmax(logits)
            
            # 6. Get top prediction
            predicted_idx = int(np.argmax(probabilities))
            confidence = float(probabilities[predicted_idx])
            
            # 7. Get top 3 predictions
            top3_indices = np.argsort(probabilities)[-3:][::-1]
            top3_predictions = []
            for idx in top3_indices:
                crop, disease = self.parse_class_name(self.CLASS_NAMES[idx])
                top3_predictions.append({
                    "cropName": crop,
                    "diseaseName": disease,
                    "confidence": float(probabilities[idx])
                })
            
            # 8. Parse main prediction
            crop_name, disease_name = self.parse_class_name(self.CLASS_NAMES[predicted_idx])
            
            # 9. Determine if retry needed
            needs_retry = None
            if confidence < settings.CONFIDENCE_THRESHOLD:
                needs_retry = "low_confidence"
            elif quality_metrics["quality_score"] < 50:
                needs_retry = "poor_quality"
            
            # 10. Build result matching mobile app expected format
            result = {
                "cropName": crop_name,
                "diseaseName": disease_name,
                "confidence": round(confidence, 4),
                "isHealthy": "healthy" in disease_name.lower(),
                "qualityScore": quality_metrics["quality_score"],
                "needsRetry": needs_retry,
                "top3Predictions": top3_predictions,
                "modelVersion": settings.MODEL_VERSION,
                "suggestions": []
            }
            
            # 11. Add helpful suggestions
            if needs_retry == "low_confidence":
                result["suggestions"].extend([
                    "Try taking a photo from a different angle",
                    "Ensure the diseased area is clearly visible",
                    "Take multiple photos for better accuracy"
                ])
            
            if needs_retry == "poor_quality":
                result["suggestions"].extend(quality_metrics.get("issues", []))
            
            logger.info(f"✅ Prediction: {crop_name} - {disease_name} ({confidence:.2%})")
            return result
            
        except Exception as e:
            logger.error(f"❌ Prediction error: {str(e)}")
            raise


# Global instance
inference_service = ONNXInferenceService()
