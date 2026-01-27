// Note: For React Native TFLite inference, you'll need react-native-fast-tflite
// Install: npx expo install react-native-fast-tflite

import * as FileSystem from 'expo-file-system';

export interface InferenceResult {
    cropName: string;
    diseaseName: string;
    confidence: number;
    isHealthy: boolean;
    top3Predictions: Array<{
        cropName: string;
        diseaseName: string;
        confidence: number;
    }>;
}

// PlantVillage 39 classes
const CLASS_NAMES = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
    "Blueberry___healthy",
    "Cherry_(including_sour)___healthy",
    "Cherry_(including_sour)___Powdery_mildew",
    "Corn_(maize)___Cercospora_leaf_spot",
    "Corn_(maize)___Common_rust",
    "Corn_(maize)___healthy",
    "Corn_(maize)___Northern_Leaf_Blight",
    "Grape___Black_rot",
    "Grape___Esca_(Black_Measles)",
    "Grape___healthy",
    "Grape___Leaf_blight",
    "Orange___Huanglongbing",
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
    "Tomato___Spider_mites",
    "Tomato___Target_Spot",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___healthy",
];

export class InferenceService {
    private static modelPath: string | null = null;
    private static isInitialized = false;

    static async init() {
        // Model will be downloaded or bundled with the app
        const modelUri = `${FileSystem.documentDirectory}plant_disease_model.tflite`;

        // Check if model exists
        const fileInfo = await FileSystem.getInfoAsync(modelUri);
        if (fileInfo.exists) {
            this.modelPath = modelUri;
            this.isInitialized = true;
            console.log('Model loaded from:', modelUri);
        } else {
            console.warn('Model not found. Download it first.');
            this.isInitialized = false;
        }
    }

    static async downloadModel(downloadUrl: string): Promise<void> {
        const modelUri = `${FileSystem.documentDirectory}plant_disease_model.tflite`;

        console.log('Downloading model from:', downloadUrl);
        const downloadResumable = FileSystem.createDownloadResumable(
            downloadUrl,
            modelUri,
            {},
            (downloadProgress) => {
                const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
                console.log(`Download progress: ${(progress * 100).toFixed(1)}%`);
            }
        );

        await downloadResumable.downloadAsync();
        this.modelPath = modelUri;
        this.isInitialized = true;
        console.log('Model downloaded successfully');
    }

    static async predict(imageUri: string): Promise<InferenceResult> {
        if (!this.isInitialized || !this.modelPath) {
            throw new Error('Model not initialized. Call InferenceService.init() first.');
        }

        // TODO: Integrate with react-native-fast-tflite or tfjs
        // For now, this is a placeholder that shows the structure

        // Simulated inference (replace with actual TFLite call)
        const mockPrediction = this.mockInference();

        return mockPrediction;
    }

    private static mockInference(): InferenceResult {
        // This is a placeholder - replace with actual TFLite inference
        const predictions = CLASS_NAMES.map((_, idx) => Math.random());
        const topIdx = predictions.indexOf(Math.max(...predictions));
        const confidence = predictions[topIdx];

        const top3Indices = predictions
            .map((conf, idx) => ({ conf, idx }))
            .sort((a, b) => b.conf - a.conf)
            .slice(0, 3);

        const parseClassName = (className: string) => {
            const parts = className.split('___');
            return {
                cropName: parts[0].replace(/_/g, ' '),
                diseaseName: parts[1]?.replace(/_/g, ' ') || 'Unknown',
            };
        };

        const primary = parseClassName(CLASS_NAMES[topIdx]);

        return {
            cropName: primary.cropName,
            diseaseName: primary.diseaseName,
            confidence,
            isHealthy: primary.diseaseName.toLowerCase().includes('healthy'),
            top3Predictions: top3Indices.map(({ idx, conf }) => {
                const parsed = parseClassName(CLASS_NAMES[idx]);
                return {
                    cropName: parsed.cropName,
                    diseaseName: parsed.diseaseName,
                    confidence: conf,
                };
            }),
        };
    }

    static parseClassName(className: string) {
        const parts = className.split('___');
        return {
            cropName: parts[0].replace(/_/g, ' '),
            diseaseName: parts[1]?.replace(/_/g, ' ') || 'Unknown',
        };
    }
}
