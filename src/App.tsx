import { Box, Container, Heading, Text, SimpleGrid, Button, HStack, Spinner, Alert } from '@chakra-ui/react';
import { useState } from 'react';
import { Provider } from './components/ui/provider';
import ImageUpload from './components/ImageUpload';
import AnnotatedImage from './components/AnnotatedImage';
import { RoboflowService } from './services/roboflow';
import type { DamageDetectionResult, RoboflowPrediction } from './types/roboflow';

interface AnalysisResult {
  pickupDamage: DamageDetectionResult;
  returnDamage: DamageDetectionResult;
  newDamage: RoboflowPrediction[];
}

function App() {
  const [pickupImage, setPickupImage] = useState<File | null>(null);
  const [returnImage, setReturnImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const canAnalyze = pickupImage && returnImage;

  const handleAnalyze = async () => {
    if (!canAnalyze) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await RoboflowService.compareDamage(pickupImage, returnImage);
      setResult(analysis);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to analyze images';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPickupImage(null);
    setReturnImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <Provider>
      <Box minH="100vh" bg="gray.50" w="100%">
        <Container maxW="container.xl" py={8} px={{ base: 4, md: 8 }}>
          <Box mb={8} textAlign="center">
            <Heading size="2xl" mb={2} color="gray.800">
              Vehicle Damage Inspector
            </Heading>
            <Text fontSize="md" color="gray.600">
              {result ? 'Inspection Results' : 'Upload pickup and return photos to detect new damage'}
            </Text>
          </Box>

          {!result && !loading && (
            <>
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
                  background="blue.600"
                  color="white"
                  disabled={!canAnalyze}
                  onClick={handleAnalyze}
                  px={12}
                  _hover={{ bg: 'blue.700' }}
                >
                  Analyze Damage
                </Button>
                {(pickupImage || returnImage) && (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleReset}
                  >
                    Clear
                  </Button>
                )}
              </HStack>
            </>
          )}

          {loading && (
            <Box textAlign="center" py={20}>
              <Spinner size="xl" color="blue.600" mb={4} />
              <Text fontSize="lg" color="gray.600">Analyzing images...</Text>
              <Text fontSize="sm" color="gray.500" mt={2}>This may take a few seconds</Text>
            </Box>
          )}

          {error && !result && (
            <Box textAlign="center" py={8}>
              <Alert.Root status="error" mb={6}>
                <Alert.Title>Error</Alert.Title>
                <Alert.Description>{error}</Alert.Description>
              </Alert.Root>
              <Button
                size="lg"
                background="blue.600"
                color="white"
                onClick={handleReset}
                _hover={{ bg: 'blue.700' }}
              >
                Try Again
              </Button>
            </Box>
          )}

          {result && pickupImage && returnImage && !loading && (
            <Box bg="white" p={8} borderRadius="xl" boxShadow="sm">

              <Heading size="md" mb={4}>Visual Damage Detection</Heading>
              <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6} mb={8}>
                <Box>
                  <Text fontSize="sm" fontWeight="semibold" mb={3} color="gray.700">
                    Pickup Inspection
                  </Text>
                  <AnnotatedImage
                    imageFile={pickupImage}
                    predictions={result.pickupDamage.predictions}
                  />
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="semibold" mb={3} color="gray.700">
                    Return Inspection (New Damages Highlighted)
                  </Text>
                  <AnnotatedImage
                    imageFile={returnImage}
                    predictions={result.newDamage}
                    highlightNew={true}
                  />
                </Box>
              </SimpleGrid>

              {result.newDamage.length > 0 ? (
                <Box>
                  <Heading size="md" mb={3}>New Damage Details</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                    {result.newDamage.map((damage, index) => (
                      <Box key={index} p={4} bg="red.50" borderRadius="md" borderLeft="4px solid" borderColor="red.500">
                        <Text fontWeight="bold" color="red.700">{damage.class}</Text>
                        <Text fontSize="sm" color="gray.600">
                          Confidence: {(damage.confidence * 100).toFixed(1)}%
                        </Text>
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>
              ) : (
                <Alert.Root status="success">
                  <Alert.Title>No New Damage Detected</Alert.Title>
                  <Alert.Description>
                    The vehicle appears to be in the same condition as pickup.
                  </Alert.Description>
                </Alert.Root>
              )}

              <Box mt={8} pt={6} borderTop="1px solid" borderColor="gray.200" textAlign="center">
                <Button
                  size="lg"
                  background="blue.600"
                  color="white"
                  onClick={handleReset}
                  px={12}
                  _hover={{ bg: 'blue.700' }}
                >
                  New Analysis
                </Button>
              </Box>
            </Box>
          )}
        </Container>
      </Box>
    </Provider>
  );
}

export default App;