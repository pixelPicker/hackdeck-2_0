import axios from 'axios';
import { Platform } from 'react-native';

// IMPORTANT: For physical devices, replace '192.168.x.x' with your computer's IP address
// Run 'ipconfig' (Windows) or 'ifconfig' (Mac/Linux) to find your local IP
// For emulators/simulators, the default values below work

const BASE_URL = Platform.select({
    android: 'http://10.0.2.2:8000/api/v1',  // Android emulator
    ios: 'http://localhost:8000/api/v1',      // iOS simulator
    default: 'http://192.168.1.12:8000/api/v1',  // Physical device - UPDATE THIS IP!
});

console.log('📡 API Base URL:', BASE_URL);

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,  // Increased timeout for file uploads
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface DiagnosisResult {
    cropName: string;
    diseaseName: string;
    confidence: number;
    isHealthy: boolean;
    qualityScore?: number;
}

export const diagnosisApi = {
    uploadScan: async (imageUri: string): Promise<DiagnosisResult> => {
        try {
            console.log('🔍 Starting upload:', imageUri);

            // Create FormData from image URI
            const formData = new FormData();

            const filename = imageUri.split('/').pop() || 'image.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image/jpeg';

            console.log('📁 File info:', { filename, type });

            // Backend expects 'image' field, not 'file'
            formData.append('image', {
                uri: imageUri,
                name: filename,
                type,
            } as any);

            console.log('📤 Uploading to:', '/diagnosis/upload');

            const response = await api.post<DiagnosisResult>('/diagnosis/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 60000,  // 60 second timeout for file upload
            });

            console.log('✅ Upload successful:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('❌ Upload failed:', {
                message: error.message,
                code: error.code,
                response: error.response?.data,
                status: error.response?.status,
            });
            throw error;
        }
    },

    getNearbyAlerts: async (lat: number, lon: number) => {
        return await api.get('/alerts/nearby', {
            params: { latitude: lat, longitude: lon },
        });
    },

    getLatestModel: async () => {
        return await api.get('/models/latest');
    },
};

export default api;
