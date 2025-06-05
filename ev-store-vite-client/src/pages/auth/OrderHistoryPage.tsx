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
    ButtonGroup
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom'
import { LuBox, LuPackageSearch } from "react-icons/lu"
import { useTranslation } from 'react-i18next'

interface OrderHistoryItem {
    id: string;
    date: string;
    total: number;
    items: Array<{
        productId: string;
        quantity: number;
        price: number;
    }>;
}

const OrderHistoryPage = () => {
    const { t } = useTranslation('auth');

    const historyItems = [
        {
            id: '1',
            date: '2023-10-01',
            total: 150.00,
            items: [
                { productId: 'p1', quantity: 2, price: 50.00 },
                { productId: 'p2', quantity: 1, price: 50.00 }
            ]
        },
        {
            id: '2',
            date: '2023-10-05',
            total: 200.00,
            items: [
                { productId: 'p3', quantity: 1, price: 200.00 }
            ]
        }
    ] as OrderHistoryItem[];

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
                        {historyItems.length === 0 ? (
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
                            historyItems.map((item, index) => (
                                <Box key={index} p={4} borderWidth="1px" borderRadius="md">
                                    {/* Render history item details here */}
                                    <Text>{item}</Text>
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