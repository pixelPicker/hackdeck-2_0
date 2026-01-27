import NetInfo from '@react-native-community/netinfo';
import { LocalDatabase, ScanRecord } from './local-db';
import { diagnosisApi } from './api';

export class SyncService {
    private static isSyncing = false;

    static async startAutoSync() {
        // Listen for network changes
        NetInfo.addEventListener((state: any) => {
            if (state.isConnected && state.isInternetReachable) {
                this.performSync();
            }
        });

        // Initial sync check
        const state = await NetInfo.fetch();
        if (state.isConnected && state.isInternetReachable) {
            this.performSync();
        }
    }

    static async performSync() {
        if (this.isSyncing) return;
        this.isSyncing = true;

        try {
            const unsyncedScans = await LocalDatabase.getUnsyncedScans();
            console.log(`Starting sync for ${unsyncedScans.length} scans...`);

            for (const scan of unsyncedScans) {
                try {
                    await this.syncOneScan(scan);
                    if (scan.id) {
                        await LocalDatabase.markAsSynced(scan.id);
                    }
                } catch (error) {
                    console.error(`Failed to sync scan ${scan.id}:`, error);
                }
            }
        } finally {
            this.isSyncing = false;
        }
    }

    private static async syncOneScan(scan: ScanRecord) {
        const formData = new FormData();

        // Prepare image for upload
        // Note: URI handling might need adjustment based on how Expo handles file uris
        const filename = scan.image_uri.split('/').pop() || 'image.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpg`;

        formData.append('image', {
            uri: scan.image_uri,
            name: filename,
            type: type,
        } as any);

        formData.append('crop_name', scan.crop_name);
        if (scan.latitude) formData.append('latitude', scan.latitude.toString());
        if (scan.longitude) formData.append('longitude', scan.longitude.toString());

        await diagnosisApi.uploadScan(formData);
    }
}
