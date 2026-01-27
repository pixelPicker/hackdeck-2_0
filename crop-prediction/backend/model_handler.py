import numpy as np
import tensorflow as tf
from PIL import Image
import io
import os 
MODEL_PATH_TFLITE = "models/plant_model.tflite"
MODEL_PATH_H5 = "models/plant_model.h5"

def load_model():
    if os.path.exists(MODEL_PATH_TFLITE):
        interpreter = tf.lite.Interpreter(model_path=MODEL_PATH_TFLITE)
        interpreter.allocate_tensors()
        return interpreter, "TFLITE"
    else:
        model = tf.keras.models.load_model(MODEL_PATH_H5)
        return model, "H5"

def predict_image(model, model_type, image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).resize((224, 224))
    img_array = np.expand_dims(np.array(img, dtype=np.float32) / 255.0, axis=0)

    if model_type == "TFLITE":
        input_details = model.get_input_details()
        output_details = model.get_output_details()
        model.set_tensor(input_details[0]['index'], img_array)
        model.invoke()
        prediction = model.get_tensor(output_details[0]['index'])
    else:
        prediction = model.predict(img_array)

    return int(np.argmax(prediction)), float(np.max(prediction))

# def load_model():
#     print("⚠️ WARNING: No model file found. Running in MOCK MODE for testing.")
#     return None, "MOCK"

# def predict_image(model, model_type, image_bytes):
#     # Instead of running AI, we just return a fake index (e.g., 15 for Tomato)
#     # and a fake confidence score.
#     mock_index = 15 
#     mock_confidence = 0.98
#     return mock_index, mock_confidence