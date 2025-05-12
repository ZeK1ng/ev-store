import React, { useEffect, useState } from 'react'
import {
    Box,
    Heading,
    Stack,
    Input,
    Textarea,
    IconButton,
    NumberInput,
    Button,
    Image,
    SimpleGrid,
    Field,
    HStack,
    FileUpload,
    Float,
    useFileUploadContext,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import { LuPlus, LuMinus, LuFileImage, LuX } from 'react-icons/lu'
import { HiUpload } from 'react-icons/hi'

// Form values interface
interface ItemFormValues {
    nameEn: string
    nameGe: string
    nameRu: string
    descriptionEn: string
    descriptionGe: string
    descriptionRu: string
    quantity: number
    price: number
    mainImageFile: FileList
    imagesFiles: FileList
}

// Item type extends form values with URLs
interface Item extends Omit<ItemFormValues, 'mainImageFile' | 'imagesFiles'> {
    id: string
    mainImage: string
    images: string[]
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
    const { id } = useParams<'id'>()
    const navigate = useNavigate()
    const isCreate = id === 'create'

    const [items, setItems] = useState<Item[]>([
        {
            id: '1',
            nameEn: 'Fast Charger',
            descriptionEn: 'High-speed EV charger for home use.',
            quantity: 10,
            price: 299,
            mainImage: 'https://placehold.co/300x200',
            images: [
                'https://placehold.co/300x200',
                'https://placehold.co/300x200',
                'https://placehold.co/300x200',
                'https://placehold.co/300x200',
                'https://placehold.co/300x200',
                'https://placehold.co/300x200',
                'https://placehold.co/300x200',
                'https://placehold.co/300x200',
            ],
            nameGe: 'სწრაფი დამტენი',
            nameRu: 'Быстрое зарядное устройство',
            descriptionGe: 'საუკეთესო სწრაფი დამტენი სახლში გამოსაყენებლად.',
            descriptionRu: 'Высокоскоростное зарядное устройство для дома.'
        },
        {
            id: '2',
            nameEn: 'OBD-II Scanner',
            descriptionEn: 'Diagnostic tool for EV maintenance.',
            quantity: 5,
            price: 149,
            mainImage: 'https://placehold.co/300x200',
            images: [
                'https://placehold.co/300x200',
                'https://placehold.co/300x200',
            ],
            nameGe: 'OBD-II სკანერი',
            nameRu: 'OBD-II сканер',
            descriptionGe: 'დიაგნოსტიკური ხელსაწყო EV-ის მომსახურებისთვის.',
            descriptionRu: 'Диагностический инструмент для обслуживания электромобилей.'
        },
        {
            id: '3',
            nameEn: 'Portable Charger',
            descriptionEn: 'Compact charger for on-the-go charging.',
            quantity: 20,
            price: 99,
            mainImage: 'https://placehold.co/300x200',
            images: [
                'https://placehold.co/300x200',
                'https://placehold.co/300x200',
                'https://placehold.co/300x200'
            ],
            nameGe: 'პორტატული დამტენი',
            nameRu: 'Портативное зарядное устройство',
            descriptionGe: 'კომპაქტური დამტენი გზაზე დატენვისთვის.',
            descriptionRu: 'Компактное зарядное устройство для зарядки в пути.'
        }
    ])

    const [existingItem, setExistingItem] = useState<Item | null>(null)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<ItemFormValues>()

    useEffect(() => {
        if (!isCreate && id) {
            const item = items.find(it => it.id === id)
            if (item) {
                setExistingItem(item)
                reset({
                    nameEn: item.nameEn,
                    descriptionEn: item.descriptionEn,
                    quantity: item.quantity,
                    price: item.price,
                    nameGe: item.nameGe,
                    nameRu: item.nameRu,
                    descriptionGe: item.descriptionGe,
                    descriptionRu: item.descriptionRu
                })
            }
        }
    }, [id, isCreate, items, reset])

    const onSubmit = (data: ItemFormValues) => {
        const mainImage = URL.createObjectURL(data.mainImageFile[0])
        const images = Array.from(data.imagesFiles || []).map(f => URL.createObjectURL(f))

        if (isCreate) {
            const newItem: Item = { id: Date.now().toString(), ...data, mainImage, images }
            console.log('New Item:', newItem);
            // submit newItem
        } else if (existingItem) {
            // update existing item
        }
        navigate('/cms-admin/items')
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
        )
    }

    return (
        <Box p={8} maxW="800px" mx="auto">
            <Heading mb={6} textAlign="center">
                {isCreate ? 'Create New Item' : 'Edit Item'}
            </Heading>

            <Box as="form" onSubmit={handleSubmit(onSubmit)}>
                <Stack gap={6}>
                    <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
                        <Field.Root id="nameEn" invalid={!!errors.nameEn} >
                            <Field.Label>Name (EN)</Field.Label>
                            <Input
                                placeholder="English name"
                                {...register('nameEn', { required: 'English Name is Required' })}
                            />
                            {errors.nameEn && <Field.ErrorText>{errors.nameEn.message}</Field.ErrorText>}
                        </Field.Root>

                        <Field.Root id="nameGe" invalid={!!errors.nameGe}>
                            <Field.Label>Name (GE)</Field.Label>
                            <Input
                                placeholder="Georgian name"
                                {...register('nameGe', { required: 'Georigan Name is Required' })}
                            />
                            {errors.nameGe && <Field.ErrorText>{errors.nameGe.message}</Field.ErrorText>}
                        </Field.Root>

                        <Field.Root id="nameRu" invalid={!!errors.nameRu}>
                            <Field.Label>Name (RU)</Field.Label>
                            <Input
                                placeholder="Russian name"
                                {...register('nameRu', { required: 'Russian Name is Required' })}
                            />
                            {errors.nameRu && <Field.ErrorText>{errors.nameRu.message}</Field.ErrorText>}
                        </Field.Root>
                    </SimpleGrid>

                    <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
                        <Field.Root id="descriptionEn" invalid={!!errors.descriptionEn}>
                            <Field.Label>Description (EN)</Field.Label>
                            <Textarea
                                placeholder="English description"
                                {...register('descriptionEn', { required: 'English Description is Required' })}
                            />
                            {errors.descriptionEn && <Field.ErrorText>{errors.descriptionEn.message}</Field.ErrorText>}
                        </Field.Root>

                        <Field.Root id="descriptionGe" invalid={!!errors.descriptionGe}>
                            <Field.Label>Description (GE)</Field.Label>
                            <Textarea
                                placeholder="Georgian description"
                                {...register('descriptionGe', { required: 'Georgian Description is Required' })}
                            />
                            {errors.descriptionGe && <Field.ErrorText>{errors.descriptionGe.message}</Field.ErrorText>}
                        </Field.Root>

                        <Field.Root id="descriptionRu" invalid={!!errors.descriptionRu}>
                            <Field.Label>Description (RU)</Field.Label>
                            <Textarea
                                placeholder="Russian description"
                                {...register('descriptionRu', { required: 'Russian Description is Required' })}
                            />
                            {errors.descriptionRu && <Field.ErrorText>{errors.descriptionRu.message}</Field.ErrorText>}
                        </Field.Root>
                    </SimpleGrid>

                    <Field.Root id="quantity" invalid={!!errors.quantity}>
                        <Field.Label>Quantity</Field.Label>
                        <NumberInput.Root unstyled defaultValue="1" spinOnPress={false} min={1} max={1000}>
                            <HStack gap="2">
                                <NumberInput.DecrementTrigger asChild>
                                    <IconButton variant="outline" size="sm">
                                        <LuMinus />
                                    </IconButton>
                                </NumberInput.DecrementTrigger >
                                <NumberInput.Input
                                    textAlign="center"
                                    fontSize="lg"
                                    maxW="3ch"
                                    {...register('quantity')}
                                />
                                <NumberInput.IncrementTrigger asChild >
                                    <IconButton variant="outline" size="sm">
                                        <LuPlus />
                                    </IconButton>
                                </NumberInput.IncrementTrigger>
                            </HStack>
                        </NumberInput.Root>
                    </Field.Root>

                    <Field.Root id="price" invalid={!!errors.price}>
                        <Field.Label>Price</Field.Label>
                        <NumberInput.Root defaultValue="50" min={1}>
                            <NumberInput.Control />
                            <NumberInput.Input {...register('price')} />
                        </NumberInput.Root>
                    </Field.Root>

                    {/* Main Image Upload */}
                    <Field.Root id="mainImageFile">
                        <Field.Label>Main Image</Field.Label>
                        <FileUpload.Root accept="image/*" maxFiles={1}>
                            <FileUpload.HiddenInput {...register('mainImageFile')}/>
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
                            <FileUpload.HiddenInput />
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

                    <Button type="submit" colorScheme="blue" size="lg" loading={isSubmitting}>
                        {isCreate ? 'Create Item' : 'Save Changes'}
                    </Button>
                </Stack>
            </Box>
        </Box>
    )
}

export default ItemsManagementAdminPage
