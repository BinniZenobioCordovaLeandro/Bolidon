import { Storage } from '@google-cloud/storage';
import cors from 'cors';
import express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

interface PlateData {
  [key: string]: string;
}

const FILE_EXTENSION = '.json';

admin.initializeApp();
const storage = new Storage();
const bucket = storage.bucket(`${admin.app().options.projectId}.appspot.com`);

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

const getExistingPlateData = async (plateNumber: string): Promise<PlateData> => {
  const fileName = `plates/${plateNumber}${FILE_EXTENSION}`;
  const file = bucket.file(fileName);

  const [exists] = await file.exists();
  if (!exists) return {};

  const [content] = await file.download();
  return JSON.parse(content.toString());
};

const savePlateDataToBucket = async (plateNumber: string, data: PlateData): Promise<void> => {
  const fileName = `plates/${plateNumber}${FILE_EXTENSION}`;
  const file = bucket.file(fileName);

  const dataWithTimestamp: PlateData = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  await file.save(JSON.stringify(dataWithTimestamp, null, 2));
  await file.makePublic();
};

app.post('/plates/:plateNumber', async (req: express.Request, res: express.Response) => {
  try {
    const { plateNumber } = req.params;
    const maintenanceData: PlateData = req.body;

    if (!plateNumber || !maintenanceData) {
      res.status(400).json({ error: 'Missing required data' });
      return;
    }

    const existingData = await getExistingPlateData(plateNumber);
    const mergedData: PlateData = { ...maintenanceData, ...existingData };

    await savePlateDataToBucket(plateNumber, mergedData);

    res.json({
      success: true,
      message: 'Plate data saved successfully',
      plateNumber,
    });
  } catch (error) {
    console.error('Error saving plate data:', error);
    res.status(500).json({ 
      error: 'Failed to save plate data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export const api = functions.https.onRequest(app);
