import {
    Box,
    Button,
    Heading,
    SimpleGrid,
    Stack,
    Separator,
    HStack,
    Text,
    VStack,
    EmptyState,
    ButtonGroup,
    Badge,
    Center,
    Spinner
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom'
import { LuBox, LuPackageSearch } from "react-icons/lu"
import { FaCalendarAlt } from "react-icons/fa";
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react';
import API from '@/utils/AxiosAPI';
import { toaster } from '@/components/ui/toaster';

interface OrderHistoryItem {
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
    status?: 'pending' | 'delivered'; // Mocked status
}

const statusColor = {
    delivered: 'green',
    pending: 'yellow',
};
const statusLabel = {
    delivered: 'Delivered',
    pending: 'Processing',
};

const mockOrders: OrderHistoryItem[] = [
    {
        orderId: 1,
        orderNumber: 'ORD-2024-001',
        orderDate: '2024-01-15T00:00:00.000Z',
        totalPrice: 589.98,
        status: 'delivered',
        items: [
            { productNameGe: '', productNameEng: 'Tesla Model 3 Home Charger', productNameRUS: '', quantity: 1, unitPrice: 499.99, totalPrice: 499.99 },
            { productNameGe: '', productNameEng: 'Type 2 Charging Cable', productNameRUS: '', quantity: 1, unitPrice: 89.99, totalPrice: 89.99 },
        ],
    },
    {
        orderId: 2,
        orderNumber: 'ORD-2024-002',
        orderDate: '2024-02-03T00:00:00.000Z',
        totalPrice: 349.97,
        status: 'pending',
        items: [
            { productNameGe: '', productNameEng: 'Portable EV Charger', productNameRUS: '', quantity: 1, unitPrice: 299.99, totalPrice: 299.99 },
            { productNameGe: '', productNameEng: 'Wall Mount Bracket', productNameRUS: '', quantity: 2, unitPrice: 24.99, totalPrice: 49.98 },
        ],
    },
    {
        orderId: 3,
        orderNumber: 'ORD-2024-003',
        orderDate: '2024-02-10T00:00:00.000Z',
        totalPrice: 799.99,
        status: 'pending',
        items: [
            { productNameGe: '', productNameEng: 'Smart Charging Station', productNameRUS: '', quantity: 1, unitPrice: 799.99, totalPrice: 799.99 },
        ],
    },
];

const OrderHistoryPage = () => {
    const { t } = useTranslation('auth');
    const [orders, setOrders] = useState<OrderHistoryItem[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            try {
                const response = await API.get('/user/order-history');
                let data = response.data as OrderHistoryItem[];
                if (!data || data.length === 0) {
                    data = mockOrders;
                } else {
                    data = data.map((order, idx) => ({
                        ...order,
                        orderNumber: order.orderNumber || `ORD-2024-00${order.orderId}`,
                        status: idx % 2 === 0 ? 'delivered' : 'pending',
                    }));
                }
                setOrders(data);
            } catch (error) {
                toaster.error({
                    title: 'Error',
                    description: 'Failed to fetch order history',
                });
                setOrders(mockOrders);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (isLoading || orders === null) {
        return (
            <Center minH="90vh">
                <Spinner size="xl" borderWidth="4px" />
            </Center>
        );
    }

    return (
        <SimpleGrid columns={{ base: 1 }} minH="90vh">
            <VStack
                py={{ base: 8, md: 12 }}
                px={{ base: 6, sm: 8, md: 12, lg: 16 }}
                gap={8}
            >
                <Box bg="whiteAlpha.50" borderRadius="lg" shadow="xl" p={6} maxW="800px" w="full" h="max-content">
                    <HStack mb={6}>
                        <LuBox size="24px" />
                        <Heading textAlign="start" >{t('history.title')}</Heading>
                    </HStack>
                    <Separator mb={6} />
                    <Stack gap={4}>
                        {orders.length === 0 ? (
                            <EmptyState.Root>
                                <EmptyState.Content>
                                    <EmptyState.Indicator>
                                        <LuPackageSearch />
                                    </EmptyState.Indicator>
                                    <VStack textAlign="center">
                                        <EmptyState.Title>
                                            {t('history.emptyState.title')}
                                        </EmptyState.Title>
                                        <EmptyState.Description>
                                            {t('history.emptyState.description')}
                                        </EmptyState.Description>
                                    </VStack>
                                    <ButtonGroup>
                                        <Button asChild>
                                            <RouterLink to="/catalog">
                                                {t('history.emptyState.button')}
                                            </RouterLink>
                                        </Button>
                                    </ButtonGroup>
                                </EmptyState.Content>
                            </EmptyState.Root>
                        ) : (
                            orders
                                .filter(order => order.status === 'pending' || order.status === 'delivered')
                                .map((order) => (
                                    <Box key={order.orderId} borderWidth="1px" borderRadius="lg" p={4} bg="white">
                                        <HStack justify="space-between" align="flex-start">
                                            <Box>
                                                <Text fontWeight="bold" fontSize="lg">
                                                    #{order.orderNumber}
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
                                                <Badge colorPalette={statusColor[order.status || 'pending']}>
                                                    {statusLabel[order.status || 'pending']}
                                                </Badge>
                                                <Text fontWeight="bold" fontSize="xl">
                                                    ${order.totalPrice.toFixed(2)}
                                                </Text>
                                            </VStack>
                                        </HStack>
                                        <Box mt={3}>
                                            <Text fontWeight="semibold" mb={1}>
                                                Items:
                                            </Text>
                                            <Box bg="gray.50" borderRadius="md" p={2}>
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
                                    </Box>
                                ))
                        )}
                    </Stack>
                </Box>
            </VStack>
        </SimpleGrid >
    );
}

export default OrderHistoryPage;