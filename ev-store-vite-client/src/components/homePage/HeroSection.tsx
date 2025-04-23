import {
    Box,
    Flex,
    Heading,
    Text,
    Button,
    HStack,
    Avatar,
    AvatarGroup,
    Image,
    useBreakpointValue,
} from '@chakra-ui/react'
import { FaArrowRight } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

const HeroSection = () => {
    const isMd = useBreakpointValue({ base: false, md: true })
    const { t } = useTranslation('home')

    return (
        <Flex
            direction={{ base: 'column', md: 'row' }}
            align="center"
            px={{ base: 4, md: 16 }}
            py={16}
            gap={{ base: 8, md: 0 }}
        >
            <Box flex={1} textAlign={{ base: 'center', md: 'left' }}>
                <Heading size="7xl" mb={4}>
                    {t('hero.title')}
                </Heading>
                <Text fontSize="2xl" mb={6}>
                    {t('hero.description')}
                </Text>
                <Button colorScheme="green" size="lg">
                    {t('hero.buttonLabel')} <FaArrowRight />
                </Button>

                <HStack
                    mt={6}
                    gap={2}
                    justify={{ base: 'center', md: 'flex-start' }}
                >
                    <AvatarGroup size="lg" stacking="last-on-top">
                        {[{ name: 'User1', src: "https://placehold.co/60x60" },
                        { name: 'User1', src: "https://placehold.co/60x60" },
                        { name: 'User1', src: "https://placehold.co/60x60" },
                        { name: 'User1', src: "https://placehold.co/60x60" },
                        ].map((item) => (
                            <Avatar.Root key={item.name}>
                                <Avatar.Fallback name={item.name} />
                                <Avatar.Image src={item.src} />
                            </Avatar.Root>
                        ))}
                        <Avatar.Root>
                            <Avatar.Fallback>+2K</Avatar.Fallback>
                        </Avatar.Root>
                    </AvatarGroup>


                    <Text fontSize="sm"> {t('hero.customers')}</Text>
                </HStack>
            </Box>

            <Flex flex={1} justify="center" align="center" position="relative">
                {isMd && (
                    <>
                        <Image
                            src="https://placehold.co/300x250"
                            alt="Feature"
                            borderRadius="md"
                            position="absolute"
                            bottom="0"
                            left="100px"
                            objectFit="cover"
                        />
                        <Image
                            src="https://placehold.co/400x300"
                            alt="Feature"
                            borderRadius="md"
                            position="absolute"
                            top="-100px"
                            right="0"
                            objectFit="cover"
                            zIndex="1"
                        />

                    </>
                )}
            </Flex>
        </Flex>
    )
}

export default HeroSection
