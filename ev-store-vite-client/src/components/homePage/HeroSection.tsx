import {
    Box,
    Flex,
    Heading,
    Text,
    Button,
    Container,
    Image,
} from '@chakra-ui/react'
import { LuArrowRight } from 'react-icons/lu'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {
    const { t } = useTranslation('home')
    const navigate = useNavigate()

    return (
        <Box
            as="section"
            position="absolute"
            top={{ base: '80px', md: '75px' }}
            left="0"
            right="0"
            height="300px"
            overflow="hidden"
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                zIndex="0"
            >
                <Image
                    src="/images/hero-section.png"
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    objectPosition="center"
                />
                <Box
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    bg="blackAlpha.700"
                />
            </Box>

            <Container
                maxW="container.xl"
                position="relative"
                zIndex="1"
                px={4}
            >
                <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    textAlign="center"
                    color="white"
                    py={20}
                >
                    <Heading
                        as="h1"
                        size={{ base: '2xl', md: '4xl' }}
                        mb={6}
                        fontWeight="bold"
                        fontFamily="heading"
                        maxW="900px"
                    >
                        {t('hero.title')}
                    </Heading>
                    <Text
                        fontSize={{ base: 'md', md: 'xl' }}
                        mb={8}
                        maxW="700px"
                        color="whiteAlpha.900"
                    >
                        {t('hero.description')}
                    </Text>
                    <Button
                        size="lg"
                        onClick={() => navigate('/catalog')}
                        bg="white"
                        color="black"
                        _hover={{
                            bg: 'whiteAlpha.900',
                            transform: 'translateY(-2px)',
                        }}
                        transition="all 0.2s"
                    >
                        {t('hero.buttonLabel')}
                        <Box as="span" ml={2}>
                            <LuArrowRight />
                        </Box>
                    </Button>
                </Flex>
            </Container>
        </Box>
    )
}

export default HeroSection
