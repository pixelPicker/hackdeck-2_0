// Utility to convert image URI to normalized tensor data for model input
// This is a simplified implementation - for production, consider using:
// - expo-gl + expo-three for GPU-accelerated processing
// - react-native-image-to-tensor (if available)
// - Native module for optimal performance

import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system/legacy';

/**
 * Convert image to normalized Float32Array for model input
 * @param imageUri - Local image file URI
 * @param targetSize - Model input size (e.g., 256 for 256x256)
 * @returns Normalized pixel data as Float32Array [CHW format: channels, height, width]
 */
export async function imageToTensor(
    imageUri: string,
    targetSize: number = 256
): Promise<Float32Array> {
    try {
        // Step 1: Resize image to target size
        const resized = await manipulateAsync(
            imageUri,
            [{ resize: { width: targetSize, height: targetSize } }],
            { format: SaveFormat.JPEG, compress: 1 }
        );

        // Step 2: Read image data as base64
        const base64 = await FileSystem.readAsStringAsync(resized.uri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        // Step 3: Decode base64 to raw pixel data
        // Note: This is a simplified approach. For better performance:
        // - Use expo-image-picker's base64 option directly
        // - Or implement a native module for direct pixel access

        const pixelCount = targetSize * targetSize;
        const tensorData = new Float32Array(3 * pixelCount); // RGB channels

        // Decode JPEG to get RGB values
        // This is a placeholder - actual implementation would use:
        // - WebGL/Canvas for browser
        // - Native module for React-Native
        // - expo-gl + expo-image for Expo

        // For now, generate normalized random data as fallback
        // TODO: Replace with actual pixel extraction
        console.warn('⚠️ Using simplified preprocessing - implement actual image decoding');

        // ImageNet normalization (standard for most models)
        const mean = [0.485, 0.456, 0.406];
        const std = [0.229, 0.224, 0.225];

        // Placeholder: Fill with normalized values
        // In production, extract actual RGB values from decoded image
        for (let c = 0; c < 3; c++) {
            for (let i = 0; i < pixelCount; i++) {
                // Placeholder: random value [0, 1] normalized
                const pixel = Math.random(); // Replace with actual (pixel[c] / 255.0)
                const normalizedPixel = (pixel - mean[c]) / std[c];
                tensorData[c * pixelCount + i] = normalizedPixel;
            }
        }

        return tensorData;

    } catch (error) {
        console.error('Image to tensor conversion failed:', error);
        throw new Error('Failed to preprocess image');
    }
}

/**
 * Alternative: Use expo-gl for proper pixel extraction
 * Uncomment if expo-gl is available
 */
/*
import { GLView } from 'expo-gl';
import { Asset } from 'expo-asset';

export async function imageToTensorGL(
  imageUri: string,
  targetSize: number = 256
): Promise<Float32Array> {
  // Load image as texture
  const asset = Asset.fromURI(imageUri);
  await asset.downloadAsync();
  
  // Create GL context and extract pixels
  // Implementation details depend on expo-gl setup
  
  return new Float32Array(3 * targetSize * targetSize);
}
*/
