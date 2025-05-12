import React from 'react'
import {
    Box,
    SimpleGrid,
    Heading,
    Button,
    Text,
    Card,
} from '@chakra-ui/react'

const AdminPage: React.FC = () => {
    return (
        <Box p={8}>
            <Heading size="4xl" mb={6}>Admin Dashboard</Heading>

            <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
                <Card.Root overflow="hidden">
                    <Card.Body>
                        <Heading size="4xl" mb={2}> Items</Heading>
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
                        <Heading size="4xl" mb={2}> Categories</Heading>
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
        </Box>
    )
}

export default AdminPage
