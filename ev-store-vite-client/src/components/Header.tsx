import { useEffect } from 'react'
import API from '@/utils/api'

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
    useDisclosure,
    Menu,
    Portal,
    Accordion
} from '@chakra-ui/react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import LangSwitcher from '@/components/LangSwitcher'
import { useColorMode } from '@/components/ui/color-mode'
import { LuShoppingCart, LuMoon, LuSun, LuCircleUserRound, LuLogIn, LuPanelLeftClose, LuPanelRightClose, LuLogOut } from "react-icons/lu";

const Header = () => {
    const { open, onOpen, onClose } = useDisclosure()
    const { colorMode, toggleColorMode } = useColorMode()
    const navigate = useNavigate()

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

    const logOut = async () => {
        try {
            await API.post('/auth/logout', {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('isLogedIn')
            navigate('/')

            if (open) {
                onClose()
            }
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    return (
        <Box position="sticky" top={0} zIndex="2" bg="bg" shadow="xl">
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
                    <RouterLink to="/">Home</RouterLink>
                    <RouterLink to="/catalog">Catalog</RouterLink>
                    <RouterLink to="/about-us">About Us</RouterLink>
                    <RouterLink to="/contact-us">Contact</RouterLink>

                    <Button variant="outline" asChild>
                        <RouterLink to="/login">
                            LogIn <LuLogIn />
                        </RouterLink>
                    </Button>

                    <Button variant="outline" >
                        <RouterLink to="/cart">
                            <LuShoppingCart />
                        </RouterLink>
                    </Button>


                    <IconButton
                        aria-label="Toggle theme"
                        onClick={toggleColorMode}
                        variant="outline"
                    >
                        {colorMode === 'light' ? <LuMoon /> : <LuSun />}
                    </IconButton>

                    <LangSwitcher />

                    <Menu.Root size="md">
                        <Menu.Trigger asChild>
                            <Button variant="outline">
                                Profile <LuCircleUserRound />
                            </Button>
                        </Menu.Trigger>
                        <Portal>
                            <Menu.Positioner>
                                <Menu.Content>
                                    <Menu.Item value="profile">
                                        <RouterLink to="/profile">
                                            My Profile
                                        </RouterLink>
                                    </Menu.Item>
                                    <Separator />
                                    <Menu.Item value="history">
                                        <RouterLink to="/order-history">
                                            Order History
                                        </RouterLink>
                                    </Menu.Item>
                                    <Separator />
                                    <Menu.Item value="logout" onClick={logOut}>
                                        <HStack>
                                            Log Out <LuLogOut />
                                        </HStack>
                                    </Menu.Item>
                                </Menu.Content>
                            </Menu.Positioner>
                        </Portal>
                    </Menu.Root>
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
                            <LuShoppingCart />
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
                        {colorMode === 'light' ? <LuMoon /> : <LuSun />}
                    </IconButton>

                    <IconButton
                        display={{ base: 'flex', md: 'none' }}
                        aria-label="Toggle menu"
                        onClick={open ? onClose : onOpen}
                        variant="surface"
                        size="xl"

                    >
                        {open ?
                            <Box
                                data-state="open"
                                _open={{
                                    animation: "spin 300ms",
                                }}
                            >
                                <LuPanelRightClose />
                            </Box> : <LuPanelLeftClose />}
                    </IconButton>
                </HStack>

            </Flex>

            <Box
                position="absolute"
                display={open ? 'block' : 'none'}
                top="100%"
                left={0}
                width="100%"
                shadow="xl"
                zIndex="2"
                bg="bg.muted"
                h="100dvh"
                data-state="open"
                _open={{
                    animation: "slide-from-right-full 300ms ease-in",
                }}
            >
                <VStack as="nav" gap={4} align="stretch" p={4}>
                    <RouterLink to="/" onClick={onClose}>Home</RouterLink>
                    <Separator />
                    <RouterLink to="/catalog" onClick={onClose}>Catalog</RouterLink>
                    <Separator />
                    <RouterLink to="/about-us" onClick={onClose}>About Us</RouterLink>
                    <Separator />
                    <RouterLink to="/contact-us" onClick={onClose}>Contact</RouterLink>
                    <Separator />

                    <Accordion.Root size="lg" collapsible>
                        <Accordion.Item value="profile">
                            <Accordion.ItemTrigger>
                                <LuCircleUserRound />
                                Profile
                            </Accordion.ItemTrigger>
                            <Accordion.ItemContent>
                                <Accordion.ItemBody>
                                    <VStack gap={2} align="stretch">
                                        <RouterLink to="/profile" onClick={onClose}>
                                            My Profile
                                        </RouterLink>
                                        <Separator />
                                        <RouterLink to="/order-history" onClick={onClose}>
                                            Order History
                                        </RouterLink>
                                        <Separator />
                                        <RouterLink to="/logout" onClick={onClose}>
                                            <HStack>
                                                Log Out <LuLogOut />
                                            </HStack>
                                        </RouterLink>
                                    </VStack>
                                </Accordion.ItemBody>
                            </Accordion.ItemContent>
                        </Accordion.Item>
                    </Accordion.Root>


                    <Button
                        size="xl"
                        variant="outline"
                        asChild
                        onClick={onClose}
                    >
                        <RouterLink to="/login" >
                            LogIn <LuLogIn />
                        </RouterLink>
                    </Button>

                    <LangSwitcher />


                </VStack>
            </Box>
        </Box >
    )
}

export default Header