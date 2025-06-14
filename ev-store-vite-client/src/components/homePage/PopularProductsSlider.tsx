import { useRef, useEffect, useState } from 'react'
import {
    Box,
    Flex,
    Heading,
    Button,
    Text,
    Card,
    IconButton,
    Center,
    Spinner,
    Badge,
    HStack
} from '@chakra-ui/react'
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { LuShoppingCart, LuStar } from 'react-icons/lu'
import API from '@/utils/AxiosAPI';
import { addItemToCart } from "@/utils/helpers";
import AuthController from "@/utils/AuthController";
import { toaster } from "@/components/ui/toaster";
import CachedImage from "@/utils/CachedImage";
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedText } from '@/utils/languageUtils';

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
    isPopular: boolean;
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
    const { t } = useTranslation('common')
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showScrollButtons, setShowScrollButtons] = useState(false);
    const { language } = useLanguage();

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
                    title: t('slider.addToCartSuccess')
                })
            } catch (error) {
                console.error('Error adding to cart:', error)
                toaster.error({
                    title: t('slider.addToCartError')
                })
            }
        } else {
            addItemToCart(productId, 1)
            toaster.success({
                title: t('slider.addToCartSuccess')
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
                    {isPopular ? t('slider.title') : t('slider.similarProducts')}
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
                        key={product.productId}
                        scrollSnapAlign="start"
                        flex={{ base: '0 0 300px', md: '0 0 27%' }}
                    >
                        <RouterLink
                            to={`/product/${product.productId}`}
                            style={{
                                display: 'block',
                                height: '100%',
                                textDecoration: 'none'
                            }}
                        >
                            <Card.Root
                                w="100%"
                                h="100%"
                                bg="whiteAlpha.100"
                                display="flex"
                                flexDirection="column"
                                overflow="hidden"
                                _hover={{ shadow: 'lg', transition: 'all 0.2s' }}
                                cursor="pointer"
                            >
                                <CachedImage
                                    imageId={product.mainImageId}
                                    alt={getLocalizedText(product, language, 'name')}
                                    width="full"
                                    height="200px"
                                    objectFit="cover"
                                    shadow="sm"
                                />

                                <Card.Body gap="2" flex="1" display="flex" flexDirection="column" minH="180px">
                                    <Card.Title>
                                        {getLocalizedText(product, language, 'name')}
                                    </Card.Title>
                                    <HStack>
                                        <Badge size="sm" p={2} borderRadius="md" textAlign="center" colorPalette="yellow">
                                            {product.categoryName}
                                        </Badge>
                                        {
                                            product.isPopular && (
                                                <Badge size="sm" p={2} borderRadius="md" textAlign="center" colorPalette="green">
                                                    <LuStar /> {t('popular')}
                                                </Badge>
                                            )
                                        }
                                    </HStack>
                                    <Text textStyle="2xl" fontWeight="medium">
                                        {product.price.toFixed(2)}
                                    </Text>
                                    <Button
                                        size="sm"
                                        variant="solid"
                                        bg="#9CE94F"
                                        color="gray.950"
                                        _hover={{ opacity: 0.7 }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            addToCart(product.productId);
                                        }}
                                        width="full"
                                    >
                                        <LuShoppingCart /> {t('slider.addToCart')}
                                    </Button>
                                </Card.Body>
                            </Card.Root>
                        </RouterLink>
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
                        {t('slider.seeAllLabel')}
                    </Button>
                </Flex>
            )}
        </Box>
    )
}

export default PopularProductsSlider
