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

export interface FeaturedItem {
    id: string
    title: string
    description: string
    imageUrl: string
}

interface FeaturedItemsSectionProps {
    title?: string
    seeAllLabel?: string
    learnMoreLabel?: string
    onSeeAll?: () => void
    items: [FeaturedItem, FeaturedItem, FeaturedItem, FeaturedItem]
}

const FeaturedIChargersSection = ({
    title,
    seeAllLabel,
    learnMoreLabel,
    onSeeAll,
    items,
}: FeaturedItemsSectionProps) => {
    const [first, second, third, fourth] = items

    return (
        <Box px={{ base: 4, md: 16 }} py={12}>
            <Flex justify="space-between" align="center" mb={6}>
                <Heading size={{ base: '2xl', md: '4xl' }} textAlign='left'>{title}</Heading>
                <Button variant="outline" size="sm" onClick={onSeeAll}>
                    {seeAllLabel}
                </Button>
            </Flex>

            <Grid
                templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
                templateRows={{ base: 'auto', md: 'repeat(2, auto)' }}
                gap={6}
            >
                <GridItem
                    rowSpan={{ base: 1, md: 2 }}
                    bg="gray.200"
                    borderRadius="md"
                    p={6}
                    textAlign="start"
                >
                    <Heading size="md" mb={3}>{first.title}</Heading>
                    <Text mb={4} lineClamp={8}>{first.description}</Text>
                    <Button size="sm" variant="subtle">{learnMoreLabel}</Button>
                    <Image
                        src={first.imageUrl}
                        alt={first.title}
                        mt={4}
                        w={{ base: '150px', md: '100%' }}
                        h={{ base: '150px', md: '250px' }}
                        objectFit="cover"
                        float={{ base: 'right', md: 'none' }}
                        borderRadius="md"
                    />
                </GridItem>

                <GridItem bg="white" borderRadius="md" p={6} textAlign="start">
                    <Heading size="md" mb={3}>{second.title}</Heading>
                    <Text mb={4} lineClamp={3}>{second.description}</Text>
                    <Button size="sm" variant="subtle">{learnMoreLabel}</Button>
                    <Image
                        src={second.imageUrl}
                        alt={second.title}
                        mt={4}
                        w={{ base: '100px', md: '120px' }}
                        h={{ base: '100px', md: '120px' }}
                        objectFit="cover"
                        borderRadius="md"
                        float={'right'}

                    />
                </GridItem>

                <GridItem bg="white" borderRadius="md" p={6} textAlign="start">
                    <Heading size="md" mb={3}>{third.title}</Heading>
                    <Text mb={4} lineClamp={3}>{third.description}</Text>
                    <Button size="sm" variant="subtle">{learnMoreLabel}</Button>
                    <Image
                        src={third.imageUrl}
                        alt={third.title}
                        mt={4}
                        w={{ base: '100px', md: '120px' }}
                        h={{ base: '100px', md: '120px' }}
                        objectFit="cover"
                        borderRadius="md"
                        float={'right'}
                    />
                </GridItem>

                <GridItem
                    colSpan={{ base: 1, md: 2 }}
                    bg="green.300"
                    borderRadius="md"
                    p={6}
                    textAlign="start"
                >
                    <Heading size="md" mb={3}>{fourth.title}</Heading>
                    <Text mb={4} lineClamp={3}>{fourth.description}</Text>
                    <Button size="sm" variant="subtle">{learnMoreLabel}</Button>
                    <Image
                        src={fourth.imageUrl}
                        alt={fourth.title}
                        mt={4}
                        w={{ base: '150px', md: '200px' }}
                        h={{ base: '100px', md: '150px' }}
                        objectFit="cover"
                        borderRadius="md"
                        float={'right'}
                    />
                </GridItem>
            </Grid>
        </Box>
    )
}

export default FeaturedIChargersSection