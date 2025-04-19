import {
    Box,
    SimpleGrid,
    Center,
    Flex,
    Icon,
    Heading,
    Text
} from '@chakra-ui/react'
import { FaBolt, FaCog, FaLightbulb } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

const FeaturesSection = () => {
    const { t } = useTranslation('home')
    const iconsMap = {
        "FaBolt": FaBolt,
        "FaCog": FaCog,
        "FaLightbulb": FaLightbulb,
    }
    return (
        <Box px={{ base: 4, md: 16 }} py={12}>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={10}>
                {(['FaBolt', 'FaCog', 'FaLightbulb'] as Array<keyof typeof iconsMap>).map((item, index) => (
                    <Box
                        key={index}
                        textAlign="center"
                        px={6}
                    >
                        <Center mb={4}>
                            <Flex
                                bg="green.400"
                                p={6}
                                borderRadius="full"
                                align="center"
                                justify="center"
                            >
                                <Icon as={iconsMap[item]} boxSize={8} color="white" />
                            </Flex>
                        </Center>
                        <Heading size="md" mb={2}>
                            {t(`features.${item}.title`)}
                        </Heading>
                        <Text color="gray.600" fontSize="md">
                            {t(`features.${item}.description`)}
                        </Text>
                    </Box>
                ))}
            </SimpleGrid>
        </Box>
    )
}

export default FeaturesSection
