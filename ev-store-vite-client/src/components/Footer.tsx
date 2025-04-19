import { Flex, HStack, VStack, Image, Separator, IconButton, Link, Heading, Text, Box } from '@chakra-ui/react'
import { FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaTwitter } from 'react-icons/fa';


const Footer = () => {
    return (
        <Box as="footer" bg="gray.800" color="white" py={16} px={{ base: 4, md: 16 }}>
            <Separator borderColor="gray.600" mb={8} />

            <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" mb={8}>
                <VStack align="flex-start" gap={4} mb={{ base: 8, md: 0 }}>
                    <Image src="https://placehold.co/200x100" alt="EV Store logo"/>
                    <HStack gap={4}>
                        <IconButton aria-label="Facebook" variant="surface" size="xs">
                            <Link href="https://www.facebook.com/YourStoreGeo" target='_blank'>
                                <FaFacebook />
                            </Link>
                        </IconButton>

                        <IconButton aria-label="Twitter" variant="surface" size="xs">
                            <Link href="https://twitter.com/YourStoreGeo" target='_blank'>
                                <FaTwitter />
                            </Link>
                        </IconButton>

                        <IconButton aria-label="Instagram" variant="surface" size="xs">
                            <Link href="https://www.instagram.com/YourStoreGeo" target='_blank'>
                                <FaInstagram />
                            </Link>
                        </IconButton>
                    </HStack>
                </VStack>

                <VStack align="flex-start" gap={2} mb={{ base: 8, md: 0 }}>
                    <Heading size="sm" fontWeight="bold">EV Store</Heading>
                    <Link color="white" href="/shop">Shop</Link>
                    <Link color="white" href="/charge-ev">Charge - EV</Link>
                    <Link color="white" href="/obd2-tools">OBD-II Diagnostic tools</Link>
                </VStack>

                <VStack align="flex-start" gap={2}>
                    <HStack align="center">
                        <FaMapMarkerAlt />
                        <Text>9a David Guramishvili Ave, Tbilisi 0178</Text>
                    </HStack>
                    <HStack align="center">
                        <FaPhoneAlt />
                        <Text>+995 568 69 83 00</Text>
                    </HStack>
                    <HStack align="center">
                        <FaEnvelope />
                        <Text>YourStoreGeo@gmail.com</Text>
                    </HStack>
                </VStack>
            </Flex>

            <Separator borderColor="gray.600" mb={4} />

            <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align="center">
                <HStack gap={6} mb={{ base: 4, md: 0 }}>
                    <Link color="white" href="/about">About us</Link>
                    <Link color="white" href="/contact">Contact us</Link>
                    <Link color="white" href="/terms">Terms & Conditions</Link>
                    <Link color="white" href="/privacy">Privacy Policy</Link>
                </HStack>
                <Text fontSize="sm">© 2025 • EV Store</Text>
            </Flex>
        </Box>
    )
}

export default Footer;