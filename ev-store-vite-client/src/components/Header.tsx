import API from '@/utils/AxiosAPI'
import AuthController from '@/utils/AuthController'
import {
    Box,
    Flex,
    HStack,
    IconButton,
    Button,
    Image,
    VStack,
    Separator,
    Menu,
    Portal,
    Accordion,
    Span,
    Link,
    Drawer,
    CloseButton
} from '@chakra-ui/react'
import { toaster } from "@/components/ui/toaster"
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import LangSwitcher from '@/components/LangSwitcher'
import { useColorMode } from '@/components/ui/color-mode'
import { LuShoppingCart, LuMoon, LuSun, LuCircleUserRound, LuLogIn, LuMenu, LuLogOut } from "react-icons/lu";
import { useTranslation } from 'react-i18next'

const Header = () => {
    const { t } = useTranslation('common');
    const { colorMode, toggleColorMode } = useColorMode()
    const navigate = useNavigate()

    const logOut = async () => {
        try {
            await API.post('/auth/logout')
            AuthController.logout()
            navigate('/')
        } catch (error) {
            toaster.error({
                title: t('header.logoutError'),
                description: t('header.logoutErrorDescription')
            })
        }
    }

    return (
        <Box position="sticky" top={0} zIndex="2" bg="bg" shadow="xl" >
            <Flex
                as="header"
                boxSizing="border-box"
                align="center"
                justify="space-between"
                mx="auto"
                px={{ base: 4, md: 8 }}
                py={4}
                maxW="1296px"
                h={{ base: '80px', md: '75px' }}
                w="100%">
                <Flex align="center">
                    <Link href="/">
                        <Image src={
                            colorMode === 'dark' ? '/logos/header-logo-dark.svg' : '/logos/header-logo-light.svg'
                        } alt="Logo" h="40px" mr={2} />
                    </Link>

                </Flex>

                <HStack gap={4} display={{ base: 'none', md: 'flex' }}>
                    <RouterLink to="/">
                        {t('header.home')}
                    </RouterLink>
                    <RouterLink to="/catalog">
                        {t('header.catalog')}
                    </RouterLink>
                    <RouterLink to="/contact-us">
                        {t('header.contact')}
                    </RouterLink>

                    <Button variant="outline" asChild>
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
                    >
                        <RouterLink to="/cart">
                            <LuShoppingCart />
                        </RouterLink>
                    </Button>

                    <IconButton
                        display={{ base: 'flex', md: 'none' }}
                        size="xl"
                        aria-label="Toggle theme"
                        onClick={toggleColorMode}
                        variant="surface"
                    >
                        {colorMode === 'light' ? <LuMoon /> : <LuSun />}
                    </IconButton>
                    <Drawer.Root>
                        <Drawer.Trigger asChild>
                            <IconButton
                                display={{ base: 'flex', md: 'none' }}
                                aria-label="Toggle menu"
                                variant="surface"
                                size="xl"
                            >
                                <LuMenu />
                            </IconButton>
                        </Drawer.Trigger>
                        <Portal>
                            <Drawer.Backdrop />
                            <Drawer.Positioner>
                                <Drawer.Content>
                                    <Drawer.Header>
                                        <Drawer.Title>{t('header.menu')}</Drawer.Title>
                                        <Drawer.CloseTrigger asChild>
                                            <CloseButton />
                                        </Drawer.CloseTrigger>
                                    </Drawer.Header>
                                    <Drawer.Context>
                                        {(store) => (
                                            <Drawer.Body>
                                                <VStack as="nav" gap={4} align="stretch">
                                                    <RouterLink to="/" onClick={() => store.setOpen(false)}>
                                                        {t('header.home')}
                                                    </RouterLink>
                                                    <Separator />
                                                    <RouterLink to="/catalog" onClick={() => store.setOpen(false)}>
                                                        {t('header.catalog')}
                                                    </RouterLink>
                                                    <Separator />
                                                    <RouterLink to="/contact-us" onClick={() => store.setOpen(false)}>
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
                                                                                <RouterLink to="/profile" onClick={() => store.setOpen(false)}>
                                                                                    {t('header.myProfile')}
                                                                                </RouterLink>
                                                                                <Separator />
                                                                                <RouterLink to="/order-history" onClick={() => store.setOpen(false)}>
                                                                                    {t('header.orderHistory')}
                                                                                </RouterLink>
                                                                                <Separator />
                                                                                <HStack onClick={() => {
                                                                                    logOut();
                                                                                    store.setOpen(false);
                                                                                }}>
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
                                                            >
                                                                <RouterLink to="/login" onClick={() => store.setOpen(false)}>
                                                                    {t('header.login')} <LuLogIn />
                                                                </RouterLink>
                                                            </Button>
                                                        )
                                                    }
                                                    <LangSwitcher />
                                                </VStack>
                                            </Drawer.Body>
                                        )}
                                    </Drawer.Context>
                                </Drawer.Content>
                            </Drawer.Positioner>
                        </Portal>
                    </Drawer.Root>
                </HStack>
            </Flex>
        </Box>
    )
}

export default Header