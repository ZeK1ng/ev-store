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
    Image,
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
    Alert
} from '@chakra-ui/react'
import { FaPlus, FaEye, FaEdit, FaLayerGroup, FaTrashAlt, FaArrowLeft, FaSearch } from "react-icons/fa";
import { LuPackageSearch } from "react-icons/lu";
import API from '@/utils/AxiosAPI';
import { toaster } from "@/components/ui/toaster";
import { debounce } from "lodash";


interface Item {
    id: string
    nameEn: string
    descriptionEn: string
    quantity: number
    price: number
    mainImage: string
    images: string[]
    nameGe: string
    nameRu: string
    descriptionGe: string
    descriptionRu: string
}

const ItemsAdminPage = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [apiError, setApiError] = useState<string | null>(null);
    const [searchName, setSearchName] = useState<string>('');
    const [searchId, setSearchId] = useState<string>('');

    const [filteredItems, setFilteredItems] = useState<Item[]>([]);

    const fetchItems = async (name: string = '', productId: string = '') => {
        try {
            setIsLoading(true);
            setApiError(null);
            const params = new URLSearchParams({
                page: '0',
                size: '1000',
                sortBy: 'id',
                direction: 'asc',
                ...(name && { name }),
                ...(productId && { productId })
            });

            const response = await API.get(`/product?${params.toString()}`);
            setItems(response.data.content || []);
            setFilteredItems(response.data.content || []);
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
            fetchItems(name, productId);
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
        fetchItems();
    }, []);

    useEffect(() => {
        let updated = items;

        if (searchName.trim() !== '') {
            const lowerName = searchName.toLowerCase();
            updated = updated.filter((item) => item.nameEn.toLowerCase().includes(lowerName));
        }

        if (searchId.trim() !== '') {
            updated = updated.filter((item) => item.id.includes(searchId.trim()));
        }

        setFilteredItems(updated);
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
            {/* Header with Create Button */}
            <Flex justify="space-between" align="center" mt={6} mb={6}>
                <Heading>
                    <HStack>
                        <FaLayerGroup />Items
                    </HStack>
                </Heading>
                <HStack gap={2}>
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
                    <Button asChild>
                        <a href="/cms-admin/items/create">
                            Create Item <FaPlus />
                        </a>
                    </Button>
                </HStack>
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
                    {filteredItems.map(item => (
                        <Card.Root key={item.id} overflow="hidden" size="sm" flexDirection={{ base: 'column', md: 'row' }}>
                            <Image
                                objectFit="cover"
                                maxW={{ base: '100%', md: '200px' }}
                                maxH={{ base: '150px', md: '100%' }}
                                src={item.mainImage}
                                alt={item.nameEn}
                            />
                            <Box>
                                <Card.Body>
                                    <Card.Title mb="2">{item.nameEn}</Card.Title>
                                    <Card.Description>
                                        {item.descriptionEn}
                                    </Card.Description>
                                    <HStack mt="4">
                                        <Badge>Price: {item.price} $</Badge>
                                        <Badge>quantity: {item.quantity}</Badge>
                                    </HStack>
                                </Card.Body>
                                <Card.Footer justifyContent="flex-end">
                                    <Dialog.Root scrollBehavior="inside" size="lg">
                                        <Dialog.Trigger asChild>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                mr={2}
                                                disabled={isDeleting === item.id}
                                            >
                                                <FaEye />
                                                <Box display={{ base: 'none', md: 'inline' }}>
                                                    View
                                                </Box>
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
                                                        <DataList.Root orientation="vertical">
                                                            <DataList.Item>
                                                                <DataList.ItemLabel>Name (EN)</DataList.ItemLabel>
                                                                <DataList.ItemValue>{item.nameEn}</DataList.ItemValue>
                                                            </DataList.Item>
                                                            <DataList.Item>
                                                                <DataList.ItemLabel>Name (GE)</DataList.ItemLabel>
                                                                <DataList.ItemValue>{item.nameGe}</DataList.ItemValue>
                                                            </DataList.Item>
                                                            <DataList.Item>
                                                                <DataList.ItemLabel>Name (RU)</DataList.ItemLabel>
                                                                <DataList.ItemValue>{item.nameRu}</DataList.ItemValue>
                                                            </DataList.Item>
                                                            <DataList.Item>
                                                                <DataList.ItemLabel>Description (EN)</DataList.ItemLabel>
                                                                <DataList.ItemValue>{item.descriptionEn}</DataList.ItemValue>
                                                            </DataList.Item>
                                                            <DataList.Item>
                                                                <DataList.ItemLabel>Description (GE)</DataList.ItemLabel>
                                                                <DataList.ItemValue>{item.descriptionGe}</DataList.ItemValue>
                                                            </DataList.Item>
                                                            <DataList.Item>
                                                                <DataList.ItemLabel>Description (RU)</DataList.ItemLabel>
                                                                <DataList.ItemValue>{item.descriptionRu}</DataList.ItemValue>
                                                            </DataList.Item>
                                                            <DataList.Item>
                                                                <DataList.ItemLabel>Price</DataList.ItemLabel>
                                                                <DataList.ItemValue>${item.price}</DataList.ItemValue>
                                                            </DataList.Item>
                                                            <DataList.Item>
                                                                <DataList.ItemLabel>Quantity</DataList.ItemLabel>
                                                                <DataList.ItemValue>{item.quantity}</DataList.ItemValue>
                                                            </DataList.Item>
                                                        </DataList.Root>

                                                        {item.images.length > 0 && (
                                                            <Box mt={6}>
                                                                <Text fontWeight="semibold" mb={2}>Additional Images</Text>
                                                                <SimpleGrid columns={3} gap={2}>
                                                                    {item.images.map((src, idx) => (
                                                                        <Image
                                                                            key={idx}
                                                                            src={src}
                                                                            alt={`Image ${idx + 1}`}
                                                                            objectFit="cover"
                                                                            w="100%"
                                                                            aspectRatio="1"
                                                                            borderRadius="md"
                                                                        />
                                                                    ))}
                                                                </SimpleGrid>
                                                            </Box>
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
                                        size="sm"
                                        variant="outline"
                                        mr={2}
                                        asChild
                                        disabled={isDeleting === item.id}
                                    >
                                        <a href={`/cms-admin/items/${item.id}`}>
                                            <FaEdit />
                                            <Box display={{ base: 'none', md: 'inline' }}>
                                                Edit
                                            </Box>
                                        </a>
                                    </Button>

                                    <Dialog.Root>
                                        <Dialog.Trigger asChild>
                                            <Button 
                                                size="sm" 
                                                colorPalette="red"
                                                disabled={isDeleting === item.id}
                                            >
                                                {isDeleting === item.id ? (
                                                    <HStack>
                                                        <Spinner size="sm" />
                                                        <Box display={{ base: 'none', md: 'inline' }}>
                                                            Deleting...
                                                        </Box>
                                                    </HStack>
                                                ) : (
                                                    <>
                                                        <FaTrashAlt />
                                                        <Box display={{ base: 'none', md: 'inline' }}>
                                                            Delete
                                                        </Box>
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
                                                        Are you sure you want to delete "{item.nameEn}"?
                                                    </Dialog.Body>
                                                    <Dialog.Footer>
                                                        <Dialog.ActionTrigger asChild>
                                                            <Button variant="outline" disabled={isDeleting === item.id}>
                                                                Cancel
                                                            </Button>
                                                        </Dialog.ActionTrigger>
                                                        <Button
                                                            colorPalette="red"
                                                            onClick={() => handleDelete(item.id)}
                                                            disabled={isDeleting === item.id}
                                                        >
                                                            {isDeleting === item.id ? 'Deleting...' : 'Delete'}
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
                </Stack>
            )}
        </Box>
    )
}

export default ItemsAdminPage
