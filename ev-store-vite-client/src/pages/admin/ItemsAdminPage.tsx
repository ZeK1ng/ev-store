import { useState, useEffect, useCallback } from 'react'
import {
    Box,
    Flex,
    Heading,
    Button,
    Stack,
    Card,
    Dialog,
    Portal,
    HStack,
    Badge,
    DataList,
    CloseButton,
    Text,
    SimpleGrid,
    VStack,
    Field,
    Input,
    EmptyState,
    List,
    Center,
    Spinner,
    Alert,
    ButtonGroup,
    IconButton,
    Pagination,
    Show,
    Link
} from '@chakra-ui/react'
import { FaPlus, FaEye, FaEdit, FaLayerGroup, FaTrashAlt, FaArrowLeft, FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { LuPackageSearch } from "react-icons/lu";
import API from '@/utils/AxiosAPI';
import { toaster } from "@/components/ui/toaster";
import { debounce } from "lodash";
import CachedImage from "@/utils/CachedImage"


interface Item {
    productId: string
    nameGE: string
    nameENG: string
    nameRUS: string
    descriptionGE: string
    descriptionENG: string
    descriptionRUS: string
    price: number
    stockAmount: number
    categoryName: string
    isPopular: boolean
    mainImageId: number
    imageIds: number[]
    tutorialLink: string
}

const ItemsAdminPage = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [apiError, setApiError] = useState<string | null>(null);
    const [searchName, setSearchName] = useState<string>('');
    const [searchId, setSearchId] = useState<string>('');
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 10;

    const [filteredItems, setFilteredItems] = useState<Item[]>([]);

    const fetchItems = async (name: string = '', productId: string = '', page: number = 0) => {
        try {
            setIsLoading(true);
            setApiError(null);
            const params = new URLSearchParams({
                page: page.toString(),
                size: pageSize.toString(),
                direction: 'asc',
                ...(name && { name }),
                ...(productId && { productId })
            });

            const response = await API.get(`/product?${params.toString()}`);
            setItems(response.data.content || []);
            setFilteredItems(response.data.content || []);
            setTotalItems(response.data.totalElements || 0);
        } catch (error) {
            setApiError('Error fetching items');
            toaster.error({
                title: 'Error',
                description: 'Failed to fetch items'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const debouncedSearch = useCallback(
        debounce((name: string, productId: string) => {
            fetchItems(name, productId, 0);
            setCurrentPage(0);
        }, 500),
        []
    );

    const handleNameSearch = (value: string) => {
        setSearchName(value);
        debouncedSearch(value, searchId);
    };

    const handleIdSearch = (value: string) => {
        setSearchId(value);
        debouncedSearch(searchName, value);
    };

    useEffect(() => {
        fetchItems(searchName, searchId, currentPage);
    }, [currentPage]);

    useEffect(() => {
        setFilteredItems(items);
    }, [searchName, searchId, items]);

    const handleDelete = async (id: string) => {
        try {
            setIsDeleting(id);
            setApiError(null);
            await API.delete(`/admin/products/${id}`);

            toaster.success({
                title: 'Success',
                description: 'Item deleted successfully'
            });

            fetchItems();
        } catch (error) {
            setApiError('Error deleting item');
            toaster.error({
                title: 'Error',
                description: 'Failed to delete item'
            });
        } finally {
            setIsDeleting(null);
        }
    }

    if (isLoading) {
        return (
            <Center minH="90vh">
                <Spinner size="xl" borderWidth="4px" />
            </Center>
        );
    }

    return (
        <Box p={8} maxW="800px" mx="auto" h="100dvh">
            {apiError && (
                <Alert.Root status="error" mb={4}>
                    <Alert.Indicator />
                    <Alert.Title>{apiError}</Alert.Title>
                </Alert.Root>
            )}
            <Button size="xs" asChild variant='outline'>
                <a href="/cms-admin">
                    <FaArrowLeft />
                    Back to Admin Dashboard
                </a>
            </Button>
            <Flex justify="space-between" align="center" mt={6} mb={6} direction={{ base: 'column', md: 'row' }} gap={4}>
                <Heading>
                    <HStack>
                        <FaLayerGroup />Items
                    </HStack>
                </Heading>
                <Stack direction={{ base: 'column', md: 'row' }} gap={2} w={{ base: '100%', md: 'auto' }}>
                    <Field.Root flex="1">
                        <Input
                            placeholder="Search by name"
                            size="md"
                            value={searchName}
                            onChange={(e) => handleNameSearch(e.target.value)}
                        />
                    </Field.Root>
                    <Field.Root flex="1">
                        <Input
                            placeholder="Search by ID"
                            size="md"
                            value={searchId}
                            onChange={(e) => handleIdSearch(e.target.value)}
                        />
                    </Field.Root>
                    <Button asChild w={{ base: '100%', md: 'auto' }}>
                        <a href="/cms-admin/items/create">
                            Create Item <FaPlus />
                        </a>
                    </Button>
                </Stack>
            </Flex>

            {items.length === 0 ? (
                <EmptyState.Root>
                    <EmptyState.Content>
                        <EmptyState.Indicator>
                            <LuPackageSearch size={48} />
                        </EmptyState.Indicator>
                        <VStack textAlign="center">
                            <EmptyState.Title>
                                No Items Found
                            </EmptyState.Title>
                            <EmptyState.Description>
                                {searchName || searchId
                                    ? 'No items match your search criteria'
                                    : 'Start by creating your first item to add to your catalog'}
                            </EmptyState.Description>
                        </VStack>
                    </EmptyState.Content>
                </EmptyState.Root>
            ) : filteredItems.length === 0 ? (
                <EmptyState.Root>
                    <EmptyState.Content>
                        <EmptyState.Indicator>
                            <FaSearch />
                        </EmptyState.Indicator>
                        <VStack textAlign="center">
                            <EmptyState.Title>No results found</EmptyState.Title>
                            <EmptyState.Description>
                                Try adjusting your search
                            </EmptyState.Description>
                        </VStack>
                        <List.Root variant="marker">
                            <List.Item>Try removing filters</List.Item>
                            <List.Item>Try different keywords</List.Item>
                        </List.Root>
                    </EmptyState.Content>
                </EmptyState.Root>
            ) : (
                <Stack gap={5}>
                    {filteredItems.length > 0 && filteredItems.map(item => (
                        <Card.Root key={item.productId} overflow="hidden" size="sm" flexDirection={{ base: 'column', md: 'row' }}>
                            <CachedImage imageId={item.mainImageId} alt={item.nameENG} width="100%" aspectRatio="1" borderRadius="md" />
                            <Box flex="1">
                                <Card.Body>
                                    <Card.Title mb="2" fontSize={{ base: 'lg', md: 'xl' }}>{item.nameENG}</Card.Title>
                                    <Card.Description fontSize={{ base: 'sm', md: 'md' }} lineClamp={2}>
                                        {item.descriptionENG}
                                    </Card.Description>
                                    <SimpleGrid columns={{ base: 2, md: 4 }} gap={2} mt="4">
                                        <Badge size="md" p={2} borderRadius="md" textAlign="center">Price: {item.price} $</Badge>
                                        <Badge size="md" p={2} borderRadius="md" textAlign="center">Qty: {item.stockAmount}</Badge>
                                        <Badge size="md" p={2} borderRadius="md" textAlign="center" colorPalette="yellow">{item.categoryName}</Badge>
                                        <Badge size="md" p={2} borderRadius="md" textAlign="center" colorPalette="green">Popular: {item.isPopular ? 'Yes' : 'No'}</Badge>
                                    </SimpleGrid>
                                </Card.Body>
                                <Card.Footer justifyContent={{ base: 'center', md: 'flex-end' }} flexWrap="wrap" gap={2}>
                                    <Dialog.Root scrollBehavior="inside" size={{ base: 'full', md: 'lg' }}>
                                        <Dialog.Trigger asChild>
                                            <Button
                                                size={{ base: 'md', md: 'sm' }}
                                                variant="outline"
                                                w={{ base: 'full', md: 'auto' }}
                                                disabled={isDeleting === item.productId}
                                            >
                                                <FaEye />
                                                <Box ml={2}>View</Box>
                                            </Button>
                                        </Dialog.Trigger>
                                        <Portal>
                                            <Dialog.Backdrop />
                                            <Dialog.Positioner>
                                                <Dialog.Content>
                                                    <Dialog.Header>
                                                        <Dialog.Title>Item Details</Dialog.Title>
                                                        <Dialog.CloseTrigger asChild>
                                                            <CloseButton size="sm" />
                                                        </Dialog.CloseTrigger>
                                                    </Dialog.Header>
                                                    <Dialog.Body pb={8}>
                                                        <DataList.Root orientation="vertical" gap={4}>
                                                            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                                                                <DataList.Item>
                                                                    <DataList.ItemLabel>Name (EN)</DataList.ItemLabel>
                                                                    <DataList.ItemValue>{item.nameENG}</DataList.ItemValue>
                                                                </DataList.Item>
                                                                <DataList.Item>
                                                                    <DataList.ItemLabel>Name (GE)</DataList.ItemLabel>
                                                                    <DataList.ItemValue>{item.nameGE}</DataList.ItemValue>
                                                                </DataList.Item>
                                                                <DataList.Item>
                                                                    <DataList.ItemLabel>Name (RU)</DataList.ItemLabel>
                                                                    <DataList.ItemValue>{item.nameRUS}</DataList.ItemValue>
                                                                </DataList.Item>
                                                                <DataList.Item>
                                                                    <DataList.ItemLabel>Description (EN)</DataList.ItemLabel>
                                                                    <DataList.ItemValue>{item.descriptionENG}</DataList.ItemValue>
                                                                </DataList.Item>
                                                                <DataList.Item>
                                                                    <DataList.ItemLabel>Description (GE)</DataList.ItemLabel>
                                                                    <DataList.ItemValue>{item.descriptionGE}</DataList.ItemValue>
                                                                </DataList.Item>
                                                                <DataList.Item>
                                                                    <DataList.ItemLabel>Description (RU)</DataList.ItemLabel>
                                                                    <DataList.ItemValue>{item.descriptionRUS}</DataList.ItemValue>
                                                                </DataList.Item>
                                                            </SimpleGrid>
                                                            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                                                                <DataList.Item>
                                                                    <DataList.ItemLabel>Price</DataList.ItemLabel>
                                                                    <DataList.ItemValue>
                                                                        <Badge size="md" p={2} borderRadius="md">Price: {item.price} $</Badge>
                                                                    </DataList.ItemValue>
                                                                </DataList.Item>
                                                                <DataList.Item>
                                                                    <DataList.ItemLabel>Quantity</DataList.ItemLabel>
                                                                    <DataList.ItemValue>
                                                                        <Badge size="md" p={2} borderRadius="md">Quantity: {item.stockAmount}</Badge>
                                                                    </DataList.ItemValue>
                                                                </DataList.Item>
                                                                <DataList.Item>
                                                                    <DataList.ItemLabel>Category</DataList.ItemLabel>
                                                                    <DataList.ItemValue>
                                                                        <Badge size="md" p={2} borderRadius="md" colorPalette="yellow">{item.categoryName}</Badge>
                                                                    </DataList.ItemValue>
                                                                </DataList.Item>
                                                                <DataList.Item>
                                                                    <DataList.ItemLabel>Is Popular</DataList.ItemLabel>
                                                                    <DataList.ItemValue>
                                                                        <Badge size="md" p={2} borderRadius="md" colorPalette="green">{item.isPopular ? 'Yes' : 'No'}</Badge>
                                                                    </DataList.ItemValue>
                                                                </DataList.Item>
                                                            </SimpleGrid>
                                                        </DataList.Root>

                                                        {item.tutorialLink && (
                                                            <Box mt={6}>
                                                                <Text fontWeight="semibold" mb={2}>Tutorial</Text>
                                                                <Badge size="lg" p={2}>
                                                                    <Link href={`https://${item.tutorialLink}`} target="_blank">
                                                                        {item.tutorialLink}
                                                                    </Link>
                                                                </Badge>
                                                            </Box>
                                                        )}


                                                        {item.imageIds && item.imageIds.length > 0 ? (
                                                            <Box mt={6}>
                                                                <Text fontWeight="semibold" mb={2}>Additional Images</Text>
                                                                <SimpleGrid columns={{ base: 2, md: 3 }} gap={3}>
                                                                    {item.imageIds.map((src, idx) => (
                                                                        <CachedImage key={idx} imageId={src} alt={`Image ${idx + 1}`} w="100%" aspectRatio="1" borderRadius="md" />
                                                                    ))}
                                                                </SimpleGrid>
                                                            </Box>
                                                        ) : (
                                                            <Alert.Root status="info" mt={6}>
                                                                <Alert.Indicator />
                                                                <Alert.Title>No additional images</Alert.Title>
                                                            </Alert.Root>
                                                        )}
                                                    </Dialog.Body>
                                                    <Dialog.CloseTrigger asChild>
                                                        <CloseButton size="sm" />
                                                    </Dialog.CloseTrigger>
                                                </Dialog.Content>
                                            </Dialog.Positioner>
                                        </Portal>
                                    </Dialog.Root>

                                    <Button
                                        size={{ base: 'md', md: 'sm' }}
                                        variant="outline"
                                        w={{ base: 'full', md: 'auto' }}
                                        asChild
                                        disabled={isDeleting === item.productId}
                                    >
                                        <a href={`/cms-admin/items/${item.productId}`}>
                                            <FaEdit />
                                            <Box ml={2}>Edit</Box>
                                        </a>
                                    </Button>

                                    <Dialog.Root >
                                        <Dialog.Trigger asChild>
                                            <Button
                                                size={{ base: 'md', md: 'sm' }}
                                                colorPalette="red"
                                                w={{ base: 'full', md: 'auto' }}
                                                disabled={isDeleting === item.productId}
                                            >
                                                {isDeleting === item.productId ? (
                                                    <HStack>
                                                        <Spinner size="sm" />
                                                        <Box ml={2}>Deleting...</Box>
                                                    </HStack>
                                                ) : (
                                                    <>
                                                        <FaTrashAlt />
                                                        <Box ml={2}>Delete</Box>
                                                    </>
                                                )}
                                            </Button>
                                        </Dialog.Trigger>
                                        <Portal>
                                            <Dialog.Backdrop />
                                            <Dialog.Positioner>
                                                <Dialog.Content>
                                                    <Dialog.Header>
                                                        <Dialog.Title>Confirm Deletion</Dialog.Title>
                                                        <Dialog.CloseTrigger asChild>
                                                            <CloseButton size="sm" />
                                                        </Dialog.CloseTrigger>
                                                    </Dialog.Header>
                                                    <Dialog.Body>
                                                        Are you sure you want to delete "{item.nameENG}"?
                                                    </Dialog.Body>
                                                    <Dialog.Footer>
                                                        <Dialog.ActionTrigger asChild>
                                                            <Button variant="outline" disabled={isDeleting === item.productId}>
                                                                Cancel
                                                            </Button>
                                                        </Dialog.ActionTrigger>
                                                        <Button
                                                            colorPalette="red"
                                                            onClick={() => handleDelete(item.productId)}
                                                            disabled={isDeleting === item.productId}
                                                        >
                                                            {isDeleting === item.productId ? 'Deleting...' : 'Delete'}
                                                        </Button>
                                                    </Dialog.Footer>
                                                </Dialog.Content>
                                            </Dialog.Positioner>
                                        </Portal>
                                    </Dialog.Root>
                                </Card.Footer>
                            </Box>
                        </Card.Root>
                    ))}

                    <Show when={totalItems > pageSize}>
                        <Pagination.Root
                            count={totalItems}
                            pageSize={pageSize}
                            page={currentPage + 1}
                            onPageChange={(details) => {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                setCurrentPage(details.page - 1);
                            }}
                            mt="6"
                            justifySelf="center"
                        >
                            <ButtonGroup variant="ghost" size="sm">
                                <Pagination.PrevTrigger asChild>
                                    <IconButton aria-label="Previous page">
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
                                    <IconButton aria-label="Next page">
                                        <FaChevronRight />
                                    </IconButton>
                                </Pagination.NextTrigger>
                            </ButtonGroup>
                        </Pagination.Root>
                    </Show>
                </Stack>
            )}
        </Box>
    )
}

export default ItemsAdminPage
