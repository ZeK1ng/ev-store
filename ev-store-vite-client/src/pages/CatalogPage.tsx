import { useState, useEffect } from 'react'
import API from '@/utils/AxiosAPI';

import {
    Box,
    Flex,
    Stack,
    SimpleGrid,
    Text,
    Heading,
    Card,
    Image,
    Button,
    Field,
    Input,
    Accordion,
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
    Spinner
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FaChevronRight, FaChevronLeft, FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom';
import { LuShoppingCart } from "react-icons/lu";
import { addItemToCart, getImageUrl } from "@/utils/helpers";
import AuthController from "@/utils/AuthController";
import { toaster } from "@/components/ui/toaster";

interface Category {
    id: number;
    name: string;
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
    isPopular: boolean;
}

interface ProductResponse {
    content: Product[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

const CatalogPage = () => {
    const { t } = useTranslation('catalog')

    const [categories, setCategories] = useState<Category[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [totalProducts, setTotalProducts] = useState(0)
    const [loading, setLoading] = useState(true)

    const [search, setSearch] = useState('')
    const [selCats, setSelCats] = useState<number[]>([])
    const [selRange, setSelRange] = useState<number[]>([0, 0])
    const [sliderRange, setSliderRange] = useState<number[]>([0, 0])
    const [sortDirection, setSortDirection] = useState('asc')
    const [isPopular, setIsPopular] = useState(false)

    const pageSize = 10
    const [page, setPage] = useState(0)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await API.get('/category/all')
                setCategories(response.data)
            } catch (error) {
                console.error('Error fetching categories:', error)
            }
        }
        fetchCategories()
    }, [])

    useEffect(() => {
        const fetchMaxPrice = async () => {
            try {
                const response = await API.get('/product/max-price')
                const max = response.data?.maxPrice
                setSliderRange([0, max])
                setSelRange([0, max])
            } catch (error) {
                console.error('Error fetching max price:', error)
            }
        }
        fetchMaxPrice()
    }, [])

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            try {
                const params = new URLSearchParams({
                    page: page.toString(),
                    size: pageSize.toString(),
                    direction: sortDirection,
                    name: search || '',
                    categoryId: selCats.join(','),
                    minPrice: selRange[0].toString(),
                    maxPrice: selRange[1].toString(),
                    isPopular: isPopular.toString()
                })

                const response = await API.get<ProductResponse>(`/product?${params}`)
                setProducts(response.data.content)
                setTotalProducts(response.data.totalElements)
            } catch (error) {
                console.error('Error fetching products:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [page, pageSize, sortDirection, search, selCats, selRange, isPopular])

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

    return (
        <Box p={{ base: 4, md: 8 }}>
            <Heading size="lg" mb="6">
                {t('title')}
            </Heading>

            <Flex direction={{ base: "column", md: "row" }} align="start" gap="8">
                <Accordion.Root
                    width={{ base: "100%", md: "250px" }}
                    variant="outline"
                    multiple
                    collapsible
                    defaultValue={["category", "price", "availability"]}
                >
                    <Accordion.Item value="price">
                        <Accordion.ItemTrigger>
                            <Text flex="1" fontWeight="medium">
                                {t('priceFilterTitle')}
                            </Text>
                            <Accordion.ItemIndicator />
                        </Accordion.ItemTrigger>
                        <Accordion.ItemContent>
                            <Accordion.ItemBody px="4" py="3">
                                <Slider.Root width="200px"
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
                            </Accordion.ItemBody>
                        </Accordion.ItemContent>
                    </Accordion.Item>

                    <Accordion.Item value="category">
                        <Accordion.ItemTrigger>
                            <Text flex="1" fontWeight="medium">
                                {t('categoryFilterTitle')}
                            </Text>
                            <Accordion.ItemIndicator />
                        </Accordion.ItemTrigger>
                        <Accordion.ItemContent>
                            <Accordion.ItemBody as={Stack} px="4" py="3">
                                {categories.map(cat => (
                                    <Checkbox.Root key={cat.id} value={cat.id.toString()} onChange={() => {
                                        setSelCats(prev =>
                                            prev.includes(cat.id)
                                                ? prev.filter(c => c !== cat.id)
                                                : [...prev, cat.id]
                                        )
                                    }}>
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control />
                                        <Checkbox.Label>{cat.name}</Checkbox.Label>
                                    </Checkbox.Root>
                                ))}
                            </Accordion.ItemBody>
                        </Accordion.ItemContent>
                    </Accordion.Item>

                    <Accordion.Item value="availability">
                        <Accordion.ItemTrigger>
                            <Text flex="1" fontWeight="medium">
                                {t('availabilityFilterTitle')}
                            </Text>
                            <Accordion.ItemIndicator />
                        </Accordion.ItemTrigger>
                        <Accordion.ItemContent>
                            <Accordion.ItemBody as={Stack} px="4" py="3">
                                <Checkbox.Root value="isPopular" onChange={() => setIsPopular(!isPopular)}>
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                    <Checkbox.Label>{t('popular')}</Checkbox.Label>
                                </Checkbox.Root>
                            </Accordion.ItemBody>
                        </Accordion.ItemContent>
                    </Accordion.Item>
                </Accordion.Root>

                <Box flex="1" w="100%">
                    <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="center" gap="4" mb="6">
                        <Field.Root flex="1" maxW={{ base: "100%", md: "400px" }}>
                            <Field.Label>
                                {t('searchLabel')}
                            </Field.Label>
                            <Input
                                placeholder={t('searchPlaceholder')}
                                size="md"
                                onChange={e => setSearch(e.target.value)}
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
                                defaultValue={['asc']}
                                onValueChange={e => setSortDirection(e.items[0]?.value)}
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
                                        <Image
                                            src={getImageUrl(product.mainImageId)}
                                            alt={product.nameENG}
                                            w="full"
                                            h="200px"
                                            objectFit="cover"
                                        />

                                        <Card.Body gap="2">
                                            <Card.Title>{product.nameENG}</Card.Title>
                                            <Card.Description lineClamp={2}>{product.descriptionENG}</Card.Description>
                                            <Text textStyle="2xl" fontWeight="medium">
                                                {product.price.toFixed(2)}
                                            </Text>
                                        </Card.Body>

                                        <Card.Footer gap="2">
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
                                        setPage(details.page - 1)
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