import { Box } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { RoboflowPrediction } from '../types/roboflow';

interface AnnotatedImageProps {
  imageFile: File;
  predictions: RoboflowPrediction[];
  highlightNew?: boolean;
}

export default function AnnotatedImage({ imageFile, predictions, highlightNew = false }: AnnotatedImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    if (!ctx) return;

    const drawAnnotations = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      predictions.forEach((prediction) => {
        const color = highlightNew ? '#EF4444' : '#3B82F6';

        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.fillStyle = color + '20';

        const x = prediction.x - prediction.width / 2;
        const y = prediction.y - prediction.height / 2;

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
    };

    if (img.complete) {
      drawAnnotations();
    } else {
      img.onload = drawAnnotations;
    }
  }, [predictions, highlightNew]);

  useEffect(() => {
    if (!imageRef.current) return;

    const url = URL.createObjectURL(imageFile);
    imageRef.current.src = url;

    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

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
