import {
    Box,
    Flex,
    Heading,
    Text,
    Image,
    SimpleGrid,
    Icon,
    Center
} from '@chakra-ui/react';
import { FaBolt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react';

const AboutUs = () => {
    const { t } = useTranslation('about');
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <Box px={{ base: 4, md: 16 }} py={12}>
            <Flex
                direction={{ base: 'column', md: 'row' }}
                align="center"
                mb={12}
            >
                <Box flex={1} pr={{ md: 8 }} mb={{ base: 6, md: 0 }}>
                    <Heading as="h1" size="xl" mb={4}>
                        {t('title')}
                    </Heading>
                    <Text mb={4} lineHeight="taller">
                        {t('paragraph1')}
                    </Text>
                    <Text lineHeight="taller">
                        {t('paragraph2')}
                    </Text>
                </Box>

                <Box flex={1}>
                    <Image
                        src="/images/about-us.png"
                        alt="EV Store journey"
                        borderRadius="md"
                        objectFit="cover"
                        w="full"
                        h={{ base: 'auto', md: '350px' }}
                    />
                </Box>
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
                {(['charge_faster', 'find_tools', 'simplify_charging'] as const).map((key, index) => (
                    <Box
                        key={index}
                        borderWidth="1px"
                        borderRadius="md"
                        p={6}
                        textAlign="center"
                    >
                        <Center mb={4}>
                            <Flex
                                bg="#9CE94F"
                                p={4}
                                borderRadius="full"
                                align="center"
                                justify="center"
                            >
                                <Icon as={FaBolt} boxSize={6} color="gray.950"/>
                            </Flex>
                        </Center>
                        <Heading size="md" mb={2}>
                            {t(`features.${key}.title`)}
                        </Heading>
                        <Text color="gray.600">
                            {t(`features.${key}.description`)}
                        </Text>
                    </Box>
                ))}
            </SimpleGrid>

        </Box>
    )
};

export default AboutUs;
