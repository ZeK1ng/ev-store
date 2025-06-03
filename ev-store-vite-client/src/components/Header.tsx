import { useEffect } from 'react'
import {
    Box,
    Flex,
    HStack,
    IconButton,
    Button,
    Image,
    Heading,
    VStack,
    Separator,
    useDisclosure
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import LangSwitcher from '@/components/LangSwitcher'
import { useColorMode } from '@/components/ui/color-mode'
import { FaMoon, FaSun, FaSignInAlt, FaBars, FaWindowClose, FaUserAlt, FaShoppingCart } from 'react-icons/fa'

const Header = () => {
    const { open, onOpen, onClose } = useDisclosure()
    const { colorMode, toggleColorMode } = useColorMode()

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'auto'
        } else {
            document.body.style.overflow = 'auto'
        }
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [open])

    return (
        <Box position="sticky" top={0} zIndex="2" bg="bg.muted" shadow="xl">
            <Flex
                as="header"
                boxSizing="border-box"
                align="center"
                justify="space-between"
                justifySelf="center"
                px={{ base: 4, md: 8 }}
                py={4}
                maxW="1296px"
                w="100%"
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

                    {/* <Button variant="outline" asChild>
                        <RouterLink to="/login">
                            LogIn
                        </RouterLink>
                    </Button> */}

                    <Button variant="outline" asChild>
                        <RouterLink to="/cart">
                            <FaShoppingCart />
                        </RouterLink>
                    </Button>


                    <IconButton
                        aria-label="Toggle theme"
                        onClick={toggleColorMode}
                        variant="outline"
                    >
                        {colorMode === 'light' ? <FaMoon /> : <FaSun />}
                    </IconButton>

                    <LangSwitcher />

                    <Button variant="outline" asChild>
                        <RouterLink to="/profile">
                            Profile <FaUserAlt />
                        </RouterLink>
                    </Button>
                </HStack>

                <HStack display={{ base: 'flex', md: 'none' }}>
                    <Button
                        display={{ base: 'flex', md: 'none' }}
                        size="xl"
                        variant="surface"
                        asChild
                        onClick={onClose}
                    >
                        <RouterLink to="/cart">
                            <FaShoppingCart />
                        </RouterLink>
                    </Button>

                    <IconButton
                        display={{ base: 'flex', md: 'none' }}
                        size="xl"
                        aria-label="Toggle theme"
                        onClick={() => {
                            toggleColorMode()
                        }}
                        variant="surface"
                    >
                        {colorMode === 'light' ? <FaMoon /> : <FaSun />}
                    </IconButton>

                    <IconButton
                        display={{ base: 'flex', md: 'none' }}
                        aria-label="Toggle menu"
                        onClick={open ? onClose : onOpen}
                        variant="ghost"
                    >
                        {open ? <FaWindowClose /> : <FaBars />}
                    </IconButton>
                </HStack>

            </Flex>

            {
                open && (

                    <Box
                        position="absolute"
                        top="100%"
                        left={0}
                        width="100%"
                        shadow="xl"
                        zIndex="2"
                        bg="bg.muted"
                        h="100dvh"
                    >
                        <VStack as="nav" gap={4} align="stretch" p={4}>
                            <RouterLink to="/cms-admin" onClick={onClose}>Admin</RouterLink>
                            <Separator />
                            <RouterLink to="/" onClick={onClose}>Home</RouterLink>
                            <Separator />
                            <RouterLink to="/catalog" onClick={onClose}>Catalog</RouterLink>
                            <Separator />
                            <RouterLink to="/about-us" onClick={onClose}>About Us</RouterLink>
                            <Separator />
                            <RouterLink to="/contact-us" onClick={onClose}>Contact</RouterLink>

                            <Button
                                size="xl"
                                variant="outline"
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


                        </VStack>
                    </Box>
                )
            }
        </Box >
    )
}

export default Header