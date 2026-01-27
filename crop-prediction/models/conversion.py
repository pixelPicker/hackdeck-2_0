import tensorflow as tf

# 1. Load the .h5 model saved by your notebook
model_path = 'EfficientNetB3-Plant Village Disease-99.60.h5' # Use the exact name from your output
model = tf.keras.models.load_model(model_path)

# 2. Initialize the converter
converter = tf.lite.TFLiteConverter.from_keras_model(model)

# 3. Apply "Shrinkage" (Quantization)
# This converts weights from 32-bit floats to 8-bit integers
converter.optimizations = [tf.lite.Optimize.DEFAULT]

# 4. Convert and save
tflite_quantized_model = converter.convert()
with open('plant_model_quantized.tflite', 'wb') as f:
    f.write(tflite_quantized_model)

print("Success! Your shrunken model is ready.")