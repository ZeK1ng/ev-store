import { useState, useEffect, useCallback } from 'react'
import {
    Box,
    Flex,
    Heading,
    Button,
    Stack,
    Card,
    HStack,
    Badge,
    Text,
    VStack,
    Field,
    Input,
    EmptyState,
    Center,
    Spinner,
    Alert,
    ButtonGroup,
    IconButton,
    Pagination,
    Show,
    Separator
} from '@chakra-ui/react'
import { FaArrowLeft, FaChevronLeft, FaChevronRight, FaCalendarAlt } from "react-icons/fa";
import { LuPackageSearch } from "react-icons/lu";
import API from '@/utils/AxiosAPI';
import { toaster } from "@/components/ui/toaster";
import { debounce } from "lodash";
import { useTranslation } from 'react-i18next';

interface OrderItem {
    orderId: number;
    orderNumber: string;
    orderDate: string;
    totalPrice: number;
    items: Array<{
        productNameGe: string;
        productNameEng: string;
        productNameRUS: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
    }>;
    orderStatus: 'PENDING' | 'COMPLETED' | 'CANCELED';
}

const statusColor = {
    PENDING: 'yellow',
    COMPLETED: 'green',
    CANCELED: 'red',
};

const OrdersManagementAdminPage = () => {
    const { t } = useTranslation('auth');
    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState<number | null>(null);
    const [apiError, setApiError] = useState<string | null>(null);
    const [searchId, setSearchId] = useState<string>('');
    const [totalOrders, setTotalOrders] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 10;

    const statusLabel = {
        PENDING: t('history.status.pending'),
        COMPLETED: t('history.status.completed'),
        CANCELED: t('history.status.canceled'),
    };

    const fetchOrders = async (id: string = '', page: number = 0) => {
        try {
            setIsLoading(true);
            setApiError(null);
            const params = new URLSearchParams({
                page: page.toString(),
                size: pageSize.toString(),
                ...(id && { id })
            });

            const response = await API.get(`/admin/orders/get-all?${params.toString()}`);
            setOrders(response.data.content || []);
            setTotalOrders(response.data.totalElements || 0);
        } catch (error) {
            setApiError('Error fetching orders');
            toaster.error({
                title: 'Error',
                description: 'Failed to fetch orders'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const debouncedSearch = useCallback(
        debounce((orderId: string) => {
            fetchOrders(orderId, 0);
            setCurrentPage(0);
        }, 500),
        []
    );

    const handleIdSearch = (value: string) => {
        setSearchId(value);
        debouncedSearch(value);
    };

    const handleStatusChange = async (orderId: number, newStatus: 'PENDING' | 'COMPLETED' | 'CANCELED') => {
        try {
            setIsUpdating(orderId);
            setApiError(null);
            await API.patch(`/admin/orders/change-status?orderId=${orderId}&orderStatus=${newStatus}`);
            
            toaster.success({
                title: 'Success',
                description: 'Order status updated successfully'
            });

            fetchOrders(searchId, currentPage);
        } catch (error) {
            setApiError('Error updating order status');
            toaster.error({
                title: 'Error',
                description: 'Failed to update order status'
            });
        } finally {
            setIsUpdating(null);
        }
    };

    useEffect(() => {
        fetchOrders(searchId, currentPage);
    }, [currentPage]);

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
                        <LuPackageSearch />Orders Management
                    </HStack>
                </Heading>
                <Field.Root w={{ base: '100%', md: '300px' }}>
                    <Input
                        placeholder="Search by Order ID"
                        size="md"
                        value={searchId}
                        onChange={(e) => handleIdSearch(e.target.value)}
                    />
                </Field.Root>
            </Flex>

            {orders.length === 0 ? (
                <EmptyState.Root>
                    <EmptyState.Content>
                        <EmptyState.Indicator>
                            <LuPackageSearch size={48} />
                        </EmptyState.Indicator>
                        <VStack textAlign="center">
                            <EmptyState.Title>
                                No Orders Found
                            </EmptyState.Title>
                            <EmptyState.Description>
                                {searchId
                                    ? 'No orders match your search criteria'
                                    : 'There are no orders in the system'}
                            </EmptyState.Description>
                        </VStack>
                    </EmptyState.Content>
                </EmptyState.Root>
            ) : (
                <Stack gap={5}>
                    {orders.map((order) => (
                        <Card.Root key={order.orderId} overflow="hidden" size="sm">
                            <Card.Body>
                                <HStack justify="space-between" align="flex-start">
                                    <Box>
                                        <Text fontWeight="bold" fontSize="lg">
                                            {order.orderNumber}-{order.orderId}
                                        </Text>
                                        <HStack color="gray.500" fontSize="sm" mt={1}>
                                            <FaCalendarAlt />
                                            <span>
                                                {new Date(order.orderDate).toLocaleDateString(undefined, {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </span>
                                        </HStack>
                                    </Box>
                                    <VStack align="end" gap={1}>
                                        <Badge colorPalette={statusColor[order.orderStatus]} size="md">
                                            {statusLabel[order.orderStatus]}
                                        </Badge>
                                        <Text fontWeight="bold" fontSize="xl">
                                            ${order.totalPrice.toFixed(2)}
                                        </Text>
                                    </VStack>
                                </HStack>
                                <Separator my={3} />
                                <Box>
                                    <Text fontWeight="semibold" mb={1}>
                                        Items
                                    </Text>
                                    <Box bg="bg.muted" borderRadius="md" p={2}>
                                        {order.items.map((item, idx) => (
                                            <HStack key={idx} justify="space-between" py={1}>
                                                <Text>
                                                    {item.productNameEng} × {item.quantity}
                                                </Text>
                                                <Text color="gray.600">${item.unitPrice.toFixed(2)}</Text>
                                            </HStack>
                                        ))}
                                    </Box>
                                </Box>
                                <Separator my={3} />
                                <ButtonGroup size="sm" w="full" justifyContent="end" gap={2}>
                                    <Button
                                        colorPalette="yellow"
                                        variant={order.orderStatus === 'PENDING' ? 'surface' : 'solid'}
                                        disabled={order.orderStatus === 'PENDING'}
                                        onClick={() => handleStatusChange(order.orderId, 'PENDING')}
                                        loading={isUpdating === order.orderId && order.orderStatus === 'PENDING'}
                                    >
                                        {statusLabel.PENDING}
                                    </Button>
                                    <Button
                                        colorPalette="green"
                                        variant={order.orderStatus === 'COMPLETED' ? 'surface' : 'solid'}
                                        disabled={order.orderStatus === 'COMPLETED'}
                                        onClick={() => handleStatusChange(order.orderId, 'COMPLETED')}
                                        loading={isUpdating === order.orderId && order.orderStatus === 'COMPLETED'}
                                    >
                                        {statusLabel.COMPLETED}
                                    </Button>
                                    <Button
                                        colorPalette="red"
                                        variant={order.orderStatus === 'CANCELED' ? 'surface' : 'solid'}
                                        disabled={order.orderStatus === 'CANCELED'}
                                        onClick={() => handleStatusChange(order.orderId, 'CANCELED')}
                                        loading={isUpdating === order.orderId && order.orderStatus === 'CANCELED'}
                                    >
                                        {statusLabel.CANCELED}
                                    </Button>
                                </ButtonGroup>
                            </Card.Body>
                        </Card.Root>
                    ))}

                    <Show when={totalOrders > pageSize}>
                        <Pagination.Root
                            count={totalOrders}
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

export default OrdersManagementAdminPage
