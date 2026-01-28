"""
ONNX Runtime-based inference for crop disease detection
"""
import onnxruntime as ort
import numpy as np
from PIL import Image
from pathlib import Path
from typing import Dict, List, Tuple

# PlantVillage 38 disease classes
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


class ONNXInferenceService:
    """ONNX-based crop disease detection service"""
    
    def __init__(self, model_path: str = "models/plant_disease_model.onnx"):
        """Initialize ONNX inference session
        
        Args:
            model_path: Path to ONNX model file
        """
        self.model_path = Path(model_path)
        if not self.model_path.exists():
            raise FileNotFoundError(f"Model not found: {model_path}")
        
        # Create ONNX Runtime session
        self.session = ort.InferenceSession(str(self.model_path))
        self.input_name = self.session.get_inputs()[0].name
        self.output_name = self.session.get_outputs()[0].name
        
        print(f"✅ ONNX model loaded: {model_path}")
        print(f"   Input: {self.input_name}, Output: {self.output_name}")
    
    def preprocess_image(self, image_path: str) -> np.ndarray:
        """Preprocess image for model input
        
        Args:
            image_path: Path to input image
            
        Returns:
            Preprocessed image tensor (1, 3, 256, 256)
        """
        # Load and resize image
        img = Image.open(image_path).convert('RGB')
        img = img.resize((256, 256), Image.BILINEAR)
        
        # Convert to numpy array
        img_array = np.array(img).astype(np.float32) / 255.0
        
        # Normalize using ImageNet statistics
        mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
        std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
        img_array = (img_array - mean) / std
        
        # Convert to CHW format (Channels, Height, Width)
        img_array = np.transpose(img_array, (2, 0, 1))
        
        # Add batch dimension (1, 3, 256, 256)
        img_array = np.expand_dims(img_array, axis=0).astype(np.float32)
        
        return img_array
    
    def softmax(self, logits: np.ndarray) -> np.ndarray:
        """Apply softmax activation
        
        Args:
            logits: Raw model outputs
            
        Returns:
            Probability distribution
        """
        exp_logits = np.exp(logits - np.max(logits))
        return exp_logits / np.sum(exp_logits)
    
    def parse_class_name(self, class_name: str) -> Tuple[str, str]:
        """Parse class name into crop and disease
        
        Args:
            class_name: Class name in format "Crop___Disease"
            
        Returns:
            Tuple of (crop_name, disease_name)
        """
        parts = class_name.split('___')
        crop = parts[0].replace('_', ' ').replace('(', '').replace(')', '').strip()
        disease = parts[1].replace('_', ' ').strip() if len(parts) > 1 else 'Unknown'
        
        return crop, disease
    
    def predict(self, image_path: str) -> Dict:
        """Run inference on image
        
        Args:
            image_path: Path to input image
            
        Returns:
            Dictionary with prediction results
        """
        # Preprocess
        input_tensor = self.preprocess_image(image_path)
        
        # Run inference
        outputs = self.session.run([self.output_name], {self.input_name: input_tensor})
        logits = outputs[0][0]
        
        # Apply softmax
        probabilities = self.softmax(logits)
        
        # Get top prediction
        top_idx = int(np.argmax(probabilities))
        confidence = float(probabilities[top_idx])
        
        # Parse class name
        crop_name, disease_name = self.parse_class_name(CLASS_NAMES[top_idx])
        
        # Get top 3 predictions
        top3_indices = np.argsort(probabilities)[-3:][::-1]
        top3_predictions = []
        for idx in top3_indices:
            crop, disease = self.parse_class_name(CLASS_NAMES[idx])
            top3_predictions.append({
                'cropName': crop,
                'diseaseName': disease,
                'confidence': float(probabilities[idx])
            })
        
        return {
            'cropName': crop_name,
            'diseaseName': disease_name,
            'confidence': confidence,
            'isHealthy': 'healthy' in disease_name.lower(),
            'qualityScore': self.calculate_quality_score(image_path),
            'top3Predictions': top3_predictions
        }
    
    def calculate_quality_score(self, image_path: str) -> int:
        """Calculate image quality score (0-100)
        
        Args:
            image_path: Path to input image
            
        Returns:
            Quality score
        """
        try:
            img = Image.open(image_path)
            
            # Basic quality checks
            score = 100
            
            # Check resolution
            width, height = img.size
            if width < 200 or height < 200:
                score -= 30
            elif width < 500 or height < 500:
                score -= 15
            
            # Check aspect ratio (should be roughly square for leaves)
            aspect_ratio = max(width, height) / min(width, height)
            if aspect_ratio > 2.0:
                score -= 10
            
            return max(score, 0)
        except:
            return 50


# Global inference service instance
_inference_service = None


def get_inference_service() -> ONNXInferenceService:
    """Get or create global inference service instance"""
    global _inference_service
    if _inference_service is None:
        _inference_service = ONNXInferenceService()
    return _inference_service
