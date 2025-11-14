export interface RoboflowPrediction {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  class: string;
  class_id: number;
}

export interface RoboflowResponse {
  time: number;
  image: {
    width: number;
    height: number;
  };
  predictions: RoboflowPrediction[];
}

export interface DamageDetectionResult {
  predictions: RoboflowPrediction[];
  imageWidth: number;
  imageHeight: number;
  processingTime: number;
}
