import axios from 'axios';
import type { DamageDetectionResult } from '../types/roboflow';

const API_KEY = import.meta.env.VITE_ROBOFLOW_API_KEY;
const MODEL = import.meta.env.VITE_ROBOFLOW_MODEL;
const VERSION = import.meta.env.VITE_ROBOFLOW_VERSION;

const BASE_URL = 'https://serverless.roboflow.com';

export class RoboflowService {
  private static toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = error => reject(error);
    });
  }

  static async detectDamage(imageFile: File): Promise<DamageDetectionResult> {
    if (!API_KEY) {
      throw new Error('Roboflow API key not configured');
    }

    try {
      const base64Image = await this.toBase64(imageFile);

      const response = await axios({
        method: 'POST',
        url: `${BASE_URL}/${MODEL}/${VERSION}`,
        params: {
          api_key: API_KEY,
        },
        data: base64Image,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return {
        predictions: response.data.predictions,
        imageWidth: response.data.image.width,
        imageHeight: response.data.image.height,
        processingTime: response.data.time,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new Error(`Roboflow API error: ${message}`);
      }
      throw error;
    }
  }

  static async compareDamage(
    pickupImage: File,
    returnImage: File
  ): Promise<{
    pickupDamage: DamageDetectionResult;
    returnDamage: DamageDetectionResult;
    newDamage: DamageDetectionResult['predictions'];
  }> {
    const [pickupResult, returnResult] = await Promise.all([
      this.detectDamage(pickupImage),
      this.detectDamage(returnImage),
    ]);

    const newDamage = returnResult.predictions.filter(returnPred => {
      const existsInPickup = pickupResult.predictions.some(
        pickupPred =>
          Math.abs(pickupPred.x - returnPred.x) < 50 &&
          Math.abs(pickupPred.y - returnPred.y) < 50 &&
          pickupPred.class === returnPred.class
      );
      return !existsInPickup;
    });

    return {
      pickupDamage: pickupResult,
      returnDamage: returnResult,
      newDamage,
    };
  }
}
