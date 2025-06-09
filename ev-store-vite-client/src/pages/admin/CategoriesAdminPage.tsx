import React, { useRef, useEffect, useState } from 'react'
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
    HStack,
    Alert,
    Center,
    Spinner,
    EmptyState,
    VStack,
    ButtonGroup
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { FaSitemap, FaPlus, FaEdit, FaTrashAlt, FaArrowLeft } from "react-icons/fa";
import { LuFolderOpen } from "react-icons/lu";
import API from '@/utils/AxiosAPI';
import { toaster } from "@/components/ui/toaster";
import { useTranslation } from 'react-i18next';

interface Category {
    id: string;
    name: string;
    description: string;
    parentCategoryId?: string;
}

interface CategoryFormValues {
    name: string;
    description: string;
    parentCategoryId?: string;
}

const CategoriesAdminPage: React.FC = () => {
    const { t } = useTranslation('common');
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [apiError, setApiError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors }
    } = useForm<CategoryFormValues>()

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            setApiError(null);
            const response = await API.get('/category/all');
            setCategories(response.data);
        } catch (error) {
            setApiError('Error fetching categories');
            toaster.error({
                title: 'Error',
                description: 'Failed to fetch categories'
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const onSubmit = async (data: CategoryFormValues) => {
        try {
            setIsSubmitting(true);
            setApiError(null);
            await API.post('/admin/categories', { data: data.description }, {
                params: {
                    name: data.name,
                    parentCategoryId: data.parentCategoryId || ''
                },

            });

            toaster.success({
                title: 'Success',
                description: 'Category created successfully'
            });

            reset();
            fetchCategories();
        } catch (error) {
            setApiError('Error creating category');
            toaster.error({
                title: 'Error',
                description: 'Failed to create category'
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleDelete = async (id: string) => {
        try {
            setIsDeleting(id);
            setApiError(null);
            await API.delete(`/admin/categories/${id}`);
            toaster.success({
                title: 'Success',
                description: 'Category deleted successfully'
            });
            fetchCategories();
        } catch (error) {
            setApiError('Error deleting category');
            toaster.error({
                title: 'Error',
                description: 'Failed to delete category'
            });
        } finally {
            setIsDeleting(null);
        }
    }

    const handleEdit = async (id: string, data: CategoryFormValues) => {
        try {
            setIsEditing(id);
            setApiError(null);
            await API.put(`/admin/categories/${id}`, null, {
                params: {
                    name: data.name,
                    description: data.description
                }
            });

            toaster.success({
                title: 'Success',
                description: 'Category updated successfully'
            });

            fetchCategories();
        } catch (error) {
            setApiError('Error updating category');
            toaster.error({
                title: 'Error',
                description: 'Failed to update category'
            });
        } finally {
            setIsEditing(null);
        }
    }

    const existingCategories = createListCollection({
        items: categories.map(cat => ({
            id: cat.id,
            value: cat.name,
            description: cat.description,
            parentId: cat.parentCategoryId || ''
        }))
    });

    const contentRef = useRef<HTMLDivElement>(null)

    if (isLoading) {
        return (
            <Center minH="90vh">
                <Spinner size="xl" borderWidth="4px" />
            </Center>
        );
    }

    return (
        <Box p={8} maxW="800px" mx="auto">
            {apiError && (
                <Alert.Root status="error" mb={4}>
                    <Alert.Indicator />
                    <Alert.Title>{apiError}</Alert.Title>
                </Alert.Root>
            )}
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

                    <Field.Root id="parentCategoryId" invalid={false}>
                        <Field.Label>Parent Category (optional)</Field.Label>
                        <Select.Root
                            collection={existingCategories}
                            width="100%"
                            onValueChange={e => setValue('parentCategoryId', e.items[0]?.id)}
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
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <HStack>
                                <Spinner size="sm" />
                                <Text>Creating...</Text>
                            </HStack>
                        ) : (
                            <>Create Category <FaPlus /></>
                        )}
                    </Button>
                </Stack>
            </Box>

            <Separator m={12} />

            <Heading size="lg" mb={4} textAlign="center">
                Existing Categories
            </Heading>

            {categories.length === 0 ? (
                <EmptyState.Root>
                    <EmptyState.Content>
                        <EmptyState.Indicator>
                            <LuFolderOpen size={48} />
                        </EmptyState.Indicator>
                        <VStack textAlign="center">
                            <EmptyState.Title>
                                No Categories Yet
                            </EmptyState.Title>
                            <EmptyState.Description>
                                Start by creating your first category to organize your products
                            </EmptyState.Description>
                        </VStack>
                    </EmptyState.Content>
                </EmptyState.Root>
            ) : (
                <Stack gap={5}>
                    {categories.map((cat) => (
                        <Card.Root key={cat.id} overflow="hidden" size="sm">
                            <Card.Header>
                                <Heading size="md">{cat.name}</Heading>
                                {cat.parentCategoryId && (
                                    <Text fontSize="sm" color="gray.500">
                                        Parent: {categories.find(p => p.id === cat.parentCategoryId)?.name || cat.parentCategoryId}
                                    </Text>
                                )}
                            </Card.Header>
                            <Card.Body>
                                <Text>{cat.description}</Text>
                            </Card.Body>
                            <Card.Footer justifyContent="flex-end">
                                <Dialog.Root>
                                    <Dialog.Trigger asChild>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            mr={2}
                                            disabled={isEditing === cat.id}
                                        >
                                            {isEditing === cat.id ? (
                                                <HStack>
                                                    <Spinner size="sm" />
                                                    <Box display={{ base: 'none', md: 'inline' }}>
                                                        Saving...
                                                    </Box>
                                                </HStack>
                                            ) : (
                                                <>
                                                    <FaEdit />
                                                    <Box display={{ base: 'none', md: 'inline' }}>
                                                        Edit
                                                    </Box>
                                                </>
                                            )}
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
                                                            <Input defaultValue={cat.name} onChange={e => setValue('name', e.target.value)} />
                                                        </Field.Root>
                                                        <Field.Root id="edit-description" invalid={false}>
                                                            <Field.Label>Description</Field.Label>
                                                            <Textarea defaultValue={cat.description} onChange={e => setValue('description', e.target.value)} />
                                                        </Field.Root>
                                                        {cat.parentCategoryId && (
                                                            <Text fontSize="sm" color="gray.500">
                                                                Parent: {categories.find(p => p.id === cat.parentCategoryId)?.name || cat.parentCategoryId}
                                                            </Text>
                                                        )}
                                                    </Stack>
                                                </Dialog.Body>
                                                <Dialog.Footer>
                                                    <Dialog.ActionTrigger asChild>
                                                        <Button variant="outline" disabled={isEditing === cat.id}>Cancel</Button>
                                                    </Dialog.ActionTrigger>
                                                    <Button
                                                        onClick={() => handleEdit(cat.id, {
                                                            name: (document.getElementById('edit-name') as HTMLInputElement).value,
                                                            description: (document.getElementById('edit-description') as HTMLTextAreaElement).value,
                                                        })}
                                                        disabled={isEditing === cat.id}
                                                    >
                                                        {isEditing === cat.id ? 'Saving...' : 'Save'}
                                                    </Button>
                                                </Dialog.Footer>
                                            </Dialog.Content>
                                        </Dialog.Positioner>
                                    </Portal>
                                </Dialog.Root>

                                <Dialog.Root>
                                    <Dialog.Trigger asChild>
                                        <Button
                                            size="sm"
                                            colorPalette="red"
                                            disabled={isDeleting === cat.id}
                                        >
                                            {isDeleting === cat.id ? (
                                                <HStack>
                                                    <Spinner size="sm" />
                                                    <Box display={{ base: 'none', md: 'inline' }}>
                                                        Deleting...
                                                    </Box>
                                                </HStack>
                                            ) : (
                                                <>
                                                    <FaTrashAlt />
                                                    <Box display={{ base: 'none', md: 'inline' }}>
                                                        Delete
                                                    </Box>
                                                </>
                                            )}
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
                                                    Are you sure you want to delete the "{cat.name}" category?
                                                </Dialog.Body>
                                                <Dialog.Footer>
                                                    <Dialog.ActionTrigger asChild>
                                                        <Button variant="outline" disabled={isDeleting === cat.id}>Cancel</Button>
                                                    </Dialog.ActionTrigger>
                                                    <Button
                                                        colorPalette="red"
                                                        onClick={() => handleDelete(cat.id)}
                                                        disabled={isDeleting === cat.id}
                                                    >
                                                        {isDeleting === cat.id ? 'Deleting...' : 'Delete'}
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
            )}
        </Box>
    )
}

export default CategoriesAdminPage
