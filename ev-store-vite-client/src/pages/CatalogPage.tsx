import { useState, useEffect } from 'react'
import API from '@/utils/AxiosAPI';
import { useSearchParams } from 'react-router-dom';

import {
    Box,
    Flex,
    Stack,
    SimpleGrid,
    Text,
    Heading,
    Card,
    Button,
    Field,
    Input,
    Checkbox,
    ButtonGroup,
    IconButton,
    Pagination,
    Slider,
    HStack,
    VStack,
    EmptyState,
    List,
    Show,
    Portal,
    Select,
    createListCollection,
    Center,
    Spinner,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FaChevronRight, FaChevronLeft, FaChevronDown, FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom';
import { LuShoppingCart } from "react-icons/lu";
import { addItemToCart } from "@/utils/helpers";
import AuthController from "@/utils/AuthController";
import { toaster } from "@/components/ui/toaster";
import CachedImage from "@/utils/CachedImage";

interface Category {
    id: number;
    name: string;
    description: string;
    children: Category[];
}

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
    totalPages: number;
    size: number;
    number: number;
}

const CategoryTree = ({
    categories,
    selectedCategories,
    onCategorySelect,
    expanded,
    onToggle,
    level = 0
}: {
    categories: Category[],
    selectedCategories: number[],
    onCategorySelect: (categoryId: number) => void,
    expanded: Set<number>,
    onToggle: (categoryId: number) => void,
    level?: number
}) => {
    return (
        <Stack position="relative">
            {categories.map(category => (
                <>
                    <Box key={category.id} position="relative">
                        <Flex
                            align="center"
                            py={1}
                            px={1}
                            _hover={{ bg: "bg.subtle" }}
                        >
                            {category.children && category.children.length > 0 ? (
                                <Box
                                    as="button"
                                    aria-label={expanded.has(category.id) ? 'Collapse' : 'Expand'}
                                    onClick={() => onToggle(category.id)}
                                    minW="20px"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    background="none"
                                    border="none"
                                    cursor="pointer"
                                    p={0}
                                    mr={2}
                                >
                                    {expanded.has(category.id) ? <FaChevronDown size={14} /> : <FaChevronRight size={14} />}
                                </Box>
                            ) : (
                                <Box minW="20px" mr={2} />
                            )}
                            <Checkbox.Root
                                value={category.id.toString()}
                                onChange={() => onCategorySelect(category.id)}
                                checked={selectedCategories.includes(category.id)}
                                variant="solid"
                                colorPalette="green"
                            >
                                <Checkbox.HiddenInput />
                                <Checkbox.Control />
                                <Checkbox.Label
                                >
                                    {category.name}
                                </Checkbox.Label>
                            </Checkbox.Root>
                        </Flex>

                        {category.children && category.children.length > 0 && expanded.has(category.id) && (
                            <Box position="relative">
                                <Box
                                    position="absolute"
                                    top="0"
                                    left="15px"
                                    width="1px"
                                    height="100%"
                                    bg="gray.200"
                                    zIndex={0}
                                />
                                <Box pl={6} borderLeft="1px solid transparent">
                                    <CategoryTree
                                        categories={category.children}
                                        selectedCategories={selectedCategories}
                                        onCategorySelect={onCategorySelect}
                                        expanded={expanded}
                                        onToggle={onToggle}
                                        level={level + 1}
                                    />
                                </Box>
                            </Box>
                        )}
                    </Box>
                </>
            ))}
        </Stack>
    );
};

const CatalogPage = () => {
    const { t } = useTranslation('catalog')
    const [searchParams, setSearchParams] = useSearchParams();

    const [categories, setCategories] = useState<Category[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [totalProducts, setTotalProducts] = useState(0)
    const [loading, setLoading] = useState(true)
    const [initialLoading, setInitialLoading] = useState(true)

    const [search, setSearch] = useState(searchParams.get('search') || '')
    const [selCats, setSelCats] = useState<number[]>(
        searchParams.get('categories')?.split(',').map(Number).filter(Boolean) || []
    )
    const [selRange, setSelRange] = useState<number[]>([
        Number(searchParams.get('minPrice')) || 0,
        Number(searchParams.get('maxPrice')) || 0
    ])
    const [sliderRange, setSliderRange] = useState<number[]>([0, 0])
    const [sortDirection, setSortDirection] = useState(searchParams.get('sort') || 'asc')
    const [page, setPage] = useState(Number(searchParams.get('page')) || 0)
    const [expandedCats, setExpandedCats] = useState<Set<number>>(new Set())

    const pageSize = 10

    const updateUrlParams = (updates: Record<string, string | number | boolean | null>) => {
        const newParams = new URLSearchParams(searchParams);

        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === '') {
                newParams.delete(key);
            } else {
                newParams.set(key, String(value));
            }
        });

        if (newParams.get('page') === '0') {
            newParams.delete('page');
        }

        setSearchParams(newParams);
    };

    useEffect(() => {
        updateUrlParams({
            search: search || null,
            categories: selCats.length ? selCats.join(',') : null,
            minPrice: selRange[0] || null,
            maxPrice: selRange[1] || null,
            sort: sortDirection,
            page: page || null
        });
    }, [search, selCats, selRange, sortDirection, page]);

    // Initial data fetch
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [categoriesResponse, maxPriceResponse] = await Promise.all([
                    API.get('/category/all'),
                    API.get('/product/max-price')
                ]);

                const categoriesData = categoriesResponse.data;
                const maxPrice = maxPriceResponse.data?.maxPrice;

                setCategories(categoriesData);
                setSliderRange([0, maxPrice]);
                
                if (!searchParams.get('minPrice') && !searchParams.get('maxPrice')) {
                    setSelRange([0, maxPrice]);
                }

                const allCategoryIds = getAllCategoryIds(categoriesData);
                setExpandedCats(new Set(allCategoryIds));
            } catch (error) {
                console.error('Error fetching initial data:', error);
            } finally {
                setInitialLoading(false);
            }
        };

        fetchInitialData();
    }, [searchParams]);

    // Products fetch
    useEffect(() => {
        const fetchProducts = async () => {
            if (initialLoading) return; // Don't fetch products until initial data is loaded
            
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    page: page.toString(),
                    size: pageSize.toString(),
                    direction: sortDirection,
                    name: search || '',
                    categoryId: selCats.join(','),
                    minPrice: selRange[0].toString(),
                    maxPrice: selRange[1].toString(),
                });

                const response = await API.get<ProductResponse>(`/product?${params}`);
                setProducts(response.data.content);
                setTotalProducts(response.data.totalElements);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [page, pageSize, sortDirection, search, selCats, selRange, initialLoading]);

    const addToCart = async (productId: number) => {
        if (AuthController.isLoggedIn()) {
            try {
                await API.post(`/cart/add?productId=${productId}&quantity=1`)
                toaster.success({
                    title: t('addToCartSuccess')
                })
            } catch (error) {
                console.error('Error adding to cart:', error)
                toaster.success({
                    title: t('addToCartSuccess')
                })
            }
        } else {
            addItemToCart(productId, 1)
        }

    }

    // Function to get all category IDs including children
    const getAllCategoryIds = (categories: Category[]): number[] => {
        return categories.reduce((ids: number[], category) => {
            return [
                ...ids,
                category.id,
                ...(category.children ? getAllCategoryIds(category.children) : [])
            ];
        }, []);
    };

    if (initialLoading) {
        return (
            <Center minH="100vh">
                <Spinner size="xl" borderWidth="4px" />
            </Center>
        );
    }

    return (
        <Box p={{ base: 4, md: 8 }}>
            <Heading size="lg" mb="6">
                {t('title')}
            </Heading>

            <Flex direction={{ base: "column", md: "row" }} align="start" gap="8">
                <Box bg="bg.muted" borderRadius="md" minW="260px" w="100%" maxW={{ base: "100%", md: "320px" }} p={4} flex="1">
                    <Text fontWeight="bold" fontSize="xl" mb="4">
                        {t('priceFilterTitle')}
                    </Text>
                    <Box>
                        <Slider.Root 
                            px={4}
                            min={sliderRange[0]}
                            max={sliderRange[1]}
                            value={selRange}

                            step={1}
                            onValueChange={(e) => setSelRange(e.value)}>
                            <Slider.ValueText>
                                <HStack justify="space-between">
                                    <Text fontSize="sm">{selRange[0]}</Text>
                                    <Text fontSize="sm">{selRange[1]}</Text>
                                </HStack>
                            </Slider.ValueText>
                            <Slider.Control>
                                <Slider.Track>
                                    <Slider.Range bg="#9CE94F" />
                                </Slider.Track>
                                <Slider.Thumbs />
                            </Slider.Control>
                        </Slider.Root>
                    </Box>
                    
                    <Text fontWeight="bold" fontSize="xl" my="4">
                        {t('categoryFilterTitle')}
                    </Text>
                    <Box maxH="400px" overflowY="auto">
                        <CategoryTree
                            categories={categories}
                            selectedCategories={selCats}
                            onCategorySelect={(categoryId) => {
                                setSelCats(prev =>
                                    prev.includes(categoryId)
                                        ? prev.filter(c => c !== categoryId)
                                        : [...prev, categoryId]
                                )
                            }}
                            expanded={expandedCats}
                            onToggle={(categoryId) => {
                                setExpandedCats(prev => {
                                    const next = new Set(prev);
                                    if (next.has(categoryId)) {
                                        next.delete(categoryId);
                                    } else {
                                        next.add(categoryId);
                                    }
                                    return next;
                                });
                            }}
                        />
                    </Box>
                </Box>

                <Box flex="1" w="100%">
                    <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="center" gap="4" mb="6">
                        <Field.Root flex="1" maxW={{ base: "100%", md: "400px" }}>
                            <Field.Label>
                                {t('searchLabel')}
                            </Field.Label>
                            <Input
                                placeholder={t('searchPlaceholder')}
                                size="md"
                                onChange={e => {
                                    setSearch(e.target.value);
                                    setPage(0);
                                }}
                                value={search}
                            />
                        </Field.Root>
                        <Field.Root w={{ base: "100%", sm: "250px" }} mt={{ base: 4, md: 0 }}>
                            <Field.Label>
                                {t('sortByLabel')}
                            </Field.Label>
                            <Select.Root
                                collection={createListCollection({
                                    items: [
                                        { id: 'asc', value: 'asc', label: t('sortByPriceAsc') },
                                        { id: 'desc', value: 'desc', label: t('sortByPriceDesc') }
                                    ]
                                })}
                                defaultValue={[sortDirection]}
                                onValueChange={e => {
                                    setSortDirection(e.items[0]?.value);
                                    setPage(0);
                                }}
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
                                            <Select.Item item={{ value: 'asc' }} key="asc">
                                                <Select.ItemText>{t('sortByPriceAsc')}</Select.ItemText>
                                                <Select.ItemIndicator />
                                            </Select.Item>
                                            <Select.Item item={{ value: 'desc' }} key="desc">
                                                <Select.ItemText>{t('sortByPriceDesc')}</Select.ItemText>
                                                <Select.ItemIndicator />
                                            </Select.Item>
                                        </Select.Content>
                                    </Select.Positioner>
                                </Portal>
                            </Select.Root>
                        </Field.Root>
                    </Flex>

                    {loading ? (
                        <Center minH="50vh">
                            <Spinner size="xl" borderWidth="4px" />
                        </Center>
                    ) : products.length === 0 ? (
                        <EmptyState.Root>
                            <EmptyState.Content>
                                <EmptyState.Indicator>
                                    <FaSearch />
                                </EmptyState.Indicator>
                                <VStack textAlign="center">
                                    <EmptyState.Title>
                                        {t('noResultsTitle')}
                                    </EmptyState.Title>
                                    <EmptyState.Description>
                                        {t('noResultsDescription')}
                                    </EmptyState.Description>
                                </VStack>
                                <List.Root variant="marker">
                                    <List.Item>
                                        {t('noResultsSuggestions')}
                                    </List.Item>
                                    <List.Item>
                                        {t('noResultsSuggestions2')}
                                    </List.Item>
                                </List.Root>
                            </EmptyState.Content>
                        </EmptyState.Root>
                    ) : (
                        <>
                            <SimpleGrid columns={{ base: 1, sm: 2, xl: 3 }} gap="6">
                                {products.map((product) => (
                                    <Card.Root overflow="hidden" key={product.productId} w="100%" bg="whiteAlpha.100">
                                        <CachedImage imageId={product.mainImageId} alt={product.nameENG} w="full" h="200px" objectFit="cover" shadow="sm" />

                                        <Card.Body gap="2">
                                            <Card.Title>{product.nameENG}</Card.Title>
                                            <Card.Description lineClamp={2}>{product.descriptionENG}</Card.Description>
                                            <Text textStyle="2xl" fontWeight="medium">
                                                {product.price.toFixed(2)}
                                            </Text>
                                        </Card.Body>

                                        <Card.Footer gap="2" flexShrink={0} pt="4">
                                            <Button
                                                variant="solid"
                                                bg="#9CE94F"
                                                color="gray.950"
                                                onClick={() => addToCart(product.productId)}
                                            >
                                                <LuShoppingCart />
                                                {t('addToCart')}
                                            </Button>
                                            <Button variant="ghost">
                                                <Link to={`/product/${product.productId}`}>
                                                    {t('learnMore')}
                                                </Link>
                                            </Button>
                                        </Card.Footer>
                                    </Card.Root>
                                ))}
                            </SimpleGrid>

                            <Show when={totalProducts > pageSize}>
                                <Pagination.Root
                                    count={totalProducts}
                                    pageSize={pageSize}
                                    page={page + 1}
                                    onPageChange={(details) => {
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                        setPage(details.page - 1);
                                    }}
                                    mt="6"
                                    justifySelf="center"
                                >
                                    <ButtonGroup variant="ghost" size="sm">
                                        <Pagination.PrevTrigger asChild>
                                            <IconButton aria-label={t('pagination.prev')}>
                                                <FaChevronLeft />
                                            </IconButton>
                                        </Pagination.PrevTrigger>

                                        <Pagination.Items
                                            render={pag => (
                                                <IconButton
                                                    key={pag.value}
                                                    variant={{ base: 'ghost', _selected: 'outline' }}
                                                >
                                                    {pag.value}
                                                </IconButton>
                                            )}
                                        />

                                        <Pagination.NextTrigger asChild>
                                            <IconButton aria-label={t('pagination.next')}>
                                                <FaChevronRight />
                                            </IconButton>
                                        </Pagination.NextTrigger>
                                    </ButtonGroup>
                                </Pagination.Root>
                            </Show>
                        </>
                    )}
                </Box>
            </Flex>
        </Box>
    );
};

export default CatalogPage;