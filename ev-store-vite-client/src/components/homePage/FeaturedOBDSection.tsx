import {
    Box,
    Grid,
    GridItem,
    Flex,
    Heading,
    Text,
    Button,
    Image
} from '@chakra-ui/react'

export interface FeaturedOBDItem {
    id: string
    title: string
    description: string
    imageUrl: string
}

interface FeaturedOBDSectionProps {
    title?: string
    seeAllLabel?: string
    learnMoreLabel?: string
    onSeeAll?: () => void
    items: [
        FeaturedOBDItem,
        FeaturedOBDItem,
        FeaturedOBDItem,
        FeaturedOBDItem,
        FeaturedOBDItem
    ]
}

const FeaturedOBDSection = ({
    title = 'OBD II - Diagnostic tools',
    seeAllLabel = 'See all',
    learnMoreLabel = 'Learn more',
    onSeeAll,
    items,
}: FeaturedOBDSectionProps) => {
    const [first, second, third, fourth, fifth] = items

    return (
        <Box bg="gray.100" px={{ base: 4, md: 16 }} py={12}>
            <Flex justify="space-between" align="center" mb={6}>
                <Heading size={{ base: '2xl', md: '4xl' }} textAlign='left'>{title}</Heading>
                <Button variant="outline" size="sm" onClick={onSeeAll}>
                    {seeAllLabel}
                </Button>
            </Flex>

            <Grid
                templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
                templateRows={{ base: 'auto auto', md: 'repeat(2, auto)' }}
                gap={6}
            >
                <GridItem bg="white" borderRadius="md" p={6} textAlign="start">
                    <Heading size="md" mb={2}>{first.title}</Heading>
                    <Text mb={4} lineClamp={3}>{first.description}</Text>
                    <Button size="sm" variant="subtle" mb={4}>{learnMoreLabel}</Button>
                    <Image
                        src={first.imageUrl}
                        alt={first.title}
                        w={{ base: '100px', md: '120px' }}
                        h={{ base: '100px', md: '120px' }}
                        objectFit="cover"
                        borderRadius="md"
                    />
                </GridItem>

                <GridItem bg="gray.200" borderRadius="md" p={6} textAlign="start">
                    <Heading size="md" mb={2}>{second.title}</Heading>
                    <Text mb={4} lineClamp={3}>{second.description}</Text>
                    <Button size="sm" variant="subtle" mb={4}>{learnMoreLabel}</Button>
                    <Image
                        src={second.imageUrl}
                        alt={second.title}
                        w={{ base: '100px', md: '120px' }}
                        h={{ base: '100px', md: '120px' }}
                        objectFit="cover"
                        borderRadius="md"
                    />
                </GridItem>

                <GridItem bg="white" borderRadius="md" p={6} textAlign="start">
                    <Heading size="md" mb={2}>{third.title}</Heading>
                    <Text mb={4} lineClamp={3}>{third.description}</Text>
                    <Button size="sm" variant="subtle" mb={4}>{learnMoreLabel}</Button>
                    <Image
                        src={third.imageUrl}
                        alt={third.title}
                        w={{ base: '100px', md: '120px' }}
                        h={{ base: '100px', md: '120px' }}
                        objectFit="cover"
                        borderRadius="md"
                    />
                </GridItem>

                <GridItem
                    colSpan={{ base: 1, md: 2 }}
                    bg="green.300"
                    borderRadius="md"
                    p={6}
                    textAlign="start"
                >
                    <Heading size="md" mb={2}>{fourth.title}</Heading>
                    <Text mb={4} lineClamp={3}>{fourth.description}</Text>
                    <Button size="sm" variant="subtle" mb={4}>{learnMoreLabel}</Button>
                    <Image
                        src={fourth.imageUrl}
                        alt={fourth.title}
                        w={{ base: '100px', md: '150px' }}
                        h={{ base: '100px', md: '150px' }}
                        objectFit="cover"
                        borderRadius="md"
                    />
                </GridItem>

                <GridItem bg="gray.200" borderRadius="md" p={6} textAlign="start">
                    <Heading size="md" mb={2}>{fifth.title}</Heading>
                    <Text mb={4} lineClamp={3}>{fifth.description}</Text>
                    <Button size="sm" variant="subtle" mb={4}>{learnMoreLabel}</Button>
                    <Image
                        src={fifth.imageUrl}
                        alt={fifth.title}
                        w={{ base: '100px', md: '120px' }}
                        h={{ base: '100px', md: '120px' }}
                        objectFit="cover"
                        borderRadius="md"
                    />
                </GridItem>
            </Grid>
        </Box>
    )
}

export default FeaturedOBDSection