import {
    Box, Flex, Stack, SimpleGrid, Text, Heading,
    Card, Image, Button,
    Field, Input, NativeSelect,
    Accordion,
    Checkbox
} from "@chakra-ui/react";

const CatalogPage = () => {
    const products = [
        {
            id: 1,
            name: "Fast Charging Adapter",
            category: "EV Accessories",
            subcategory: "Adapters",
            price: 49.99,
            image: "https://placehold.co/300?text=Adapter"
        },
        {
            id: 2,
            name: "Heavy-Duty Charging Cable",
            category: "EV Accessories",
            subcategory: "Cables",
            price: 79.99,
            image: "https://placehold.co/300?text=Cable"
        },
        {
            id: 3,
            name: "Home Charging Station",
            category: "EV Chargers",
            subcategory: "Home Chargers",
            price: 299.99,
            image: "https://placehold.co/300?text=Home+Charger"
        },
        {
            id: 4,
            name: "Portable EV Charger",
            category: "EV Chargers",
            subcategory: "Portable Chargers",
            price: 199.99,
            image: "https://placehold.co/300?text=Portable+Charger"
        }
    ];

    const categories = ["EV Accessories", "EV Chargers"];
    const subcategories = ["Adapters", "Cables", "Home Chargers", "Portable Chargers"];

    return (
        <Box p={{ base: 4, md: 8 }}>
            <Heading size="lg" mb="6">Product Catalog</Heading>

            <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="center" gap="4" mb="6">
                <Field.Root flex="1" maxW={{ base: "100%", md: "400px" }}>
                    <Field.Label>Search Products</Field.Label>
                    <Input placeholder="Search products..." size="md" />
                </Field.Root>
                <Field.Root w={{ base: "100%", sm: "250px" }} mt={{ base: 4, md: 0 }}>
                    <Field.Label>Sort By</Field.Label>
                    <NativeSelect.Root>
                        <NativeSelect.Field defaultValue="">
                            <option value="" disabled hidden>Sort By</option>
                            <option value="priceAsc">Price: Low to High</option>
                            <option value="priceDesc">Price: High to Low</option>
                            <option value="nameAsc">Name: A to Z</option>
                            <option value="nameDesc">Name: Z to A</option>
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                    </NativeSelect.Root>
                </Field.Root>
            </Flex>

            <Flex direction={{ base: "column", md: "row" }} align="start" gap="8">
                <Accordion.Root
                    width={{ base: "100%", md: "250px" }}
                    variant="outline"
                    multiple
                    collapsible
                    defaultValue={["category"]}
                >
                    <Accordion.Item value="category">
                        <Accordion.ItemTrigger>
                            <Text flex="1" fontWeight="medium">Category</Text>
                            <Accordion.ItemIndicator />
                        </Accordion.ItemTrigger>
                        <Accordion.ItemContent>
                            <Accordion.ItemBody as={Stack} px="4" py="3">
                                {categories.map(cat => (
                                    <Checkbox.Root key={cat} value={cat}>
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
                            <Text flex="1" fontWeight="medium">Subcategory</Text>
                            <Accordion.ItemIndicator />
                        </Accordion.ItemTrigger>
                        <Accordion.ItemContent>
                            <Accordion.ItemBody as={Stack} px="4" py="3">
                                {subcategories.map(sub => (
                                    <Checkbox.Root key={sub} value={sub}>
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control />
                                        <Checkbox.Label>{sub}</Checkbox.Label>
                                    </Checkbox.Root>
                                ))}
                            </Accordion.ItemBody>
                        </Accordion.ItemContent>
                    </Accordion.Item>

                    <Accordion.Item value="price">
                        <Accordion.ItemTrigger>
                            <Text flex="1" fontWeight="medium">Price Range</Text>
                            <Accordion.ItemIndicator />
                        </Accordion.ItemTrigger>
                        <Accordion.ItemContent>
                            <Accordion.ItemBody px="4" py="3">
                                <Field.Root mb="3">
                                    <Field.Label>Min Price</Field.Label>
                                    <Input type="number" size="sm" placeholder="Min" />
                                </Field.Root>
                                <Field.Root>
                                    <Field.Label>Max Price</Field.Label>
                                    <Input type="number" size="sm" placeholder="Max" />
                                </Field.Root>
                            </Accordion.ItemBody>
                        </Accordion.ItemContent>
                    </Accordion.Item>
                </Accordion.Root>

                {/* Products Grid */}
                <Box flex="1">
                    <SimpleGrid columns={{ base: 1, sm: 2, xl: 4 }} gap="6">
                        {products.map(product => (
                            <Card.Root key={product.id} variant="elevated" overflow="hidden">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    objectFit="cover"
                                    w="100%"
                                    h="180px"
                                />
                                <Card.Body p="4">
                                    <Card.Title fontSize="lg">{product.name}</Card.Title>
                                    <Card.Description mb="1">
                                        {product.category} — {product.subcategory}
                                    </Card.Description>
                                    <Text fontWeight="bold" color="fg.emphasized">
                                        ${product.price}
                                    </Text>
                                </Card.Body>
                                <Card.Footer p="4" pt="2" borderTopWidth="1px" justifyContent="flex-end">
                                    <Button size="sm" variant="outline">Learn more</Button>
                                </Card.Footer>
                            </Card.Root>
                        ))}
                    </SimpleGrid>
                </Box>
            </Flex>
        </Box>
    );
};

export default CatalogPage;