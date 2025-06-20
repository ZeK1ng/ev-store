import { Flex, HStack, VStack, Image, Separator, Stack, IconButton, Heading, Text, Box } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { LuFacebook, LuInstagram } from "react-icons/lu";
import { MdOutlineWhatsapp } from "react-icons/md";


const Footer = () => {
    const { t } = useTranslation('common');

    const phone = t('contact.phoneNumber');
    const email = t('contact.emailAddress');

    return (
        <Box as="footer" bg="gray.900" color="white" py={16} px={{ base: 4, md: 16 }}>
            <Separator borderColor="gray.600" mb={8} />

            <Box w="100%" maxW='1296px' mx="auto">


                <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" mb={8} >
                    <VStack align="flex-start" gap={4} mb={{ base: 8, md: 0 }}>
                        <Image boxSize="144px" src="/logos/footer-logo-dark.svg" alt="EV Store logo" />
                        <HStack gap={4}>
                            <IconButton aria-label="Facebook" variant="surface" size="xs">
                                <Link to="https://www.facebook.com/YourStoreGeo" target='_blank'>
                                    <LuFacebook />
                                </Link>
                            </IconButton>

                            <IconButton aria-label="Instagram" variant="surface" size="xs">
                                <Link to="https://www.instagram.com/YourStoreGeo" target='_blank'>
                                    <LuInstagram />
                                </Link>
                            </IconButton>

                            <IconButton aria-label="WhatsApp" variant="surface" size="xs">
                                <Link to={`https://wa.me/995568574455`} target='_blank'>
                                    <MdOutlineWhatsapp />
                                </Link>
                            </IconButton>




                        </HStack>
                    </VStack>

                    <VStack align="flex-start" gap={2} mb={{ base: 8, md: 0 }}>
                        <Heading size="lg" fontWeight="bold" mb={2}>
                            {t('footer.quickLinks')}
                        </Heading>
                        <Link color="white" to={t('footer.category1url')} target='_blank'>
                            {t('footer.category1name')}
                        </Link>
                        <Link color="white" to={t('footer.category2url')} target='_blank'>
                            {t('footer.category2name')}
                        </Link>
                        <Link color="white" to={t('footer.category3url')} target='_blank'>
                            {t('footer.category3name')}
                        </Link>
                        <Link color="white" to={t('footer.category4url')} target='_blank'>
                            {t('footer.category4name')}
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