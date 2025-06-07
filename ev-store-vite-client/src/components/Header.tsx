import { useEffect } from 'react'
import API from '@/utils/AxiosAPI'
import AuthController from '@/utils/AuthController'
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
    Accordion,
    Span
} from '@chakra-ui/react'
import { toaster } from "@/components/ui/toaster"
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import LangSwitcher from '@/components/LangSwitcher'
import { useColorMode } from '@/components/ui/color-mode'
import { LuShoppingCart, LuMoon, LuSun, LuCircleUserRound, LuLogIn, LuPanelLeftClose, LuPanelRightClose, LuLogOut } from "react-icons/lu";
import { useTranslation } from 'react-i18next'

const Header = () => {
    const { t } = useTranslation('common');

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
            await API.post('/auth/logout')
            AuthController.logout()
            navigate('/')

            if (open) {
                onClose()
            }
        } catch (error) {
            toaster.error({
                title: t('header.logoutError'),
                description: t('header.logoutErrorDescription')
            })
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
                    <RouterLink to="/">
                        {t('header.home')}
                    </RouterLink>
                    <RouterLink to="/catalog">
                        {t('header.catalog')}
                    </RouterLink>
                    <RouterLink to="/about-us">
                        {t('header.aboutUs')}
                    </RouterLink>
                    <RouterLink to="/contact-us">
                        {t('header.contact')}
                    </RouterLink>

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

                    {
                        AuthController.isLoggedIn() ? (
                            <Menu.Root size="md">
                                <Menu.Trigger asChild>
                                    <Button variant="outline">
                                        {t('header.profile')} <LuCircleUserRound />
                                    </Button>
                                </Menu.Trigger>
                                <Portal>
                                    <Menu.Positioner>
                                        <Menu.Content>
                                            <Menu.Item value="profile">
                                                <RouterLink to="/profile">
                                                    {t('header.myProfile')}
                                                </RouterLink>
                                            </Menu.Item>
                                            <Separator />
                                            <Menu.Item value="history">
                                                <RouterLink to="/order-history">
                                                    {t('header.orderHistory')}
                                                </RouterLink>
                                            </Menu.Item>
                                            <Separator />
                                            <Menu.Item value="logout" onClick={logOut}>
                                                <HStack>
                                                    {t('header.logout')} <LuLogOut />
                                                </HStack>
                                            </Menu.Item>
                                        </Menu.Content>
                                    </Menu.Positioner>
                                </Portal>
                            </Menu.Root>
                        ) : <Button variant="outline" asChild>
                            <RouterLink to="/login">
                                {t('header.login')} <LuLogIn />
                            </RouterLink>
                        </Button>
                    }


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
                    <RouterLink to="/" onClick={onClose}>
                        {t('header.home')}
                    </RouterLink>
                    <Separator />
                    <RouterLink to="/catalog" onClick={onClose}>
                        {t('header.catalog')}
                    </RouterLink>
                    <Separator />
                    <RouterLink to="/about-us" onClick={onClose}>
                        {t('header.aboutUs')}
                    </RouterLink>
                    <Separator />
                    <RouterLink to="/contact-us" onClick={onClose}>
                        {t('header.contact')}
                    </RouterLink>
                    <Separator />

                    {
                        AuthController.isLoggedIn() ? (
                            <Accordion.Root size="lg" collapsible>
                                <Accordion.Item value="profile">
                                    <Accordion.ItemTrigger>
                                        <Span flex="1">
                                            <HStack align="center" gap={2}>
                                                <LuCircleUserRound />
                                                {t('header.profile')}
                                            </HStack>
                                        </Span>

                                        <Accordion.ItemIndicator />

                                    </Accordion.ItemTrigger>
                                    <Accordion.ItemContent>
                                        <Accordion.ItemBody>
                                            <VStack gap={2} align="stretch" ml={2}>
                                                <RouterLink to="/profile" onClick={onClose}>
                                                    {t('header.myProfile')}
                                                </RouterLink>
                                                <Separator />
                                                <RouterLink to="/order-history" onClick={onClose}>
                                                    {t('header.orderHistory')}
                                                </RouterLink>
                                                <Separator />
                                                <HStack onClick={logOut}>
                                                    {t('header.logout')} <LuLogOut />
                                                </HStack>
                                            </VStack>
                                        </Accordion.ItemBody>
                                    </Accordion.ItemContent>
                                </Accordion.Item>
                            </Accordion.Root>
                        ) : (
                            <Button
                                size="xl"
                                variant="outline"
                                asChild
                                onClick={onClose}
                            >
                                <RouterLink to="/login" >
                                    {t('header.login')} <LuLogIn />
                                </RouterLink>
                            </Button>
                        )
                    }

                    <LangSwitcher />
                </VStack>
            </Box>
        </Box >
    )
}

export default Header