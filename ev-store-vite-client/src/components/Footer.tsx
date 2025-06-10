import { Flex, HStack, VStack, Image, Separator, Stack, IconButton, Heading, Text, Box } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaTwitter } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';


const Footer = () => {
    const { t } = useTranslation('common');

    const phone = t('contact.phoneNumber');
    const email = t('contact.emailAddress');

    return (
        <Box as="footer" bg="gray.900" color="white" py={16} px={{ base: 4, md: 16 }}>
            <Separator borderColor="gray.600" mb={8} />

            <Box w="100%" maxW='1296px' justifySelf="center">


                <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" mb={8} >
                    <VStack align="flex-start" gap={4} mb={{ base: 8, md: 0 }}>
                        <Image boxSize="144px" src="/logos/footer-logo-dark.svg" alt="EV Store logo" />
                        <HStack gap={4}>
                            <IconButton aria-label="Facebook" variant="surface" size="xs">
                                <Link to="https://www.facebook.com/YourStoreGeo" target='_blank'>
                                    <FaFacebook />
                                </Link>
                            </IconButton>

                            <IconButton aria-label="Twitter" variant="surface" size="xs">
                                <Link to="https://twitter.com/YourStoreGeo" target='_blank'>
                                    <FaTwitter />
                                </Link>
                            </IconButton>

                            <IconButton aria-label="Instagram" variant="surface" size="xs">
                                <Link to="https://www.instagram.com/YourStoreGeo" target='_blank'>
                                    <FaInstagram />
                                </Link>
                            </IconButton>
                        </HStack>
                    </VStack>

                    <VStack align="flex-start" gap={2} mb={{ base: 8, md: 0 }}>
                        <Heading size="sm" fontWeight="bold">
                            {t('footer.quickLinks')}
                        </Heading>
                        <Link color="white" to={t('footer.category1url')}>
                            {t('footer.category1name')}
                        </Link>
                        <Link color="white" to={t('footer.category2url')}>
                            {t('footer.category2name')}
                        </Link>
                        <Link color="white" to={t('footer.category3url')}>
                            {t('footer.category3name')}
                        </Link>
                    </VStack>

                    <VStack align="flex-start" gap={2}>
                        <HStack align="center">
                            <FaMapMarkerAlt />
                            <Text>
                                <a href="https://maps.app.goo.gl/XqaUXpcvc7qfRW3w8" target="_blank">
                                    {t('footer.address')}
                                </a>
                            </Text>
                        </HStack>
                        <HStack align="center">
                            <FaPhoneAlt />
                            <Text>
                                <a href={`tel:${phone}`}>
                                    {t('footer.phone')}
                                </a>
                            </Text>
                        </HStack>
                        <HStack align="center">
                            <FaEnvelope />
                            <Text>
                                <a href={`mailto:${email}`}>
                                    {t('footer.email')}
                                </a>
                            </Text>
                        </HStack>
                    </VStack>
                </Flex>

                <Separator borderColor="gray.600" mb={4} />

                <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align="center">
                    <Stack
                        direction={{ base: 'column', md: 'row' }}
                        gap={6}
                        mb={{ base: 4, md: 0 }}
                        width={{ base: '100%', md: 'auto' }}
                        align={{ base: 'flex-start', md: 'center' }}
                    >
                        <Link color="white" to="/about-us">
                            {t('footer.aboutUs')}
                        </Link>
                        <Link color="white" to="/catalog">
                            {t('footer.catalog')}
                        </Link>
                        <Link color="white" to="/contact-us">
                            {t('footer.contactUs')}
                        </Link>
                    </Stack>
                    <Text fontSize="sm" textAlign={{ base: 'left', md: 'right' }}>
                        © 2025 • EV Store
                    </Text>
                </Flex>
            </Box>

        </Box>
    )
}

export default Footer;