import React, { useEffect, useState } from 'react'
import {
    Box,
    Heading,
    Stack,
    Input,
    Textarea,
    NumberInput,
    Button,
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
    HStack,
    InputGroup
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import { LuFileImage, LuX } from 'react-icons/lu'
import { FaArrowLeft } from 'react-icons/fa'
import { HiUpload } from 'react-icons/hi'
import API from '@/utils/AxiosAPI';
import { toaster } from "@/components/ui/toaster";
import CachedImage from "@/utils/CachedImage"

interface Category {
    id: number;
    name: string;
    description: string;
    parentCategoryName?: string;
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
    categoryId: number;
    mainImageFile: FileList;
    imagesFiles: FileList;
    isPopular: boolean;
    comingSoon: boolean;
    tutorialLink: string;
    itemCode: string;
}

interface Item extends Omit<ItemFormValues, 'mainImageFile' | 'imagesFiles'> {
    id: string;
    mainImageId: number;
    imageIds: number[];
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
    const [mainImageId, setMainImageId] = useState<number | null>(null);
    const [mainImageUploading, setMainImageUploading] = useState(false);
    const [additionalImageIds, setAdditionalImageIds] = useState<number[]>([]);
    const [additionalImagesUploading, setAdditionalImagesUploading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<ItemFormValues>();

    const fetchCategories = async () => {
        try {
            const response = await API.get('/category/list-all');
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
            const response = await API.get(`/product/${itemId}`);
            const item = response.data;
            setExistingItem(item);
            setMainImageId(item.mainImageId || null);
            setAdditionalImageIds(item.imageIds || []);
            reset({
                nameENG: item.nameENG,
                nameGE: item.nameGE,
                nameRUS: item.nameRUS,
                descriptionENG: item.descriptionENG,
                descriptionGE: item.descriptionGE,
                descriptionRUS: item.descriptionRUS,
                stockAmount: item.stockAmount,
                price: item.price,
                categoryId: item.categoryId,
                isPopular: item.isPopular,
                comingSoon: item.comingSoon,
                itemCode: item.itemCode
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

    const handleMainImageUpload = async (file: File) => {
        if (!file) return;
        setMainImageUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const response = await API.post('admin/image/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.data && response.data.length > 0) {
                setMainImageId(response.data[0].imageId);
            }
        } catch (error) {
            toaster.error({ title: 'Error', description: 'Failed to upload image' });
        } finally {
            setMainImageUploading(false);
        }
    };

    const handleAdditionalImagesUpload = async (files: File[]) => {
        if (!files || files.length === 0) return;
        setAdditionalImagesUploading(true);
        try {
            const formData = new FormData();
            files.forEach(file => formData.append('image', file));
            const response = await API.post('admin/image/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.data && response.data.length > 0) {
                setAdditionalImageIds(response.data.map((img: any) => img.imageId));
            }
        } catch (error) {
            toaster.error({ title: 'Error', description: 'Failed to upload images' });
        } finally {
            setAdditionalImagesUploading(false);
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
                categoryId: data.categoryId,
                isPopular: data.isPopular,
                comingSoon: data.comingSoon,
                mainImageId: mainImageId,
                imageIds: additionalImageIds,
                tutorialLink: data.tutorialLink,
                itemCode: data.itemCode
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
            value: String(cat.id),
            label: cat.parentCategoryName ? cat.parentCategoryName + ' -- ' + cat.name : cat.name,
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
            <Button size="xs" asChild variant='outline'>
                <a href="/cms-admin/items">
                    <FaArrowLeft />
                    Back to Items Dashboard
                </a>
            </Button>
            {apiError && (
                <Alert.Root status="error" m={4}>
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
                                defaultValue={existingItem?.nameENG}
                                placeholder="English name"
                                {...register('nameENG', { required: 'English Name is Required' })}
                            />
                            {errors.nameENG && <Field.ErrorText>{errors.nameENG.message}</Field.ErrorText>}
                        </Field.Root>

                        <Field.Root id="nameGE" invalid={!!errors.nameGE}>
                            <Field.Label>Name (GE)</Field.Label>
                            <Input
                                defaultValue={existingItem?.nameGE}
                                placeholder="Georgian name"
                                {...register('nameGE', { required: 'Georgian Name is Required' })}
                            />
                            {errors.nameGE && <Field.ErrorText>{errors.nameGE.message}</Field.ErrorText>}
                        </Field.Root>

                        <Field.Root id="nameRUS" invalid={!!errors.nameRUS}>
                            <Field.Label>Name (RU)</Field.Label>
                            <Input
                                defaultValue={existingItem?.nameRUS}
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
                                defaultValue={existingItem?.descriptionENG}
                                placeholder="English description"
                                {...register('descriptionENG', { required: 'English Description is Required' })}
                            />
                            {errors.descriptionENG && <Field.ErrorText>{errors.descriptionENG.message}</Field.ErrorText>}
                        </Field.Root>

                        <Field.Root id="descriptionGE" invalid={!!errors.descriptionGE}>
                            <Field.Label>Description (GE)</Field.Label>
                            <Textarea
                                defaultValue={existingItem?.descriptionGE}
                                placeholder="Georgian description"
                                {...register('descriptionGE', { required: 'Georgian Description is Required' })}
                            />
                            {errors.descriptionGE && <Field.ErrorText>{errors.descriptionGE.message}</Field.ErrorText>}
                        </Field.Root>

                        <Field.Root id="descriptionRUS" invalid={!!errors.descriptionRUS}>
                            <Field.Label>Description (RU)</Field.Label>
                            <Textarea
                                defaultValue={existingItem?.descriptionRUS}
                                placeholder="Russian description"
                                {...register('descriptionRUS', { required: 'Russian Description is Required' })}
                            />
                            {errors.descriptionRUS && <Field.ErrorText>{errors.descriptionRUS.message}</Field.ErrorText>}
                        </Field.Root>
                    </SimpleGrid>


                    <Field.Root id="tutorial" invalid={!!errors.tutorialLink}>
                        <Field.Label>Tutorial</Field.Label>
                        <InputGroup
                            startElement="https://"
                            startElementProps={{ color: "fg.muted" }}
                        >
                            <Input
                                ps="7ch"
                                placeholder="something.com"
                                {...register('tutorialLink')}
                                defaultValue={existingItem?.tutorialLink}
                            />
                        </InputGroup>
                    </Field.Root>

                    <Field.Root id="categoryId" invalid={!!errors.categoryId}>
                        <Field.Label>Category</Field.Label>
                        <Select.Root
                            collection={existingCategories}
                            width="100%"
                            defaultValue={existingItem?.categoryId ? [String(existingItem?.categoryId)] : undefined}
                            onValueChange={e => setValue('categoryId', Number(e.items[0]?.id))}
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
                                                <Select.ItemText>{opt.label}</Select.ItemText>
                                                <Select.ItemIndicator />
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>
                        {errors.categoryId && <Field.ErrorText>{errors.categoryId.message}</Field.ErrorText>}
                    </Field.Root>

                    <HStack>
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

                        <Field.Root id="itemCode" invalid={!!errors.itemCode}>
                            <Field.Label>Item Code*</Field.Label>
                            <Input
                                defaultValue={existingItem?.itemCode}
                                placeholder="Enter item code"
                                {...register('itemCode', { required: 'Item Code is Required' })}
                            />
                            {errors.itemCode && <Field.ErrorText>{errors.itemCode.message}</Field.ErrorText>}
                        </Field.Root>
                    </HStack>

                    <Field.Root id="isPopular">
                        <Checkbox.Root
                            defaultChecked={existingItem?.isPopular}
                            onCheckedChange={(details) => setValue('isPopular', Boolean(details.checked))}
                        >
                            <Checkbox.HiddenInput />
                            <Checkbox.Control />
                            <Checkbox.Label>Mark as Popular</Checkbox.Label>
                        </Checkbox.Root>
                    </Field.Root>
                    <Field.Root id="comingSoon">
                        <Checkbox.Root
                            defaultChecked={existingItem?.comingSoon}
                            onCheckedChange={(details) => setValue('comingSoon', Boolean(details.checked))}
                        >
                            <Checkbox.HiddenInput />
                            <Checkbox.Control />
                            <Checkbox.Label>Coming Soon</Checkbox.Label>
                        </Checkbox.Root>
                    </Field.Root>

                    <Field.Root id="mainImageFile">
                        <Field.Label>Main Image</Field.Label>
                        <FileUpload.Root
                            accept="image/*"
                            maxFiles={1}
                            onFileAccept={async (files) => {
                                await handleMainImageUpload(files.files[0]);
                            }}
                        >
                            <FileUpload.HiddenInput {...register('mainImageFile')} />
                            <FileUpload.Trigger asChild>
                                <Button variant="outline" size="sm" loading={mainImageUploading}>
                                    <HiUpload /> Upload Main Image
                                </Button>
                            </FileUpload.Trigger>
                            <FileUploadList />
                        </FileUpload.Root>
                        {existingItem && !isCreate && (
                            <Box mt={2}>
                                <CachedImage imageId={existingItem.mainImageId} width="200px" height="200px" objectFit="cover" borderRadius="md" />
                            </Box>
                        )}
                    </Field.Root>

                    <Field.Root id="imagesFiles">
                        <Field.Label>Additional Images</Field.Label>
                        <FileUpload.Root
                            accept="image/*"
                            maxFiles={15}
                            onFileAccept={async (files) => {
                                await handleAdditionalImagesUpload(files.files);
                            }}
                        >
                            <FileUpload.HiddenInput {...register('imagesFiles')} />
                            <FileUpload.Trigger asChild>
                                <Button variant="outline" size="sm" loading={additionalImagesUploading}>
                                    <LuFileImage /> Upload Images
                                </Button>
                            </FileUpload.Trigger>
                            <FileUploadList />
                        </FileUpload.Root>
                        {existingItem && existingItem.imageIds.length > 0 && (
                            <SimpleGrid columns={4} gap={2} mt={2}>
                                {existingItem.imageIds.map((src, idx) => (
                                    <CachedImage key={idx} imageId={src} w="100px" h="100px" borderRadius="md" />
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
