import React, { useState } from 'react'
import {
    Box,
    Tabs,
    Button,
    VStack,
    Heading,
    HStack
} from '@chakra-ui/react'

interface Category {
    id: number
    name: string
    description: string
}
interface Item {
    id: number
    title: string
    description: string
    categoryId: number
    imageUrl: string
}

const AdminPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([])
    const [items, setItems] = useState<Item[]>([])



    return (
        <Box p={8}>
            <Heading mb={6}>Admin Dashboard</Heading>

            <Tabs.Root  defaultValue="item">
                <Tabs.List mb="1em">
                    <Tabs.Trigger value="item">Items</Tabs.Trigger>
                    <Tabs.Trigger value="category">Categories</Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="item">
                    <VStack as="form" align="stretch" gap={4}
                        onSubmit={e => e.preventDefault()}
                    >
                        <Heading size="md">Create New Item</Heading>


                        <HStack gap={4} pt={4}>
                            <Button colorScheme="green" onClick={() => { }}>
                                Create Item
                            </Button>
                        </HStack>
                    </VStack>

                    <Heading size="sm" mt={8} mb={4}>Existing Items</Heading>
                    <VStack align="stretch" gap={2}>
                        {items.map(it => (
                            <Box key={it.id} p={3} borderWidth="1px" borderRadius="md">
                                {it.title} (Category: {categories.find(c => c.id === it.categoryId)?.name})
                            </Box>
                        ))}
                    </VStack>
                </Tabs.Content>

                <Tabs.Content value="category">
                    <VStack as="form" align="stretch" gap={4}
                        onSubmit={e => e.preventDefault()}
                    >
                        <Heading size="md">Create New Category</Heading>



                        <Button colorScheme="blue" onClick={() => { }}>
                            Create Category
                        </Button>
                    </VStack>

                    <Heading size="sm" mt={8} mb={4}>Existing Categories</Heading>
                    <VStack align="stretch" gap={2}>
                        {categories.map(cat => (
                            <Box key={cat.id} p={3} borderWidth="1px" borderRadius="md">
                                {cat.name}
                            </Box>
                        ))}
                    </VStack>
                </Tabs.Content>
            </Tabs.Root>
        </Box>
    )
}

export default AdminPage
