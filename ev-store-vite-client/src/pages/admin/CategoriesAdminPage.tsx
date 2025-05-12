import React, { useRef } from 'react'
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
    Dialog,
    CloseButton,
    createListCollection,
    Field,
    HStack
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { FaSitemap, FaPlus, FaEdit, FaTrashAlt, FaArrowLeft } from "react-icons/fa";


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

    const handleDelete = (id: string) => {
        console.log('Delete category with ID:', id)
    }

    const handleEdit = (id: string, data: CategoryFormValues) => {
        console.log('Edit category with ID:', id, 'New data:', data)
    }

    const existingCategories = createListCollection({
        items: [
            { id: '1', value: 'Electronics', description: 'Devices and gadgets', parentId: '' },
            { id: '2', value: 'Accessories', description: 'Supporting items', parentId: '1' },
            { id: '3', value: 'Apparel', description: 'Clothing and wearables', parentId: '' }
        ]
    })

    const contentRef = useRef<HTMLDivElement>(null)

    return (
        <Box p={8} maxW="800px" mx="auto">
            <Button size="xs" asChild variant='outline'>
                <a href="/cms-admin">
                    <FaArrowLeft />
                    Back to Admin Dashboard
                </a>
            </Button>
            <Heading mt={6} mb={6} textAlign="center">
                <HStack>
                    <FaSitemap />Create New Category
                </HStack>
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
                            onValueChange={e => setValue('parentId', e.items[0]?.id)}
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
                                                {opt.value}
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
                        Create Category <FaPlus />
                    </Button>
                </Stack>
            </Box>

            <Separator m={12} />

            <Heading size="lg" mb={4} textAlign="center">
                Existing Categories
            </Heading>
            <Stack gap={5}>
                {existingCategories.items.map((cat) => (
                    <Card.Root key={cat.id} overflow="hidden" size="sm">
                        <Card.Header>
                            <Heading size="md">{cat.value}</Heading>
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
                            <Dialog.Root>
                                <Dialog.Trigger asChild>
                                    <Button size="sm" variant="outline" mr={2}>
                                        <FaEdit />
                                        <Box display={{ base: 'none', md: 'inline' }}>
                                            Edit
                                        </Box>
                                    </Button>
                                </Dialog.Trigger>
                                <Portal>
                                    <Dialog.Backdrop />
                                    <Dialog.Positioner>
                                        <Dialog.Content ref={contentRef}>
                                            <Dialog.Header>
                                                <Dialog.Title>Edit Category</Dialog.Title>
                                                <Dialog.CloseTrigger asChild>
                                                    <CloseButton size="sm" />
                                                </Dialog.CloseTrigger>
                                            </Dialog.Header>
                                            <Dialog.Body>
                                                <Stack gap={4}>
                                                    <Field.Root id="edit-name" invalid={false}>
                                                        <Field.Label>Name</Field.Label>
                                                        <Input defaultValue={cat.value} onChange={e => setValue('name', e.target.value)} />
                                                    </Field.Root>
                                                    <Field.Root id="edit-description" invalid={false}>
                                                        <Field.Label>Description</Field.Label>
                                                        <Textarea defaultValue={cat.description} onChange={e => setValue('description', e.target.value)} />
                                                    </Field.Root>
                                                    {cat.parentId && (
                                                        <Text fontSize="sm" color="gray.500">
                                                            Parent: {cat.parentId}
                                                        </Text>
                                                    )}
                                                </Stack>
                                            </Dialog.Body>
                                            <Dialog.Footer>
                                                <Dialog.ActionTrigger asChild>
                                                    <Button variant="outline">Cancel</Button>
                                                </Dialog.ActionTrigger>
                                                <Button onClick={() => handleEdit(cat.id, {
                                                    id: cat.id,
                                                    name: (document.getElementById('edit-name') as HTMLInputElement).value,
                                                    description: (document.getElementById('edit-description') as HTMLTextAreaElement).value,
                                                })}>Save</Button>
                                            </Dialog.Footer>
                                        </Dialog.Content>
                                    </Dialog.Positioner>
                                </Portal>
                            </Dialog.Root>

                            <Dialog.Root>
                                <Dialog.Trigger asChild>
                                    <Button size="sm" colorPalette="red">
                                        <FaTrashAlt />
                                        <Box display={{ base: 'none', md: 'inline' }}>
                                            Delete
                                        </Box>
                                    </Button>
                                </Dialog.Trigger>

                                <Portal>
                                    <Dialog.Backdrop />
                                    <Dialog.Positioner>
                                        <Dialog.Content>
                                            <Dialog.Header>
                                                <Dialog.Title>Confirm Deletion</Dialog.Title>
                                            </Dialog.Header>
                                            <Dialog.Body>
                                                Are you sure you want to delete the "{cat.value}" category?
                                            </Dialog.Body>
                                            <Dialog.Footer>
                                                <Dialog.ActionTrigger asChild>
                                                    <Button variant="outline">Cancel</Button>
                                                </Dialog.ActionTrigger>
                                                <Button colorPalette="red" onClick={() => handleDelete(cat.id)}>
                                                    Delete
                                                </Button>
                                            </Dialog.Footer>
                                            <Dialog.CloseTrigger asChild>
                                                <CloseButton size="sm" />
                                            </Dialog.CloseTrigger>
                                        </Dialog.Content>
                                    </Dialog.Positioner>
                                </Portal>
                            </Dialog.Root>
                        </Card.Footer>
                    </Card.Root>
                ))}
            </Stack>
        </Box>
    )
}

export default CategoriesAdminPage
