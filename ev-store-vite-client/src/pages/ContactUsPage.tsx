import React from 'react';
import {
  Box,
  Button,
  SimpleGrid,
  Stack,
  Heading,
  Text,
  Icon,
  VStack,
  Container,
} from '@chakra-ui/react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const ContactUsPage: React.FC = () => {
  // Replace these with real data if needed
  const phone = '+995 568-698-300';
  const email = 'info@yourstore.com';
  const addressLines = ['9a, David Guramishvili Ave', 'Tbilisi'];

  // Google Maps embed URL for your store location
  const googleMapsEmbedUrl =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2975.923744735644!2d44.78949057686309!3d41.76530187125435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40446de3589026f3%3A0xc590bb066828d470!2sYourStore.ge!5e0!3m2!1sen!2sge!4v1748774812053!5m2!1sen!2sge'


  return (
    <Box py={{ base: 8, md: 12 }}>
      <Container maxW="container.lg">
        <Text fontSize="lg" textAlign="center" mb={6}>
          Get in touch with us or visit our store location.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={8}>
          {/* Phone Card */}
          <Box borderRadius="lg" p={6} textAlign="center">
            <VStack gap={4}>
              <Icon as={FaPhone} boxSize={8} color="blue.400" />
              <Heading size="md">Phone</Heading>
              <Text fontSize="lg" fontWeight="semibold">
                {phone}
              </Text>
              <Button w="full">
                Call Now
              </Button>
            </VStack>
          </Box>

          {/* Email Card */}
          <Box borderRadius="lg" p={6} textAlign="center">
            <VStack gap={4}>
              <Icon as={FaEnvelope} boxSize={8} color="green.400" />
              <Heading size="md">Email</Heading>
              <Text fontSize="lg" fontWeight="semibold">
                {email}
              </Text>
              <Button w="full" as="a">
                Send Email
              </Button>
            </VStack>
          </Box>

          {/* Address Card */}
          <Box borderRadius="lg" p={6} textAlign="center">
            <VStack gap={4}>
              <Icon as={FaMapMarkerAlt} boxSize={8} color="red.400" />
              <Heading size="md">Address</Heading>
              <Stack gap={1}>
                {addressLines.map((line, idx) => (
                  <Text key={idx} fontSize="md">
                    {line}
                  </Text>
                ))}
              </Stack>
            </VStack>
          </Box>
        </SimpleGrid>

        <Box borderRadius="lg" overflow="hidden">
          <Heading size="md" p={6}>
            Find Our Store
          </Heading>
          <iframe
            src={googleMapsEmbedUrl}
            width="100%"
            height="400px"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
          />
        </Box>
      </Container>
    </Box>
  );
};

export default ContactUsPage;
