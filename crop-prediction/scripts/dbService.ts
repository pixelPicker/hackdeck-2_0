import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { Asset } from 'expo-asset';

/**
 * This function replaces your FastAPI /diagnose endpoint.
 * It takes the raw prediction array, finds the top result,
 * and fetches the treatment from your SQLite DB.
 */
export const diagnoseOffline = async (outputArray: number[]) => {
  // 1. ARGMAX: Find the index of the highest probability
  const predictedIndex = outputArray.indexOf(Math.max(...outputArray));
  
  // 2. CONFIDENCE: Get the highest probability value
  const confidence = (Math.max(...outputArray) * 100).toFixed(2);

  // 3. DATABASE LOOKUP: Connect to your bundled SQLite file
  const dbName = 'plant_village.db';
  const dbFolder = `${FileSystem.documentDirectory}SQLite`;
  const dbPath = `${dbFolder}/${dbName}`;

  // Ensure database is in the writable directory
  const folderInfo = await FileSystem.getInfoAsync(dbFolder);
  if (!folderInfo.exists) {
    await FileSystem.makeDirectoryAsync(dbFolder, { intermediates: true });
  }

  // Copy from assets to local storage if it's the first time
  const asset = Asset.fromModule(require('../assets/plant_village.db'));
  await asset.downloadAsync();
  await FileSystem.copyAsync({ from: asset.localUri!, to: dbPath });

  // 4. QUERY: Get the JSON data for that index
  const db = await SQLite.openDatabaseAsync(dbName);
  const info: any = await db.getFirstAsync(
    'SELECT * FROM diseases WHERE id = ?', 
    [predictedIndex]
  );

  // 5. RETURN: Format the response exactly like your old FastAPI JSON
  return {
    diagnosis: info ? info.disease_name : "Unknown Disease",
    treatment: info ? info.treatment : "Consult an expert for advice.",
    confidence: `${confidence}%`,
    index: predictedIndex
  };
};