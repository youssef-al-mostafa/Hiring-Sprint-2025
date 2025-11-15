export interface Point {
  x: number;
  y: number;
}

export interface RoboflowPrediction {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  class: string;
  class_id: number;
  points?: Point[];
  detection_id?: string;
}

export interface RoboflowResponse {
  inference_id: string;
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
