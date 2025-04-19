import { Flex, HStack, IconButton, Button, Image, Link, Heading } from '@chakra-ui/react'
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
                <Link href="/">Home</Link>
                <Link href="/about-us">About Us</Link>
                <Link href="/contact">Contact</Link>
                <Button variant="outline">
                    LogIn <FaSignInAlt />
                </Button>
                <IconButton
                    aria-label="Toggle theme"
                    onClick={toggleColorMode}
                    variant="ghost"
                >
                    {colorMode === 'light' ? <FaMoon /> : <FaSun />}
                </IconButton>
            </HStack>
        </Flex >
    )
}

export default Header