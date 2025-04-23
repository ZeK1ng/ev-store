import { Flex, HStack, IconButton, Button, Image, Heading } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import LangSwitcher from '@/components/LangSwitcher'
import { useColorMode } from '@/components/ui/color-mode'
import { FaMoon, FaSun, FaSignInAlt } from 'react-icons/fa'

const Header = () => {
    const { colorMode, toggleColorMode } = useColorMode()

    return (
        <Flex
            as="header"
            align="center"
            justify="space-between"
            p={4}
            borderBottomWidth="1px"
        >
            <Flex align="center">
                <Image src="/vite.svg" alt="Logo" boxSize="40px" mr={2} />
                <Heading size="md">My App</Heading>
            </Flex>
            <HStack gap={4}>
                <Link to="/">Home</Link>
                <Link to="/about-us">About Us</Link>
                <Link to="/contact">Contact</Link>

                <IconButton
                    aria-label="Toggle theme"
                    onClick={toggleColorMode}
                    variant="ghost"
                >
                    {colorMode === 'light' ? <FaMoon /> : <FaSun />}
                </IconButton>
                <LangSwitcher />
                <Button variant="outline">
                    <Link to="/login">
                        LogIn <FaSignInAlt />
                    </Link>
                </Button>
            </HStack>
        </Flex >
    )
}

export default Header;
