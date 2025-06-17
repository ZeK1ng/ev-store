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
    Spinner,
    Alert
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom'
import { LuBox, LuPackageSearch } from "react-icons/lu"
import { FaCalendarAlt } from "react-icons/fa";
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react';
import API from '@/utils/AxiosAPI';
import { toaster } from '@/components/ui/toaster';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedText } from '@/utils/languageUtils';

interface OrderHistoryItem {
    orderId: number;
    orderNumber: string;
    orderDate: string;
    totalPrice: number;
    items: Array<{
        nameENG: string;
        nameGE: string;
        nameRUS: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
    }>;
    orderStatus: 'PENDING' | 'COMPLETED' | 'CANCELED';
    specialInstruction: string;
}

const statusColor = {
    PENDING: 'yellow',
    COMPLETED: 'green',
    CANCELED: 'red',
};


const OrderHistoryPage = () => {
    const { t } = useTranslation('auth');
    const [orders, setOrders] = useState<OrderHistoryItem[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { language } = useLanguage();

    const statusLabel = {
        PENDING: t('history.status.pending'),
        COMPLETED: t('history.status.completed'),
        CANCELED: t('history.status.canceled'),
    };

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            try {
                const response = await API.get('/user/order-history');
                let data = response.data as OrderHistoryItem[];
                if (data && data.length > 0) {
                    data = data.map((order, idx) => ({
                        ...order,
                        orderNumber: order.orderNumber,
                        status: order.orderStatus
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
        window.scrollTo(0, 0);
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
                                .map((order) => (
                                    <Box key={order.orderId} borderWidth="1px" borderRadius="lg" p={4}>
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
                                                    {order.totalPrice.toFixed(2)} ₾
                                                </Text>
                                            </VStack>
                                        </HStack>
                                        <Box mt={3}>
                                            <Text fontWeight="semibold" mb={1}>
                                                {t('history.items')}
                                            </Text>
                                            <Box bg="bg.muted" borderRadius="md" p={2}>
                                                {order.items.map((item, idx) => (
                                                    <HStack key={idx} justify="space-between" py={1}>
                                                        <Text>
                                                            {getLocalizedText(item, language, 'name')} × {item.quantity}
                                                        </Text>
                                                        <Text color="gray.600">{item.unitPrice.toFixed(2)} ₾</Text>
                                                    </HStack>
                                                ))}
                                            </Box>
                                        </Box>
                                        {order.specialInstruction && (
                                            <Alert.Root status="warning" mt={4}>
                                                <Alert.Indicator />
                                                <Alert.Title>
                                                    {order.specialInstruction}
                                                </Alert.Title>
                                            </Alert.Root>
                                        )}

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