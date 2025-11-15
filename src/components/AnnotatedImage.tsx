/* eslint-disable react-hooks/set-state-in-effect */
import { Box } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import type { RoboflowPrediction } from '../types/roboflow';

interface AnnotatedImageProps {
  imageFile: File;
  predictions: RoboflowPrediction[];
  highlightNew?: boolean;
}

export default function AnnotatedImage({ imageFile, predictions, highlightNew = false }: AnnotatedImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!imageRef.current) return;

    const img = imageRef.current;
    const url = URL.createObjectURL(imageFile);

    setImageLoaded(false);

    const handleLoad = () => {
      //console.log('Image loaded:', imageFile.name, 'Size:', img.naturalWidth, 'x', img.naturalHeight);
      setImageLoaded(true);
    };

    img.onload = handleLoad;
    img.src = url;

    if (img.complete) {
      handleLoad();
    }

    return () => {
      URL.revokeObjectURL(url);
      img.onload = null;
    };
  }, [imageFile]);

  useEffect(() => {
    if (!imageLoaded || !canvasRef.current || !imageRef.current) {
      //console.log('Waiting for image to load...', { imageLoaded, canvas: !!canvasRef.current, image: !!imageRef.current });
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    if (!ctx || !img.naturalWidth || !img.naturalHeight) {
      //console.log('Canvas context or image dimensions not ready');
      return;
    }

    //console.log('Drawing', predictions.length, 'predictions on canvas');

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (predictions.length === 0) {
      //console.log('No predictions to draw');
      return;
    }

    predictions.forEach((prediction) => {
      const color = highlightNew ? '#EF4444' : '#3B82F6';

      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.fillStyle = color + '20';

      const x = prediction.x - prediction.width / 2;
      const y = prediction.y - prediction.height / 2;

      //console.log(`Drawing box ${index + 1}:`, { x, y, width: prediction.width, height: prediction.height, class: prediction.class });

      ctx.fillRect(x, y, prediction.width, prediction.height);
      ctx.strokeRect(x, y, prediction.width, prediction.height);

      ctx.fillStyle = color;
      ctx.font = 'bold 16px sans-serif';
      const label = `${prediction.class} ${(prediction.confidence * 100).toFixed(0)}%`;
      const textMetrics = ctx.measureText(label);

      ctx.fillRect(x, y - 25, textMetrics.width + 10, 25);
      ctx.fillStyle = 'white';
      ctx.fillText(label, x + 5, y - 7);
    });

    //console.log('Canvas drawing complete');
  }, [imageLoaded, predictions, highlightNew, imageFile]);

  return (
    <Box position="relative" w="full">
      <img
        ref={imageRef}
        alt="Vehicle"
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          borderRadius: '8px',
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
}
