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
        // The API now handles FormData creation internally
        // We just need to pass the image URI
        await diagnosisApi.uploadScan(scan.image_uri);

        // Note: The backend will generate its own diagnosis
        // The local scan data is kept for offline viewing
        // but the canonical data comes from the backend
    }
}
