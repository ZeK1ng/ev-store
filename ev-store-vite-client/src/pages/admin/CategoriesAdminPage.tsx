import React from 'react'
import {
    Box,
    Button,
    Textarea,
    Stack,
    Input,
    Heading,
    Select,
    Portal,
    Card,
    Text,
    Separator,
    createListCollection
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { Field } from '@chakra-ui/react'

interface CategoryFormValues {
    id: string,
    name: string
    description: string
    parentId?: string
}

const CategoriesAdminPage: React.FC = () => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<CategoryFormValues>()

    const onSubmit = (data: CategoryFormValues) => {
        console.log('New category:', data)
    }

    const existingCategories = createListCollection({
        items: [
            { id: '1', name: 'Electronics', description: 'Devices and gadgets', parentId: '' },
            { id: '2', name: 'Accessories', description: 'Supporting items', parentId: '1' },
            { id: '3', name: 'Apparel', description: 'Clothing and wearables', parentId: '' }
        ]
    })

    return (
        <Box p={8} maxW="800px" mx="auto">
            <Heading mb={6} textAlign="center">
                Create New Category
            </Heading>

            <Box as="form" onSubmit={handleSubmit(onSubmit)}>
                <Stack gap={5}>
                    <Field.Root id="name" invalid={!!errors.name}>
                        <Field.Label>Name</Field.Label>
                        <Input
                            placeholder="Enter category name"
                            {...register('name', { required: 'Name is required' })}
                        />
                        {errors.name && (
                            <Field.ErrorText>{errors.name.message}</Field.ErrorText>
                        )}
                    </Field.Root>

                    <Field.Root id="description" invalid={!!errors.description}>
                        <Field.Label>Description</Field.Label>
                        <Textarea
                            placeholder="Enter category description"
                            {...register('description', { required: 'Description is required' })}
                        />
                        {errors.description && (
                            <Field.ErrorText>{errors.description.message}</Field.ErrorText>
                        )}
                    </Field.Root>

                    <Field.Root id="parentId" invalid={false}>
                        <Field.Label>Parent Category (optional)</Field.Label>
                        <Select.Root
                            collection={existingCategories}
                            width="100%"
                            positioning={{ sameWidth: true }}
                            onValueChange={(e) => setValue('parentId', e.value[0])}
                        >
                            <Select.HiddenSelect />
                            <Select.Control>
                                <Select.Trigger>
                                    <Select.ValueText placeholder="Select parent category" />
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                    <Select.Indicator />
                                </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                                <Select.Positioner>
                                    <Select.Content>
                                        {existingCategories.items.map((opt) => (
                                            <Select.Item item={opt} key={opt.id}>
                                                {opt.name}
                                                <Select.ItemIndicator />
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>
                    </Field.Root>

                    <Button
                        type="submit"
                        colorScheme="blue"
                        size="lg"
                        loading={isSubmitting}
                    >
                        Create Category
                    </Button>
                </Stack>
            </Box>

            <Separator  m={12} />

            <Heading size="lg" mb={4} textAlign="center">
                Existing Categories
            </Heading>
            <Stack gap={5}>
                {existingCategories.items.map((cat) => (
                    <Card.Root key={cat.id} overflow="hidden" size="sm">
                        <Card.Header>
                            <Heading size="md">{cat.name}</Heading>
                            {cat.parentId && (
                                <Text fontSize="sm" color="gray.500">
                                    Parent: {cat.parentId}
                                </Text>
                            )}
                        </Card.Header>
                        <Card.Body>
                            <Text >{cat.description}</Text>
                        </Card.Body>
                        <Card.Footer justifyContent="flex-end">
                            <Button size="sm" variant="outline" mr={2}>
                                Edit
                            </Button>
                            <Button size="sm" colorPalette="red">
                                Delete
                            </Button>
                        </Card.Footer>
                    </Card.Root>
                ))}
            </Stack>
        </Box>
    )
}

export default CategoriesAdminPage
