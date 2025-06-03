import { Flex, HStack, VStack, Image, Separator, Stack, IconButton, Heading, Text, Box } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

import { FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaTwitter } from 'react-icons/fa';


const Footer = () => {
    return (
        <Box as="footer" bg="gray.900" color="white" py={16} px={{ base: 4, md: 16 }}>
            <Separator borderColor="gray.600" mb={8} />

            <Box w="100%" maxW='1296px' justifySelf="center">


                <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" mb={8} >
                    <VStack align="flex-start" gap={4} mb={{ base: 8, md: 0 }}>
                        <Image src="https://placehold.co/200x100" alt="EV Store logo" />
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
                        <Heading size="sm" fontWeight="bold">EV Store</Heading>
                        <Link color="white" to="/shop">Shop</Link>
                        <Link color="white" to="/charge-ev">Charge - EV</Link>
                        <Link color="white" to="/obd2-tools">OBD-II Diagnostic tools</Link>
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
                    <Stack
                        direction={{ base: 'column', md: 'row' }}
                        gap={6}
                        mb={{ base: 4, md: 0 }}
                        width={{ base: '100%', md: 'auto' }}
                        align={{ base: 'flex-start', md: 'center' }}
                    >
                        <Link color="white" to="/about">About us</Link>
                        <Link color="white" to="/contact">Contact us</Link>
                        <Link color="white" to="/terms">Terms & Conditions</Link>
                        <Link color="white" to="/privacy">Privacy Policy</Link>
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