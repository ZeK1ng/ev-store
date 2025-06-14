import {
    Box,
    Flex,
    Heading,
    Text,
    Button,
    Image,
    Container,
    Highlight,
} from '@chakra-ui/react'
import { LuArrowRight } from 'react-icons/lu'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {
    const { t } = useTranslation('home')
    const navigate = useNavigate()

    return (
        <Box as="section" py={12}>
            <Container maxW="container.xl" px={0}>
                <Flex
                    direction={{ base: 'column', md: 'row' }}
                    align="center"
                    justify="space-between"
                    gap={8}
                >
                    <Box flex="1" textAlign={{ base: 'center', md: 'left' }}>
                        <Heading
                            as="h1"
                            size="4xl"
                            mb={6}
                            fontWeight="bold"
                            fontFamily="heading"
                        >
                            <Highlight
                                query={['ელექტრომობილების']}
                                styles={{ px: "0.5", bg: "#9CE94F", color: "white" }}
                            >
                                {t('hero.title')}
                            </Highlight>
                        </Heading>
                        <Text
                            fontSize="xl"
                            color="gray.600"
                            mb={8}
                            maxW="600px"
                            mx={{ base: 'auto', md: '0' }}
                        >
                            {t('hero.description')}
                        </Text>
                        <Button
                            size="lg"
                            onClick={() => navigate('/catalog')}
                        >
                            {t('hero.catalogButton')}
                            <Box as="span">
                                <LuArrowRight />
                            </Box>
                        </Button>
                    </Box>
                    <Box flex="1" display="flex" justifyContent="center">
                        <Image
                            src="https://plus.unsplash.com/premium_photo-1715639312136-56a01f236440?q=80&w=3840&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            maxW="100%"
                            h="auto"
                            borderRadius="xl"
                            boxShadow="2xl"
                            objectFit="cover"
                        />
                    </Box>
                </Flex>
            </Container>
        </Box>
    )
}

export default HeroSection
