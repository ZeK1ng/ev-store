import { useState, useEffect } from 'react'

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
    NativeSelect,
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
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FaChevronRight, FaChevronLeft, FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom';
import { LuShoppingCart } from "react-icons/lu";


interface Item {
    id: number;
    name: string;
    description: string;
    category: string;
    subcategory: string;
    price: number;
    image: string;
}

const CatalogPage = () => {
    const { t } = useTranslation('catalog')

    const products: Item[] = [
        {
            id: 1,
            name: "Fast Charging Adapter",
            description: "A high-speed adapter for fast charging.",
            category: "EV Accessories",
            subcategory: "Adapters",
            price: 49.99,
            image: "https://placehold.co/300?text=Adapter"
        },
        {
            id: 2,
            name: "Heavy-Duty Charging Cable",
            description: "A durable cable for heavy-duty charging.",
            category: "EV Accessories",
            subcategory: "Cables",
            price: 79.99,
            image: "https://placehold.co/300?text=Cable"
        },
        {
            id: 3,
            name: "Home Charging Station",
            description: "A convenient home charging station for your EV.",
            category: "EV Chargers",
            subcategory: "Home Chargers",
            price: 299.99,
            image: "https://placehold.co/300?text=Home+Charger"
        },
        {
            id: 4,
            name: "Portable EV Charger",
            description: "A portable charger for on-the-go charging.",
            category: "EV Chargers",
            subcategory: "Portable Chargers",
            price: 199.99,
            image: "https://placehold.co/300?text=Portable+Charger"
        },
        {
            id: 5,
            name: "Smart EV Charger",
            description: "A smart charger with app connectivity.",
            category: "EV Chargers",
            subcategory: "Home Chargers",
            price: 349.99,
            image: "https://placehold.co/300?text=Smart+Charger"
        },
        {
            id: 6,
            name: "Universal EV Adapter",
            description: "An adapter compatible with all EV models.",
            category: "EV Chargers",
            subcategory: "Adapters",
            price: 29.99,
            image: "https://placehold.co/300?text=Universal+Adapter"
        },
        {
            id: 7,
            name: "EV Battery Monitor",
            description: "A device to monitor your EV battery health.",
            category: "EV Accessories",
            subcategory: "Monitors",
            price: 99.99,
            image: "https://placehold.co/300?text=Battery+Monitor"
        },
        {
            id: 8,
            name: "Wireless EV Charger",
            description: "A wireless charger for hassle-free charging.",
            category: "EV Chargers",
            subcategory: "Home Chargers",
            price: 399.99,
            image: "https://placehold.co/300?text=Wireless+Charger"
        },
        {
            id: 9,
            name: "EV Charging Station",
            description: "A public charging station for EVs.",
            category: "EV Chargers",
            subcategory: "Public Chargers",
            price: 499.99,
            image: "https://placehold.co/300?text=Charging+Station"
        },
        {
            id: 10,
            name: "EV Maintenance Kit",
            description: "A kit for maintaining your EV.",
            category: "EV Accessories",
            subcategory: "Kits",
            price: 59.99,
            image: "https://placehold.co/300?text=Maintenance+Kit"
        },
        {
            id: 11,
            name: "EV Cleaning Supplies",
            description: "Supplies for cleaning your EV.",
            category: "EV Accessories",
            subcategory: "Cleaning",
            price: 39.99,
            image: "https://placehold.co/300?text=Cleaning+Supplies"
        },
        {
            id: 12,
            name: "EV Tire Inflator",
            description: "A tire inflator for your EV.",
            category: "EV Accessories",
            subcategory: "Inflators",
            price: 29.99,
            image: "https://placehold.co/300?text=Tire+Inflator"
        },
        {
            id: 13,
            name: "EV Windshield Cover",
            description: "A cover to protect your EV windshield.",
            category: "EV Accessories",
            subcategory: "Covers",
            price: 19.99,
            image: "https://placehold.co/300?text=Windshield+Cover"
        },
        {
            id: 14,
            name: "EV Seat Covers",
            description: "Seat covers for your EV.",
            category: "EV Accessories",
            subcategory: "Covers",
            price: 49.99,
            image: "https://placehold.co/300?text=Seat+Cover"
        },
    ];

    const categories = Array.from(new Set(products.map(p => p.category)))
    const subcategories = Array.from(new Set(products.map(p => p.subcategory)))

    const [search, setSearch] = useState('')
    const [selCats, setSelCats] = useState<string[]>([])
    const [selSubs, setSelSubs] = useState<string[]>([])
    const [selRange, setSelRange] = useState<number[]>([0, 1000])
    const [sliderRange, setSliderRange] = useState<number[]>([0, 1000])
    const [filtered, setFiltered] = useState(products)


    const pageSize = 12
    const [page, setPage] = useState(1)
    const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

    useEffect(() => {
        let res = products.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase())
        )
        if (selCats.length) res = res.filter(p => selCats.includes(p.category))
        if (selSubs.length) res = res.filter(p => selSubs.includes(p.subcategory))

        setFiltered(res)
        setPage(1)
    }, [search, selCats, selSubs, selRange])

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
                    defaultValue={["category", "subcategory", "price"]}
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
                                
                                    max={sliderRange[1]} min={sliderRange[0]} step={1}
                                    defaultValue={selRange} onValueChangeEnd={(e) => setSelRange(e.value)}>
                                    <Slider.ValueText>
                                        <HStack justify="space-between">
                                            <Text fontSize="sm">{selRange[0]}</Text>
                                            <Text fontSize="sm">{selRange[1]}</Text>
                                        </HStack>
                                    </Slider.ValueText>
                                    <Slider.Control>
                                        <Slider.Track>
                                            <Slider.Range bg="#9CE94F"/>
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
                                    <Checkbox.Root key={cat} value={cat} onChange={() => {
                                        setSelCats(prev =>
                                            prev.includes(cat)
                                                ? prev.filter(c => c !== cat)
                                                : [...prev, cat]
                                        )
                                    }}>
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control />
                                        <Checkbox.Label>{cat}</Checkbox.Label>
                                    </Checkbox.Root>
                                ))}
                            </Accordion.ItemBody>
                        </Accordion.ItemContent>
                    </Accordion.Item>

                    <Accordion.Item value="subcategory">
                        <Accordion.ItemTrigger>
                            <Text flex="1" fontWeight="medium">
                                {t('subcategoryFilterTitle')}
                            </Text>
                            <Accordion.ItemIndicator />
                        </Accordion.ItemTrigger>
                        <Accordion.ItemContent>
                            <Accordion.ItemBody as={Stack} px="4" py="3">
                                {subcategories.map((sub, index) => (
                                    <Checkbox.Root key={index} value={sub} onChange={() => {
                                        setSelSubs(prev =>
                                            prev.includes(sub)
                                                ? prev.filter(s => s !== sub)
                                                : [...prev, sub]
                                        )
                                    }}>
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control />
                                        <Checkbox.Label>{sub}</Checkbox.Label>
                                    </Checkbox.Root>
                                ))}
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
                            <Input placeholder={t('searchPlaceholder')} size="md" onChange={e => setSearch(e.target.value)} />
                        </Field.Root>
                        <Field.Root w={{ base: "100%", sm: "250px" }} mt={{ base: 4, md: 0 }}>
                            <Field.Label>
                                {t('sortByLabel')}
                            </Field.Label>
                            <NativeSelect.Root>
                                <NativeSelect.Field defaultValue="">
                                    <option value="" disabled hidden>
                                        {t('sortByPlaceholder')}
                                    </option>
                                    <option value="priceAsc">
                                        {t('sortByPriceAsc')}
                                    </option>
                                    <option value="priceDesc">
                                        {t('sortByPriceDesc')}
                                    </option>
                                </NativeSelect.Field>
                                <NativeSelect.Indicator />
                            </NativeSelect.Root>
                        </Field.Root>
                    </Flex>

                    {filtered.length === 0 ?
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
                        :
                        <>
                            <SimpleGrid columns={{ base: 1, sm: 2, xl: 3 }} gap="6">
                                {paged.map((product, idx) => (
                                    <Card.Root overflow="hidden" key={idx} w="100%" bg="whiteAlpha.100">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            w="full"
                                            h="200px"
                                            objectFit="cover"
                                        />

                                        <Card.Body gap="2" >
                                            <Card.Title>{product.name}</Card.Title>
                                            <Card.Description>{product.description}</Card.Description>
                                            <Text textStyle="2xl" fontWeight="medium">
                                                ${product.price.toFixed(2)}
                                            </Text>
                                        </Card.Body>

                                        <Card.Footer gap="2">
                                            <Button
                                                variant="solid"
                                                bg="#9CE94F"
                                                color="gray.950"
                                            >
                                                <LuShoppingCart />
                                                {t('addToCart')}
                                            </Button>
                                            <Button variant="ghost">
                                                <Link to={`/product/${product.id}`}>
                                                    {t('learnMore')}
                                                </Link>
                                            </Button>
                                        </Card.Footer>
                                    </Card.Root>
                                ))}
                            </SimpleGrid>

                            <Show when={filtered.length > pageSize}>
                                <Pagination.Root
                                    count={filtered.length}
                                    pageSize={pageSize}
                                    page={page}
                                    onPageChange={(details) => {
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                        setPage(details.page)
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
                    }
                </Box>
            </Flex>
        </Box>
    );
};

export default CatalogPage;