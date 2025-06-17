import {
    Box,
    SimpleGrid,
    Center,
    Flex,
    Icon,
    Heading,
    Text
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { BiPackage, BiSupport } from "react-icons/bi";
import { TbHours24 } from "react-icons/tb";

const FeaturesSection = () => {
    const { t } = useTranslation('home')
    const iconsMap = {
        "BiPackage": BiPackage,
        "BiSupport": BiSupport,
        "TbHours24": TbHours24,
    }
    return (
        <Box py={12}>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={10}>
                {(['BiPackage', 'BiSupport', 'TbHours24'] as Array<keyof typeof iconsMap>).map((item, index) => (
                    <Box
                        key={index}
                        textAlign="center"
                        px={6}
                    >
                        <Center mb={4}>
                            <Flex
                                bg="#9CE94F"
                                p={6}
                                borderRadius="full"
                                align="center"
                                justify="center"
                            >
                                <Icon as={iconsMap[item]} boxSize={8} color="black" />
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