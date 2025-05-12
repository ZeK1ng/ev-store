import React from 'react'
import {
    Box,
    SimpleGrid,
    Heading,
    Button,
    Text,
    Card,
    HStack,
} from '@chakra-ui/react'
import { FaSitemap, FaLayerGroup, FaChartBar } from "react-icons/fa";


const AdminPage: React.FC = () => {
    return (
        <Box p={8}>
            <Heading size="4xl" mb={6}>Admin Dashboard</Heading>

            <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
                <Card.Root overflow="hidden">
                    <Card.Body>
                        <Heading size="4xl" mb={2}>
                            <HStack gap={4}>
                                <FaLayerGroup /> Items
                            </HStack>
                        </Heading>
                        <Text>Create and edit catalog items.</Text>
                    </Card.Body>
                    <Card.Footer >
                        <Button
                            asChild
                            colorScheme="green"
                        >
                            <a href="/cms-admin/items">

                                Go to Items
                            </a>
                        </Button>
                    </Card.Footer>
                </Card.Root>

                {/* Manage Categories Card */}
                <Card.Root overflow="hidden">
                    <Card.Body>
                        <Heading size="4xl" mb={2}>
                            <HStack gap={4}>
                                <FaSitemap /> Categories
                            </HStack>

                        </Heading>
                        <Text>Create and edit item categories.</Text>
                    </Card.Body>
                    <Card.Footer>
                        <Button
                            asChild
                            colorScheme="blue"
                        >
                            <a href="/cms-admin/categories">Go to Categories</a>
                        </Button>
                    </Card.Footer>
                </Card.Root>
            </SimpleGrid>

            <SimpleGrid mt={8}>
                <Card.Root overflow="hidden">
                    <Card.Body>
                        <Heading size="4xl" mb={2}>
                            <HStack gap={4}>
                                <FaChartBar /> Analytics
                            </HStack>

                        </Heading>
                        <Text>
                            View analytics and reports, including sales and user activity. 
                        </Text>
                    </Card.Body>
                    <Card.Footer>
                        <Button
                            loading
                            loadingText="Coming soon..."
                        >
                        </Button>
                    </Card.Footer>
                </Card.Root>
            </SimpleGrid>
        </Box>
    )
}

export default AdminPage
