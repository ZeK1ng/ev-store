import React, { useEffect, useState } from 'react'
import {
    Box,
    Heading,
    Stack,
    Input,
    Textarea,
    NumberInput,
    Button,
    Image,
    SimpleGrid,
    Field,
    FileUpload,
    Float,
    useFileUploadContext,
    Select,
    Portal,
    Center,
    Spinner,
    Alert,
    createListCollection,
    Checkbox,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import { LuFileImage, LuX } from 'react-icons/lu'
import { HiUpload } from 'react-icons/hi'
import API from '@/utils/AxiosAPI';
import { toaster } from "@/components/ui/toaster";

interface Category {
    id: string;
    name: string;
    description: string;
    parentCategoryId?: string;
}

interface ItemFormValues {
    nameENG: string;
    nameGE: string;
    nameRUS: string;
    descriptionENG: string;
    descriptionGE: string;
    descriptionRUS: string;
    stockAmount: number;
    price: number;
    categoryId: string;
    mainImageFile: FileList;
    imagesFiles: FileList;
    isPopular: boolean;
}

interface Item extends Omit<ItemFormValues, 'mainImageFile' | 'imagesFiles'> {
    id: string;
    mainImage: string;
    images: string[];
    category: Category;
}

const FileUploadList: React.FC = () => {
    const upload = useFileUploadContext()
    const files = upload.acceptedFiles
    if (files.length === 0) return null
    return (
        <FileUpload.ItemGroup mt={2} flexDirection="row">
            {files.map(file => (
                <FileUpload.Item key={file.name} file={file} boxSize="20" p="2">
                    <FileUpload.ItemPreviewImage />
                    <Float placement="top-end">
                        <FileUpload.ItemDeleteTrigger boxSize="4" layerStyle="fill.solid">
                            <LuX />
                        </FileUpload.ItemDeleteTrigger>
                    </Float>
                </FileUpload.Item>
            ))}
        </FileUpload.ItemGroup>
    )
}

const ItemsManagementAdminPage: React.FC = () => {
    const { id } = useParams<'id'>();
    const navigate = useNavigate();
    const isCreate = id === 'create';

    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [existingItem, setExistingItem] = useState<Item | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
        control
    } = useForm<ItemFormValues>();

    const fetchCategories = async () => {
        try {
            const response = await API.get('/category/all');
            setCategories(response.data);
        } catch (error) {
            toaster.error({
                title: 'Error',
                description: 'Failed to fetch categories'
            });
        }
    };

    const fetchItem = async (itemId: string) => {
        try {
            setIsLoading(true);
            setApiError(null);
            const response = await API.get(`/admin/products/${itemId}`);
            const item = response.data;
            setExistingItem(item);
            reset({
                nameENG: item.nameENG,
                nameGE: item.nameGE,
                nameRUS: item.nameRUS,
                descriptionENG: item.descriptionENG,
                descriptionGE: item.descriptionGE,
                descriptionRUS: item.descriptionRUS,
                stockAmount: item.stockAmount,
                price: item.price,
                categoryId: item.category.id,
                isPopular: item.isPopular
            });
        } catch (error) {
            setApiError('Error fetching item');
            toaster.error({
                title: 'Error',
                description: 'Failed to fetch item details'
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
        if (!isCreate && id) {
            fetchItem(id);
        }
    }, [id, isCreate]);

    const onSubmit = async (data: ItemFormValues) => {
        try {
            setIsSubmitting(true);
            setApiError(null);

            const formData = {
                nameGE: data.nameGE,
                nameENG: data.nameENG,
                nameRUS: data.nameRUS,
                descriptionGE: data.descriptionGE,
                descriptionENG: data.descriptionENG,
                descriptionRUS: data.descriptionRUS,
                price: data.price,
                stockAmount: data.stockAmount,
                category: {
                    id: data.categoryId
                },
                isPopular: data.isPopular
            };

            if (isCreate) {
                await API.post('/admin/products', formData);
                toaster.success({
                    title: 'Success',
                    description: 'Item created successfully'
                });
            } else if (id) {
                await API.put(`/admin/products/${id}`, formData);
                toaster.success({
                    title: 'Success',
                    description: 'Item updated successfully'
                });
            }

            navigate('/cms-admin/items');
        } catch (error) {
            setApiError(isCreate ? 'Error creating item' : 'Error updating item');
            toaster.error({
                title: 'Error',
                description: isCreate ? 'Failed to create item' : 'Failed to update item'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const existingCategories = createListCollection({
        items: categories.map(cat => ({
            id: cat.id,
            value: cat.name,
            description: cat.description,
            parentId: cat.parentCategoryId || ''
        }))
    });

    if (isLoading) {
        return (
            <Center minH="90vh">
                <Spinner size="xl" borderWidth="4px" />
            </Center>
        );
    }

    if (!isCreate && id && existingItem === null) {
        return (
            <Box p={16} maxW="800px" mx="auto" textAlign="center">
                <Heading mb={4}>Item Not Found</Heading>
                <Heading size="md" mb={6}>No item exists with ID "{id}".</Heading>
                <Button colorScheme="green">
                    <a href="/cms-admin/items/create">
                        Create New Item
                    </a>
                </Button>
            </Box>
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
            <Heading mb={6} textAlign="center">
                {isCreate ? 'Create New Item' : 'Edit Item'}
            </Heading>

            <Box as="form" onSubmit={handleSubmit(onSubmit)}>
                <Stack gap={6}>
                    <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
                        <Field.Root id="nameENG" invalid={!!errors.nameENG}>
                            <Field.Label>Name (EN)</Field.Label>
                            <Input
                                placeholder="English name"
                                {...register('nameENG', { required: 'English Name is Required' })}
                            />
                            {errors.nameENG && <Field.ErrorText>{errors.nameENG.message}</Field.ErrorText>}
                        </Field.Root>

                        <Field.Root id="nameGE" invalid={!!errors.nameGE}>
                            <Field.Label>Name (GE)</Field.Label>
                            <Input
                                placeholder="Georgian name"
                                {...register('nameGE', { required: 'Georgian Name is Required' })}
                            />
                            {errors.nameGE && <Field.ErrorText>{errors.nameGE.message}</Field.ErrorText>}
                        </Field.Root>

                        <Field.Root id="nameRUS" invalid={!!errors.nameRUS}>
                            <Field.Label>Name (RU)</Field.Label>
                            <Input
                                placeholder="Russian name"
                                {...register('nameRUS', { required: 'Russian Name is Required' })}
                            />
                            {errors.nameRUS && <Field.ErrorText>{errors.nameRUS.message}</Field.ErrorText>}
                        </Field.Root>
                    </SimpleGrid>

                    <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
                        <Field.Root id="descriptionENG" invalid={!!errors.descriptionENG}>
                            <Field.Label>Description (EN)</Field.Label>
                            <Textarea
                                placeholder="English description"
                                {...register('descriptionENG', { required: 'English Description is Required' })}
                            />
                            {errors.descriptionENG && <Field.ErrorText>{errors.descriptionENG.message}</Field.ErrorText>}
                        </Field.Root>

                        <Field.Root id="descriptionGE" invalid={!!errors.descriptionGE}>
                            <Field.Label>Description (GE)</Field.Label>
                            <Textarea
                                placeholder="Georgian description"
                                {...register('descriptionGE', { required: 'Georgian Description is Required' })}
                            />
                            {errors.descriptionGE && <Field.ErrorText>{errors.descriptionGE.message}</Field.ErrorText>}
                        </Field.Root>

                        <Field.Root id="descriptionRUS" invalid={!!errors.descriptionRUS}>
                            <Field.Label>Description (RU)</Field.Label>
                            <Textarea
                                placeholder="Russian description"
                                {...register('descriptionRUS', { required: 'Russian Description is Required' })}
                            />
                            {errors.descriptionRUS && <Field.ErrorText>{errors.descriptionRUS.message}</Field.ErrorText>}
                        </Field.Root>
                    </SimpleGrid>

                    <Field.Root id="categoryId" invalid={!!errors.categoryId}>
                        <Field.Label>Category</Field.Label>
                        <Select.Root
                            collection={existingCategories}
                            width="100%"
                            onValueChange={e => setValue('categoryId', e.items[0]?.id)}
                        >
                            <Select.HiddenSelect />
                            <Select.Control>
                                <Select.Trigger>
                                    <Select.ValueText placeholder="Select category" />
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
                        {errors.categoryId && <Field.ErrorText>{errors.categoryId.message}</Field.ErrorText>}
                    </Field.Root>

                    <Field.Root id="price" invalid={!!errors.price}>
                        <Field.Label>Price</Field.Label>
                        <NumberInput.Root
                            defaultValue={String(existingItem?.price || 0)}
                            onValueChange={e => setValue('price', Number(e.value))}
                        >
                            <NumberInput.Control />
                            <NumberInput.Input />
                        </NumberInput.Root>
                        {errors.price && <Field.ErrorText>{errors.price.message}</Field.ErrorText>}
                    </Field.Root>

                    <Field.Root id="stockAmount" invalid={!!errors.stockAmount}>
                        <Field.Label>Stock Amount</Field.Label>
                        <NumberInput.Root
                            defaultValue={String(existingItem?.stockAmount || 0)}
                            onValueChange={e => setValue('stockAmount', Number(e.value))}
                        >
                            <NumberInput.Control />
                            <NumberInput.Input />
                        </NumberInput.Root>
                        {errors.stockAmount && <Field.ErrorText>{errors.stockAmount.message}</Field.ErrorText>}
                    </Field.Root>

                    <Field.Root id="isPopular">
                        <Checkbox.Root
                            defaultChecked={existingItem?.isPopular}
                            onCheckedChange={(details) => setValue('isPopular', Boolean(details.checked))}
                        >
                            <Checkbox.HiddenInput {...register('isPopular')} />
                            <Checkbox.Control />
                            <Checkbox.Label>Mark as Popular</Checkbox.Label>
                        </Checkbox.Root>
                    </Field.Root>

                    {/* Main Image Upload */}
                    <Field.Root id="mainImageFile">
                        <Field.Label>Main Image</Field.Label>
                        <FileUpload.Root accept="image/*" maxFiles={1}>
                            <FileUpload.HiddenInput {...register('mainImageFile')} />
                            <FileUpload.Trigger asChild>
                                <Button variant="outline" size="sm">
                                    <HiUpload /> Upload Main Image
                                </Button>
                            </FileUpload.Trigger>
                            <FileUploadList />
                        </FileUpload.Root>
                        {existingItem && !isCreate && (
                            <Box mt={2}>
                                <Image src={existingItem.mainImage} w="200px" borderRadius="md" />
                            </Box>
                        )}
                    </Field.Root>

                    {/* Additional Images Upload */}
                    <Field.Root id="imagesFiles">
                        <Field.Label>Additional Images</Field.Label>
                        <FileUpload.Root accept="image/*" maxFiles={15}>
                            <FileUpload.HiddenInput {...register('imagesFiles')} />
                            <FileUpload.Trigger asChild>
                                <Button variant="outline" size="sm">
                                    <LuFileImage /> Upload Images
                                </Button>
                            </FileUpload.Trigger>
                            <FileUploadList />
                        </FileUpload.Root>
                        {existingItem && existingItem.images.length > 0 && (
                            <SimpleGrid columns={4} gap={2} mt={2}>
                                {existingItem.images.map((src, idx) => (
                                    <Image
                                        key={idx}
                                        src={src}
                                        alt={`Image ${idx + 1}`}
                                        objectFit="cover"
                                        aspectRatio={1}
                                        borderRadius="md"
                                    />
                                ))}
                            </SimpleGrid>
                        )}
                    </Field.Root>

                    <Button
                        type="submit"
                        colorScheme="blue"
                        size="lg"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                        loadingText={isCreate ? 'Creating...' : 'Saving...'}
                    >
                        {
                            isCreate ? 'Create Item' : 'Save Changes'
                        }
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
};

export default ItemsManagementAdminPage;
