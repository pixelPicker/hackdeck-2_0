import tensorflow as tf
import argparse
import os

def convert_h5_to_tflite(h5_path, output_path):
    """
    Convert a Keras .h5 model to TensorFlow Lite format.
    """
    if not os.path.exists(h5_path):
        print(f"Error: File {h5_path} not found.")
        return

    print(f"Loading Keras model from {h5_path}...")
    model = tf.keras.models.load_model(h5_path)

    print("Converting to TFLite...")
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    
    # Optimization for mobile (Float16 quantization)
    converter.optimizations = [tf.lite.Optimize.DEFAULT]
    converter.target_spec.supported_types = [tf.float16]
    
    tflite_model = converter.convert()

    print(f"Saving TFLite model to {output_path}...")
    with open(output_path, 'wb') as f:
        f.write(tflite_model)
    
    print("Done! 🎉")
    print(f"Original size: {os.path.getsize(h5_path) / (1024*1024):.2f} MB")
    print(f"TFLite size: {os.path.getsize(output_path) / (1024*1024):.2f} MB")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Convert .h5 model to .tflite")
    parser.add_argument("--input", type=str, default="plant_disease_model.h5", help="Path to .h5 model")
    parser.add_argument("--output", type=str, default="backend/models/plant_disease_model.tflite", help="Path to save .tflite model")
    
    args = parser.parse_args()
    convert_h5_to_tflite(args.input, args.output)
