import { Box, Container, Heading, Text, SimpleGrid, Button, HStack } from '@chakra-ui/react';
import { useState } from 'react';
import { Provider } from './components/ui/provider';
import ImageUpload from './components/ImageUpload';

function App() {
  const [pickupImage, setPickupImage] = useState<File | null>(null);
  const [returnImage, setReturnImage] = useState<File | null>(null);

  const canAnalyze = pickupImage && returnImage;

  const handleAnalyze = () => {
    if (!canAnalyze) return;
    console.log('Analyzing images...');
  };

  const handleReset = () => {
    setPickupImage(null);
    setReturnImage(null);
  };

  return (
    <Provider>
      <Box minH="100vh" bg="gray.50" width="100vw" >
        <Container width="100vw" height="100vh" py={12}>
          <Box mb={12} textAlign="center">
            <Heading size="2xl" mb={3} color="gray.800">
              Vehicle Damage Inspector
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Upload pickup and return photos to detect new damage
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={8} mb={8}>
            <ImageUpload
              title="Pickup Inspection"
              image={pickupImage}
              onImageSelect={setPickupImage}
            />
            <ImageUpload
              title="Return Inspection"
              image={returnImage}
              onImageSelect={setReturnImage}
            />
          </SimpleGrid>

          <HStack justify="center" gap={4}>
            <Button
              size="lg"
              background={'blue'}
              color={'white'}
              disabled={!canAnalyze}
              onClick={handleAnalyze}
              px={12}
            >
              Analyze Damage
            </Button>
            <Button
              size="lg"
              variant="outline"
              color={'white'}
              onClick={handleReset}
            >
              Reset
            </Button>
          </HStack>
        </Container>
      </Box>
    </Provider>
  );
}

export default App;