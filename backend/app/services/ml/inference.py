import numpy as np
from app.services.ml.model_manager import model_manager
from app.services.ml.image_processor import ImageProcessor
from app.core.config import settings
from typing import Dict, Optional
import logging

logger = logging.getLogger(__name__)


class InferenceService:
    """Disease prediction with confidence-aware diagnosis"""

    # PlantVillage dataset classes (39 classes total)
    # This is a sample - update with actual class names from your model
    CLASS_NAMES = [
        "Apple___Apple_scab",
        "Apple___Black_rot",
        "Apple___Cedar_apple_rust",
        "Apple___healthy",
        "Blueberry___healthy",
        "Cherry_(including_sour)___healthy",
        "Cherry_(including_sour)___Powdery_mildew",
        "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
        "Corn_(maize)___Common_rust_",
        "Corn_(maize)___healthy",
        "Corn_(maize)___Northern_Leaf_Blight",
        "Grape___Black_rot",
        "Grape___Esca_(Black_Measles)",
        "Grape___healthy",
        "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
        "Orange___Haunglongbing_(Citrus_greening)",
        "Peach___Bacterial_spot",
        "Peach___healthy",
        "Pepper,_bell___Bacterial_spot",
        "Pepper,_bell___healthy",
        "Potato___Early_blight",
        "Potato___healthy",
        "Potato___Late_blight",
        "Raspberry___healthy",
        "Soybean___healthy",
        "Squash___Powdery_mildew",
        "Strawberry___healthy",
        "Strawberry___Leaf_scorch",
        "Tomato___Bacterial_spot",
        "Tomato___Early_blight",
        "Tomato___healthy",
        "Tomato___Late_blight",
        "Tomato___Leaf_Mold",
        "Tomato___Septoria_leaf_spot",
        "Tomato___Spider_mites Two-spotted_spider_mite",
        "Tomato___Target_Spot",
        "Tomato___Tomato_mosaic_virus",
        "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
        "Tomato___healthy",
    ]

    @staticmethod
    def parse_class_name(class_name: str) -> tuple[str, str]:
        """
        Parse class name into crop and disease
        Example: "Tomato___Early_blight" -> ("Tomato", "Early blight")
        """
        parts = class_name.split("___")
        crop = parts[0].replace("_", " ")
        disease = parts[1].replace("_", " ") if len(parts) > 1 else "Unknown"
        
        # Clean up common patterns
        disease = disease.replace("(", "").replace(")", "")
        
        return crop, disease

    @staticmethod
    async def predict_disease(image_bytes: bytes) -> Dict:
        """
        Run disease prediction with confidence scoring
        """
        try:
            # 1. Validate image quality
            quality_metrics = ImageProcessor.validate_image(image_bytes)

            # 2. Load and preprocess image
            image = ImageProcessor.load_image(image_bytes)
            processed_image = ImageProcessor.preprocess_for_model(image)

            # 3. Run inference
            predictions = model_manager.predict(processed_image)

            # 4. Get top predictions
            predicted_class_idx = int(np.argmax(predictions[0]))
            confidence = float(predictions[0][predicted_class_idx])

            # Get top 3 predictions
            top_3_indices = np.argsort(predictions[0])[-3:][::-1]
            top_3_predictions = [
                {
                    "class_name": InferenceService.CLASS_NAMES[idx],
                    "confidence": float(predictions[0][idx]),
                    "crop_name": InferenceService.parse_class_name(
                        InferenceService.CLASS_NAMES[idx]
                    )[0],
                    "disease_name": InferenceService.parse_class_name(
                        InferenceService.CLASS_NAMES[idx]
                    )[1],
                }
                for idx in top_3_indices
            ]

            # 5. Parse predicted class
            crop_name, disease_name = InferenceService.parse_class_name(
                InferenceService.CLASS_NAMES[predicted_class_idx]
            )

            # 6. Determine if retry is needed
            needs_retry = None
            if confidence < settings.CONFIDENCE_THRESHOLD:
                needs_retry = "low_confidence"
            elif quality_metrics["quality_score"] < 50:
                needs_retry = "poor_quality"

            # 7. Build result
            result = {
                "crop_name": crop_name,
                "disease_name": disease_name,
                "confidence": round(confidence, 4),
                "is_healthy": "healthy" in disease_name.lower(),
                "needs_retry": needs_retry,
                "quality_metrics": quality_metrics,
                "top_3_predictions": top_3_predictions,
                "model_version": settings.MODEL_VERSION,
                "suggestions": [],
            }

            # 8. Add suggestions based on results
            if needs_retry == "low_confidence":
                result["suggestions"].extend([
                    "Try taking a photo from a different angle",
                    "Ensure the diseased area is clearly visible",
                    "Take multiple photos for better accuracy"
                ])
            
            if needs_retry == "poor_quality":
                result["suggestions"].extend(quality_metrics.get("issues", []))

            logger.info(f"Prediction: {crop_name} - {disease_name} ({confidence:.2%})")
            return result

        except Exception as e:
            logger.error(f"Prediction error: {str(e)}")
            raise


inference_service = InferenceService()
