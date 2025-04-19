import {
    Box,
    Breadcrumb,
    Flex,
    Heading,
    Text,
    Image,
    SimpleGrid,
    Icon,
    Center
} from '@chakra-ui/react'
import { FaBolt } from 'react-icons/fa'

const AboutUs = () => {
    return (
        <Box px={{ base: 4, md: 16 }} py={8}>
            <Breadcrumb.Root mb={4}>
                <Breadcrumb.List>
                    <Breadcrumb.Item>
                        <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item >
                        <Breadcrumb.CurrentLink>About Us</Breadcrumb.CurrentLink>
                    </Breadcrumb.Item>
                </Breadcrumb.List>
            </Breadcrumb.Root>

            <Flex
                direction={{ base: 'column', md: 'row' }}
                align="center"
                mb={12}
            >
                <Box flex={1} pr={{ md: 8 }} mb={{ base: 6, md: 0 }}>
                    <Heading as="h1" size="xl" mb={4}>
                        Our Story
                    </Heading>
                    <Text mb={4} lineHeight="taller">
                        Launched in 2015, EV Store is the region’s premier online shop for electric vehicle
                        solutions. We’ve grown from a small startup into a community of over 2,000 satisfied customers,
                        offering tailored EV charging gear, diagnostic tools, and expert support.
                    </Text>
                    <Text lineHeight="taller">
                        Today, we stock over 1 million products across multiple categories, empowering drivers to
                        embrace electric mobility affordably and reliably.
                    </Text>
                </Box>

                <Box flex={1}>
                    <Image
                        src="https://placehold.co/1000x1000"
                        alt="EV Store journey"
                        borderRadius="md"
                        objectFit="cover"
                        w="full"
                        h={{ base: 'auto', md: '300px' }}
                    />
                </Box>
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
                {[
                    {
                        title: 'Charge your car faster',
                        description: 'Speed up your EV charging with high-performance tools',
                    },
                    {
                        title: 'Find the perfect tools',
                        description: 'Get professional-grade EV tools tailored to your needs',
                    },
                    {
                        title: 'Simplify your EV service',
                        description: 'Everything you need to keep your EV running smoothly',
                    },
                ].map((item, idx) => (
                    <Box
                        key={idx}
                        borderWidth="1px"
                        borderRadius="md"
                        p={6}
                        textAlign="center"
                    >
                        <Center mb={4}>
                            <Flex
                                bg="green.400"
                                p={4}
                                borderRadius="full"
                                align="center"
                                justify="center"
                            >
                                <Icon as={FaBolt} boxSize={6} color="white" />
                            </Flex>
                        </Center>
                        <Heading size="md" mb={2}>
                            {item.title}
                        </Heading>
                        <Text color="gray.600">
                            {item.description}
                        </Text>
                    </Box>
                ))}
            </SimpleGrid>

        </Box>
    )
};

export default AboutUs;
