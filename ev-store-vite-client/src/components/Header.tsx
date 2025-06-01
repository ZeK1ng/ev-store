import React from 'react'
import {
    Box,
    Flex,
    HStack,
    IconButton,
    Button,
    Image,
    Heading,
    VStack,
    useDisclosure
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import LangSwitcher from '@/components/LangSwitcher'
import { useColorMode } from '@/components/ui/color-mode'
import { FaMoon, FaSun, FaSignInAlt, FaBars, FaWindowClose, FaUserAlt, FaShoppingCart } from 'react-icons/fa'

const Header: React.FC = () => {
    const { open, onOpen, onClose } = useDisclosure()
    const { colorMode, toggleColorMode } = useColorMode()


    return (
        <Box position="sticky" top={0} zIndex="2">
            <Flex
                as="header"
                align="center"
                justify="space-between"
                px={{ base: 4, md: 8 }}
                py={4}
                backdropFilter="saturate(200%) blur(15px)"
                style={{ WebkitBackdropFilter: 'saturate(200%) blur(15px)' }}
                shadow="lg"
                borderBottomWidth="1px">
                <Flex align="center">
                    <Image src="/vite.svg" alt="Logo" boxSize="40px" mr={2} />
                    <Heading size="md">My App</Heading>
                </Flex>

                <HStack gap={4} display={{ base: 'none', md: 'flex' }}>
                    <RouterLink to="/cms-admin">Admin</RouterLink>
                    <RouterLink to="/">Home</RouterLink>
                    <RouterLink to="/catalog">Catalog</RouterLink>
                    <RouterLink to="/about-us">About Us</RouterLink>
                    <RouterLink to="/contact-us">Contact</RouterLink>

                    <Button variant="outline" asChild>
                        <RouterLink to="/cart">
                            <FaShoppingCart />
                        </RouterLink>
                    </Button>

                    <Button variant="outline" asChild>
                        <RouterLink to="/login">
                            LogIn <FaSignInAlt />
                        </RouterLink>
                    </Button>

                    <Button variant="outline" asChild>
                        <RouterLink to="/profile">
                            Profile <FaUserAlt />
                        </RouterLink>
                    </Button>

                    <LangSwitcher />

                    <IconButton
                        aria-label="Toggle theme"
                        onClick={toggleColorMode}
                        variant="outline"
                    >
                        {colorMode === 'light' ? <FaMoon /> : <FaSun />}
                    </IconButton>
                </HStack>

                <IconButton
                    display={{ base: 'flex', md: 'none' }}
                    aria-label="Toggle menu"
                    onClick={open ? onClose : onOpen}
                    variant="ghost"
                >
                    {open ? <FaWindowClose /> : <FaBars />}
                </IconButton>
            </Flex>

            {
                open && (

                    <Box
                        position="absolute"
                        top="100%"
                        left={0}
                        width="100%"
                        shadow="lg"
                        zIndex="2"
                        backdropFilter="saturate(200%) blur(15px)"
                        style={{ WebkitBackdropFilter: 'saturate(200%) blur(15px)' }}
                    >
                        <VStack as="nav" gap={4} align="stretch" p={4}>
                            <RouterLink to="/" onClick={onClose}>Home</RouterLink>
                            <RouterLink to="/about-us" onClick={onClose}>About Us</RouterLink>
                            <RouterLink to="/contact-us" onClick={onClose}>Contact</RouterLink>

                            <Button
                                size="xl"
                                variant="surface"
                                asChild
                                onClick={onClose}
                            >
                                <RouterLink to="/cart">
                                    <FaShoppingCart />
                                </RouterLink>
                            </Button>

                            <Button
                                size="xl"
                                variant="surface"
                                asChild
                                onClick={onClose}
                            >
                                <RouterLink to="/login" >
                                    LogIn <FaSignInAlt />
                                </RouterLink>
                            </Button>

                            <Button
                                size="xl"
                                variant="surface"
                                asChild
                                onClick={onClose}
                            >
                                <RouterLink to="/profile">
                                    Profile <FaUserAlt />
                                </RouterLink>
                            </Button>

                            <LangSwitcher />

                            <IconButton
                                size="xl"
                                aria-label="Toggle theme"
                                onClick={() => {
                                    toggleColorMode()
                                }}
                                variant="surface"
                            >
                                {colorMode === 'light' ? <FaMoon /> : <FaSun />}
                            </IconButton>
                        </VStack>
                    </Box>
                )
            }
        </Box >
    )
}

export default Header