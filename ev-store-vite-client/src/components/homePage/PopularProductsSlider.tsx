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
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom';
import { LuShoppingCart, LuStar, LuArrowRight, LuArrowLeft } from 'react-icons/lu'
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
    comingSoon: boolean;
}

interface ProductResponse {
    content: Product[];
    totalElements: number;
}

interface PopularProductsSliderProps {
    categoryId?: number;
    currentProductId?: number;
    isPopular?: boolean;
    hidePandings?: boolean;
    hideTitle?: boolean;
}

const PopularProductsSlider = ({
    categoryId,
    currentProductId,
    isPopular = false,
    hidePandings = false,
    hideTitle = false
}: PopularProductsSliderProps) => {
    const sliderRef = useRef<HTMLDivElement>(null)
    const { t } = useTranslation('common')
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
                    direction: 'desc'
                });

                if (categoryId) {
                    params.append('categoryId', categoryId.toString());
                }

                if (isPopular) {
                    params.append('isPopular', 'true');
                }

                const response = await API.get<ProductResponse>(`/product?${params}`);
                if (currentProductId) {
                    const filteredSimilar = response.data.content.filter(p => p.productId !== currentProductId);
                    setProducts(filteredSimilar);
                } else {
                    setProducts(response.data.content);
                }
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
        <Box py={hidePandings ? 0 : 12}>
            <Flex justify={hideTitle && showScrollButtons ? 'flex-end' : 'space-between'} align="center">
                {!hideTitle && (
                    <Heading size={{ base: 'xl', md: '2xl' }} textAlign='left' mt={12}>
                        {isPopular ? t('slider.title') : t('slider.similarProducts')}
                    </Heading>
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
                        flex={{ base: '0 0 300px', md: '0 0 33%', lg: '0 0 27%' }}
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
                                    objectFit="contain"
                                    shadow="sm"
                                    comingSoon={product.comingSoon}
                                />

                                <Card.Body gap="1" p={4} flex="1" display="flex" flexDirection="column">
                                    <Card.Title textAlign="left" lineClamp={1}>
                                        {getLocalizedText(product, language, 'name')}
                                    </Card.Title>
                                    <HStack justify="flex-start">
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
                                    <Text textStyle="2xl" fontWeight="medium" textAlign="left">
                                        {product.price.toFixed(2)} ₾
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
            <Flex justify="center" align="center">
                {showScrollButtons && (
                    <Flex >
                        <IconButton
                            aria-label="Scroll left"
                            onClick={() => scroll(-400)}
                            mr={2}
                            variant="outline"
                        >
                            <LuArrowLeft />
                        </IconButton>
                        <IconButton
                            aria-label="Scroll right"
                            onClick={() => scroll(400)}
                            variant="outline"
                        >
                            <LuArrowRight />
                        </IconButton>
                    </Flex>
                )}
            </Flex>
        </Box>
    )
}

export default PopularProductsSlider
