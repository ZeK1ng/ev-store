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
    status?: 'pending' | 'delivered';
}

const statusColor = {
    delivered: 'green',
    pending: 'yellow',
};
const statusLabel = {
    delivered: 'Delivered',
    pending: 'Processing',
};

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
                if (data && data.length > 0) {
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
                                    <Box key={order.orderId} borderWidth="1px" borderRadius="lg" p={4}>
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
                                                <Badge colorPalette={statusColor[order.status || 'pending']} size="md">
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