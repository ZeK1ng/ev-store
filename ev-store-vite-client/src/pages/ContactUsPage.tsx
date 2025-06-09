import {
  Box,
  Button,
  SimpleGrid,
  Heading,
  Text,
  Icon,
  VStack,
  Container,
  Center,
  Flex
} from '@chakra-ui/react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const ContactUsPage = () => {
  const { t } = useTranslation('about')

  const phone = t('contact.phoneNumber');
  const email = t('contact.emailAddress');

  const googleMapsEmbedUrl =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2975.923744735644!2d44.78949057686309!3d41.76530187125435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40446de3589026f3%3A0xc590bb066828d470!2sYourStore.ge!5e0!3m2!1sen!2sge!4v1748774812053!5m2!1sen!2sge'

  return (
    <Box py={{ base: 8, md: 12 }}>
      <Container maxW="container.lg">
        <Heading as="h1" size="xl" textAlign="center" mb={4}>
          {t('contact.title')}
        </Heading>
        <Text fontSize="lg" textAlign="center" mb={6}>
          {t('contact.description')}
        </Text>

        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={8}>
          {/* Phone Card */}
          <Box p={6} textAlign="center" bg="whiteAlpha.200" borderRadius="lg" shadow="md">
            <VStack gap={4}>
              <Center mb={4}>
                <Flex
                  bg="#9CE94F"
                  p={4}
                  borderRadius="full"
                  align="center"
                  justify="center"
                >
                  <Icon as={FaPhone} boxSize={6} color="gray.950" />
                </Flex>
              </Center>

              <Heading size="md">
                {t('contact.phone')}
              </Heading>
              <Text fontSize="lg" fontWeight="semibold">
                {phone}
              </Text>
              <Button w="full" asChild>
                <a href={`tel:${phone}`}>
                  {t('contact.phoneButton')}
                </a>
              </Button>
            </VStack>
          </Box>

          {/* Email Card */}
          <Box p={6} textAlign="center" bg="whiteAlpha.200" borderRadius="lg" shadow="md">
            <VStack gap={4}>
              <Center mb={4}>
                <Flex
                  bg="#9CE94F"
                  p={4}
                  borderRadius="full"
                  align="center"
                  justify="center"
                >
                  <Icon as={FaEnvelope} boxSize={6} color="gray.950" />
                </Flex>
              </Center>
              <Heading size="md">
                {t('contact.email')}
              </Heading>
              <Text fontSize="lg" fontWeight="semibold">
                {email}
              </Text>
              <Button w="full" asChild>
                <a href={`mailto:${email}`}>
                  {t('contact.emailButton')}
                </a>
              </Button>
            </VStack>
          </Box>

          {/* Address Card */}
          <Box p={6} textAlign="center" bg="whiteAlpha.200" borderRadius="lg" shadow="md">
            <VStack gap={4}>
              <Center mb={4}>
                <Flex
                  bg="#9CE94F"
                  p={4}
                  borderRadius="full"
                  align="center"
                  justify="center"
                >
                  <Icon as={FaMapMarkerAlt} boxSize={6} color="gray.950" />
                </Flex>
              </Center>
              <Heading size="md">
                {t('contact.address')}
              </Heading>
              <Text fontSize="lg" fontWeight="semibold">
                {t('contact.addressName')}
              </Text>
              <Button w="full" asChild>
                <a href="https://maps.app.goo.gl/XqaUXpcvc7qfRW3w8" target="_blank">
                  {t('contact.mapButton')}
                </a>
              </Button>
            </VStack>
          </Box>
        </SimpleGrid>

        <Box borderRadius="lg" overflow="hidden">
          <Heading size="md" p={6}>
            {t('contact.mapTitle')}
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
