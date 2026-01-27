import axios from 'axios';
import { Platform } from 'react-native';

// In physical device, use your machine's IP address instead of localhost
// In Android emulator, 10.0.2.2 is the alias for host machine
const BASE_URL = Platform.select({
    android: 'http://10.0.2.2:8000/api/v1',
    ios: 'http://localhost:8000/api/v1',
    default: 'http://localhost:8000/api/v1',
});

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const diagnosisApi = {
    uploadScan: async (formData: FormData) => {
        return await api.post('/diagnosis/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
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
