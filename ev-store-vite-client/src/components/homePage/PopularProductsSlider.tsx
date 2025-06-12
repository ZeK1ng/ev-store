import { useRef, useEffect, useState } from 'react'
import {
    Box,
    Flex,
    Heading,
    Button,
    Image,
    Text,
    Card,
    IconButton,
    Center,
    Spinner
} from '@chakra-ui/react'
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom';
import { LuShoppingCart } from 'react-icons/lu'
import API from '@/utils/AxiosAPI';
import { addItemToCart } from "@/utils/helpers";
import AuthController from "@/utils/AuthController";
import { toaster } from "@/components/ui/toaster";
import { getImageUrl } from "@/utils/helpers";

interface Product {
    productId: number;
    nameENG: string;
    nameGE: string;
    nameRUS: string;
    descriptionENG: string;
    descriptionGE: string;
    descriptionRUS: string;
    categoryId: number;
    categoryName: string;
    price: number;
    mainImageId: number;
}

interface ProductResponse {
    content: Product[];
    totalElements: number;
}

interface PopularProductsSliderProps {
    categoryId?: number;
    currentProductId?: number;
    showAll?: boolean;
    isPopular?: boolean;
}

const PopularProductsSlider = ({
    categoryId,
    currentProductId,
    showAll = true,
    isPopular = false
}: PopularProductsSliderProps) => {
    const sliderRef = useRef<HTMLDivElement>(null)
    const { t } = useTranslation('home')
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showScrollButtons, setShowScrollButtons] = useState(false);

    useEffect(() => {
        const checkScrollButtons = () => {
            if (sliderRef.current) {
                const { scrollWidth, clientWidth } = sliderRef.current;
                setShowScrollButtons(scrollWidth > clientWidth);
            }
        };

        checkScrollButtons();
        window.addEventListener('resize', checkScrollButtons);

        return () => {
            window.removeEventListener('resize', checkScrollButtons);
        };
    }, [products]);

    useEffect(() => {
        const fetchSimilarProducts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    page: '0',
                    size: '10',
                });

                if (categoryId) {
                    params.append('categoryId', categoryId.toString());
                }

                if (isPopular) {
                    params.append('isPopular', 'true');
                }

                const response = await API.get<ProductResponse>(`/product?${params}`);
                const filteredSimilar = response.data.content.filter(p => p.productId !== currentProductId);
                setProducts(filteredSimilar);
            } catch (error) {
                console.error('Error fetching similar products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSimilarProducts();
    }, [categoryId, currentProductId, isPopular]);

    const scroll = (offset: number) => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: offset, behavior: 'smooth' })
        }
    }

    const addToCart = async (productId: number) => {
        if (AuthController.isLoggedIn()) {
            try {
                await API.post(`/cart/add?productId=${productId}&quantity=1`)
                toaster.success({
                    title: t('popularProducts.addToCartSuccess')
                })
            } catch (error) {
                console.error('Error adding to cart:', error)
                toaster.error({
                    title: t('popularProducts.addToCartError')
                })
            }
        } else {
            addItemToCart(productId, 1)
            toaster.success({
                title: t('popularProducts.addToCartSuccess')
            })
        }
    }

    if (loading) {
        return (
            <Center py={12}>
                <Spinner size="xl" />
            </Center>
        );
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <Box py={12}>
            <Flex justify="space-between" align="center" mb={4}>
                <Heading size={{ base: '2xl', md: '4xl' }} textAlign='left'>
                    {isPopular ? t('popularProducts.title') : t('popularProducts.similarProducts')}
                </Heading>
                {showScrollButtons && (
                    <Flex>
                        <IconButton
                            aria-label="Scroll left"
                            onClick={() => scroll(-400)}
                            mr={2}
                            bg="#9CE94F"
                            color="gray.900"
                        >
                            <FaChevronLeft />
                        </IconButton>
                        <IconButton
                            aria-label="Scroll right"
                            onClick={() => scroll(400)}
                            bg="#9CE94F"
                            color="gray.900"
                        >
                            <FaChevronRight />
                        </IconButton>
                    </Flex>
                )}
            </Flex>

            <Flex ref={sliderRef} overflowX="auto" gap={4} py={4}
                scrollBehavior="smooth"
                css={{
                    scrollSnapType: 'x mandatory',
                    '&::-webkit-scrollbar': { display: 'none' }
                }}
            >
                {products.map((product) => (
                    <Box
                        h="100%"
                        key={product.productId}
                        scrollSnapAlign="start"
                        flex={{ base: '0 0 300px', md: '0 0 27%' }}

                    >
                        <Card.Root
                            h="100%"
                            display="flex"
                            flexDirection="column"
                            overflow="hidden"
                            bg="whiteAlpha.100"
                        >
                            <Box h="200px" flexShrink={0}>
                                <Image
                                    src={getImageUrl(product.mainImageId)}
                                    alt={product.nameENG}
                                    w="full"
                                    h="full"
                                    objectFit="cover"
                                    shadow="sm"
                                />
                            </Box>

                            <Card.Body gap="2" flex="1" display="flex" flexDirection="column" minH="180px">
                                <Box minH="48px" display="flex" alignItems="center">
                                    <Text fontSize="lg" fontWeight="bold">
                                        {product.nameENG}
                                    </Text>
                                </Box>
                                <Box flex="1" minH="72px">
                                    <Text fontSize="md" color="gray.600" lineClamp={3}>
                                        {product.descriptionENG}
                                    </Text>
                                </Box>
                                <Text textStyle="2xl" fontWeight="medium" mt="auto" pt="2">
                                    {product.price.toFixed(2)}
                                </Text>
                            </Card.Body>

                            <Card.Footer gap="2" flexShrink={0} pt="4">
                                <Button
                                    variant="solid"
                                    bg="#9CE94F"
                                    color="gray.950"
                                    onClick={() => addToCart(product.productId)}
                                    flex="1"
                                >
                                    <LuShoppingCart /> {t('popularProducts.addToCart')}
                                </Button>
                                <Button
                                    flex="1"
                                    variant="ghost"
                                    onClick={() => navigate(`/product/${product.productId}`)}
                                >
                                    {t('popularProducts.learnMoreLabel')}
                                </Button>
                            </Card.Footer>
                        </Card.Root>
                    </Box>
                ))}
            </Flex>
            {showAll && (
                <Flex justify="center" align="center" mt={4}>
                    <Button
                        size="lg"
                        variant="subtle"
                        onClick={() => {
                            if (categoryId) {
                                navigate(`/catalog?categories=${categoryId}`)
                            } else {
                                navigate('/catalog')
                            }
                        }}
                    >
                        {t('popularProducts.seeAllLabel')}
                    </Button>
                </Flex>
            )}
        </Box>
    )
}

export default PopularProductsSlider
