/* eslint-disable react-hooks/set-state-in-effect */
import { Box, VStack, Text, Image, Icon } from '@chakra-ui/react';
import { useState, useRef, useEffect } from 'react';
import { FiUpload } from 'react-icons/fi';

interface ImageUploadProps {
  title: string;
  image: File | null;
  onImageSelect: (file: File | null) => void;
}

export default function ImageUpload({ title, image, onImageSelect }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!image) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(image);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [image]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <Box
      bg="white"
      borderWidth="2px"
      borderRadius="xl"
      borderColor={isDragging ? 'blue.500' : 'gray.300'}
      borderStyle="dashed"
      p={8}
      cursor="pointer"
      transition="all 0.2s"
      _hover={{
        borderColor: 'blue.400',
        bg: 'gray.50',
      }}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <VStack gap={4}>
        <Text fontSize="lg" fontWeight="semibold" color="gray.700">
          {title}
        </Text>

        {previewUrl ? (
          <Box position="relative" w="full">
            <Image
              src={previewUrl}
              alt={title}
              maxH="400px"
              w="full"
              objectFit="contain"
              borderRadius="md"
            />
          </Box>
        ) : (
          <VStack gap={3} py={8}>
            <Icon as={FiUpload} w={12} h={12} color="gray.400" />
            <VStack gap={1}>
              <Text color="gray.600" fontWeight="medium">
                Click to upload or drag and drop
              </Text>
              <Text color="gray.500" fontSize="sm">
                PNG, JPG, JPEG up to 10MB
              </Text>
            </VStack>
          </VStack>
        )}
      </VStack>
    </Box>
  );
}