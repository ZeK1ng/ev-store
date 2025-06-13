import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Box,
    Flex,
    Heading,
    Text,
    Stack,
    Button,
    HStack,
    IconButton,
    NumberInput,
    Field,
    Spinner,
    Center,
    Breadcrumb,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { LuMinus, LuPlus } from 'react-icons/lu';
import PopularProductsSlider from '@/components/homePage/PopularProductsSlider';
import { useTranslation } from "react-i18next";
import API from '@/utils/AxiosAPI';
import AuthController from '@/utils/AuthController';
import { addItemToCart } from '@/utils/helpers';
import CachedImage from '@/utils/CachedImage';
import { toaster } from '@/components/ui/toaster';

interface FormValues {
    quantity: number;
}

  interface Category {
    id: number;
    name: string;
    description: string;
    parentCategoryName: string;
  }

interface Product {
    productId: number;
    nameGE: string;
    nameENG: string;
    nameRUS: string;
    descriptionGE: string;
    descriptionENG: string;
    descriptionRUS: string;
    price: number;
    stockAmount: number;
    categoryName: string;
    categoryId: number;
    mainImageId: number;
    imageIds: number[];
    isPopular: boolean;
    tutorialLink: string;
}

const ProductDetailsPage = () => {
    const { t } = useTranslation('product');
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeImage, setActiveImage] = useState<number | null>(null);
    const [categoryPath, setCategoryPath] = useState<Category[]>([]);

    const {
        watch,
        setValue,
    } = useForm<FormValues>({
        defaultValues: { quantity: 1 },
    });

    const quantity = watch('quantity');

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await API.get<Product>(`/product/${id}`);
                const categoryfullpath = await API.get<Category[]>(`category/get-full-path/${response.data.categoryId}`);
                setCategoryPath(categoryfullpath.data);
                setProduct(response.data);
                setActiveImage(response.data.mainImageId);
            } catch (err) {
                setError('Failed to load product details');
                toaster.error({
                    title: 'Error',
                    description: 'Failed to load product details'
                });
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const handleAddToCart = async () => {
        if (!product) return;

        if (AuthController.isLoggedIn()) {
            try {
                await API.post(`/cart/add?productId=${product.productId}&quantity=${quantity}`);
                toaster.success({
                    title: t('addToCartSuccess')
                });
            } catch (error) {
                console.error('Error adding to cart:', error);
                toaster.error({
                    title: t('addToCartError')
                });
            }
        } else {
            addItemToCart(product.productId, quantity);
            toaster.success({
                title: t('addToCartSuccess')
            });
        }
    };

    if (loading) {
        return (
            <Center minH="90vh">
                <Spinner size="xl" borderWidth="4px" />
            </Center>
        );
    }

    if (error || !product) {
        return (
            <Center minH="90vh">
                <Text color="red.500">{error || 'Product not found'}</Text>
            </Center>
        );
    }

    const allImageIds = [product.mainImageId, ...product.imageIds];

    return (
        <Box p={{ base: 4, md: 12 }}>
            <Breadcrumb.Root mb={6}>
                <Breadcrumb.List>
                    <Breadcrumb.Item>
                        <Link to="/catalog">{t('breadcrumb.catalog')}</Link>
                    </Breadcrumb.Item>
                    {categoryPath.flatMap((category, index) => [
                        <Breadcrumb.Separator key={`sep-${index}`} />,
                        <Breadcrumb.Item key={`item-${index}`}>
                            {index === categoryPath.length - 1 ? (
                                <Breadcrumb.CurrentLink>{category.name}</Breadcrumb.CurrentLink>
                            ) : (
                                <Link to={`/catalog?categories=${category.id}`}>{category.name}</Link>
                            )}
                        </Breadcrumb.Item>
                    ])}
                </Breadcrumb.List>
            </Breadcrumb.Root>

            <Flex direction={{ base: 'column', md: 'row' }} gap={8}>
                <Box flex={1}>
                    <CachedImage
                        imageId={activeImage || product.mainImageId}
                        alt={product.nameENG}
                        objectFit="cover"
                        h={{ base: '300px', md: '400px' }}
                        w="full"
                        borderRadius="md"
                    />

                    {product.imageIds.length > 0 && (
                        <HStack
                            mt={4}
                            gap={2}
                            overflowX="auto"
                            flexWrap="nowrap"
                            css={{
                                msOverflowStyle: 'none',
                                scrollbarWidth: 'none',
                                '::-webkit-slider-value-text': {
                                    display: 'none',
                                }
                            }}
                        >
                            {allImageIds.map((imageId, idx) => (
                                <IconButton
                                    key={idx}
                                    onClick={() => setActiveImage(imageId)}
                                    aria-label={`Thumbnail ${idx + 1}`}
                                    border="xs"
                                    borderColor={imageId === activeImage ? 'green.500' : 'blackAlpha.200'}
                                    borderRadius="md"
                                    _hover={{ borderColor: 'green.400' }}
                                    cursor="pointer"
                                    boxSize="50px"
                                    overflow={'hidden'}
                                >
                                    <CachedImage
                                        imageId={imageId}
                                        alt={`${product.nameENG} thumbnail ${idx + 1}`}
                                    />
                                </IconButton>
                            ))}
                        </HStack>
                    )}
                </Box>

                <Box flex={1}>
                    <Stack gap={4}>
                        <Heading size="xl">{product.nameENG}</Heading>
                        <Text fontSize="2xl" fontWeight="bold" color="green.500">
                            ${product.price}
                        </Text>
                        <Text>{product.descriptionENG}</Text>

                        <Field.Root>
                            <NumberInput.Root 
                                value={String(quantity)}
                                min={1} 
                                step={1}
                                onValueChange={(e) => setValue('quantity', Number(e.value))}
                            >
                                <HStack gap="2">
                                    <NumberInput.DecrementTrigger asChild>
                                        <IconButton variant="outline" size="sm">
                                            <LuMinus />
                                        </IconButton>
                                    </NumberInput.DecrementTrigger>
                                    <NumberInput.ValueText textAlign="center" fontSize="lg" minW="3ch" />
                                    <NumberInput.IncrementTrigger asChild>
                                        <IconButton variant="outline" size="sm">
                                            <LuPlus />
                                        </IconButton>
                                    </NumberInput.IncrementTrigger>
                                </HStack>
                            </NumberInput.Root>
                        </Field.Root>

                        <Button
                            w="max-content"
                            bg="#9CE94F"
                            color="gray.950"
                            size="lg"
                            onClick={handleAddToCart}
                            disabled={product.stockAmount === 0}
                        >
                            {product.stockAmount === 0 ? t('details.outOfStock') : t('details.addToCart')}
                        </Button>
                    </Stack>
                </Box>
            </Flex>

            <PopularProductsSlider categoryId={product.categoryId} currentProductId={product.productId} showAll={false} />
        </Box>
    );
};

export default ProductDetailsPage;
