import * as SQLite from 'expo-sqlite';

export interface ScanRecord {
    id?: number;
    crop_name: string;
    disease_name: string;
    confidence: number;
    image_uri: string;
    quality_score: number;
    latitude?: number;
    longitude?: number;
    timestamp: string;
    is_synced: number; // 0 for false, 1 for true
}

const DB_NAME = 'crop_diagnosis.db';

export class LocalDatabase {
    private static db: SQLite.SQLiteDatabase;

    static async init() {
        this.db = await SQLite.openDatabaseAsync(DB_NAME);

        await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS scans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        crop_name TEXT NOT NULL,
        disease_name TEXT NOT NULL,
        confidence REAL NOT NULL,
        image_uri TEXT NOT NULL,
        quality_score REAL NOT NULL,
        latitude REAL,
        longitude REAL,
        timestamp TEXT NOT NULL,
        is_synced INTEGER DEFAULT 0
      );
    `);
    }

    static async saveScan(scan: ScanRecord) {
        const result = await this.db.runAsync(
            `INSERT INTO scans (crop_name, disease_name, confidence, image_uri, quality_score, latitude, longitude, timestamp, is_synced) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                scan.crop_name,
                scan.disease_name,
                scan.confidence,
                scan.image_uri,
                scan.quality_score,
                scan.latitude || null,
                scan.longitude || null,
                scan.timestamp,
                scan.is_synced
            ]
        );
        return result.lastInsertRowId;
    }

    static async getUnsyncedScans(): Promise<ScanRecord[]> {
        return await this.db.getAllAsync<ScanRecord>(
            'SELECT * FROM scans WHERE is_synced = 0'
        );
    }

    static async markAsSynced(id: number) {
        await this.db.runAsync(
            'UPDATE scans SET is_synced = 1 WHERE id = ?',
            [id]
        );
    }

    static async getAllScans(): Promise<ScanRecord[]> {
        return await this.db.getAllAsync<ScanRecord>(
            'SELECT * FROM scans ORDER BY timestamp DESC'
        );
    }

    static async deleteScan(id: number) {
        await this.db.runAsync('DELETE FROM scans WHERE id = ?', [id]);
    }
}
