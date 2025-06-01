import { useState } from 'react';
import {
    Box,
    Flex,
    Stack,
    Text,
    Heading,
    Image,
    IconButton,
    Button,
    Input,
    Textarea,
    HStack,
    Field,
    NumberInput,
    Badge,
    EmptyState,
    VStack,
    ButtonGroup
} from '@chakra-ui/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FaTrash } from 'react-icons/fa';
import { LuMinus, LuPlus } from 'react-icons/lu';
import { useTranslation } from "react-i18next";
import { LuShoppingCart } from "react-icons/lu"
import { Link as RouterLink } from 'react-router-dom'



interface CartItem {
    id: string;
    title: string;
    description: string;
    price: number;
    quantity: number;
    imageUrl: string;
}

interface ReservationFormValues {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    notes: string;
}

const CartPage = () => {
    const { t } = useTranslation('cart');
    const isAuthenticated = false;
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: '1',
            title: 'Premium Dining Table',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            price: 899,
            quantity: 1,
            imageUrl: 'https://placehold.co/100x100',
        },
        {
            id: '2',
            title: 'Ergonomic Office Chair',
            description: 'Comfortable office chair with lumbar support',
            price: 299,
            quantity: 2,
            imageUrl: 'https://placehold.co/100x100',
        },
        {
            id: '3',
            title: 'Modern Bookshelf',
            description: '5-tier wooden bookshelf',
            price: 199,
            quantity: 1,
            imageUrl: 'https://placehold.co/100x100',
        },
        {
            id: '4',
            title: 'Vintage Lamp',
            description: 'Classic brass lamp with Edison bulb',
            price: 150,
            quantity: 1,
            imageUrl: 'https://placehold.co/100x100',
        },
    ]);

    // React Hook Form for reservation details
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ReservationFormValues>({
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            address: '',
            notes: '',
        },
    });

    const removeItem = (id: string) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const updateQuantity = (id: string, newQty: number) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity: newQty } : item
            )
        );
    };

    // Calculate subtotal & total
    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const totalValue = subtotal; // Adjust if taxes/fees are added

    const onSubmit: SubmitHandler<ReservationFormValues> = (data) => {
        console.log('Reservation Details:', data);
        console.log('Cart Items:', cartItems);
        // TODO: send reservation data to API
    };

    return (
        <Box minH="100vh" px={{ base: 4, md: 8 }} py={8}>
            <Flex mb={6} align="center">
                <Heading size="xl">
                    {t('title')}
                </Heading>
                <Badge px={2} ml={4} variant="solid">
                    {cartItems.length} {t('quantity')}
                </Badge>
            </Flex>

            <Flex direction={{ base: 'column', lg: 'row' }} gap={8}>
                <Box flex={2} borderRadius="md" border="xs" borderColor="border" p={6} h="max-content">
                    <Heading size="lg" mb={4}>
                        {t('cart.title')}
                    </Heading>

                    <Stack gap={4}>
                        {cartItems.map((item) => (
                            <Flex
                                key={item.id}
                                align="flex-start"
                                justify="space-between"
                                flexDirection={{ base: 'column', md: 'row' }}
                                p={{ base: 2, md: 4 }}
                                bg="whiteAlpha.200" borderRadius="lg"
                                gap={4}
                            >
                                <HStack gap={4} align="center">
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.title}
                                        boxSize="80px"
                                        objectFit="cover"
                                        borderRadius="md"
                                    />
                                    <Box>
                                        <Text fontWeight="bold">{item.title}</Text>
                                        <Text fontSize="sm" color="gray.500" lineClamp="2">
                                            {item.description}
                                        </Text>
                                    </Box>
                                </HStack>

                                <HStack gap={4} alignSelf={{ base: 'end', md: 'center' }}>
                                    <Field.Root id={`quantity-${item.id}`} invalid={false}>
                                        <NumberInput.Root defaultValue={String(item.quantity)} unstyled spinOnPress={false}
                                            min={1} max={50} step={1}
                                            onValueChange={(e) => {
                                                const val = parseInt(e.value);
                                                if (!isNaN(val) && val >= 1) {
                                                    updateQuantity(item.id, val);
                                                }
                                            }}
                                        >
                                            <HStack gap="2">
                                                <NumberInput.DecrementTrigger asChild>
                                                    <IconButton variant="outline" size="sm">
                                                        <LuMinus />
                                                    </IconButton>
                                                </NumberInput.DecrementTrigger>
                                                <NumberInput.ValueText textAlign="center" fontSize="lg" minW="3ch" />
                                                <NumberInput.IncrementTrigger asChild>
                                                    <IconButton variant="outline" size="sm">
                                                        <LuPlus />
                                                    </IconButton>
                                                </NumberInput.IncrementTrigger>
                                            </HStack>
                                        </NumberInput.Root>
                                    </Field.Root>

                                    <Text fontWeight="bold">${(item.price * item.quantity).toFixed(2)}</Text>

                                    <IconButton
                                        aria-label="Remove item"
                                        size="sm"
                                        colorScheme="red"
                                        variant="outline"
                                        onClick={() => removeItem(item.id)}
                                    >
                                        <FaTrash />
                                    </IconButton>
                                </HStack>
                            </Flex>
                        ))}

                        {cartItems.length === 0 && (
                            <EmptyState.Root>
                                <EmptyState.Content>
                                    <EmptyState.Indicator>
                                        <LuShoppingCart />
                                    </EmptyState.Indicator>
                                    <VStack textAlign="center">
                                        <EmptyState.Title>
                                            {t('cart.emptyTitle')}
                                        </EmptyState.Title>
                                        <EmptyState.Description>
                                            {t('cart.emptyDescription')}
                                        </EmptyState.Description>
                                    </VStack>
                                    <ButtonGroup>
                                        <Button>
                                            <RouterLink to="/catalog">
                                                {t('cart.continueShopping')}
                                            </RouterLink>
                                        </Button>
                                    </ButtonGroup>
                                </EmptyState.Content>
                            </EmptyState.Root>
                        )}
                    </Stack>
                </Box>

                <Box flex={1} borderRadius="md" border="xs" borderColor="border" p={6} h="max-content">
                    <Heading size="lg" mb={4}>
                        {t('reservation.title')}
                    </Heading>

                    {!isAuthenticated ? (
                        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
                            <Stack gap={4}>
                                <Field.Root id="fullName" invalid={!!errors.fullName}>
                                    <Field.Label>
                                        {t('reservation.fullName')} *
                                    </Field.Label>
                                    <Input
                                        placeholder={t('reservation.fullNamePlaceholder')}
                                        {...register('fullName', { required: t('reservation.fullNameError') })}
                                    />
                                    {errors.fullName && (
                                        <Field.ErrorText>{errors.fullName.message}</Field.ErrorText>
                                    )}
                                </Field.Root>

                                <Field.Root id="email" invalid={!!errors.email}>
                                    <Field.Label>
                                        {t('reservation.email')} *
                                    </Field.Label>
                                    <Input
                                        placeholder={t('reservation.emailPlaceholder')}
                                        type="email"
                                        {...register('email', {
                                            required: t('reservation.emailError'),
                                        })}
                                    />
                                    {errors.email && (
                                        <Field.ErrorText>{errors.email.message}</Field.ErrorText>
                                    )}
                                </Field.Root>

                                <Field.Root id="phone" invalid={!!errors.phone}>
                                    <Field.Label>
                                        {t('reservation.phone')} *
                                    </Field.Label>
                                    <Input
                                        placeholder={t('reservation.phonePlaceholder')}
                                        {...register('phone', { required: t('reservation.phoneError') })}
                                    />
                                    {errors.phone && (
                                        <Field.ErrorText>{errors.phone.message}</Field.ErrorText>
                                    )}
                                </Field.Root>

                                <Field.Root id="address" invalid={!!errors.address}>
                                    <Field.Label>
                                        {t('reservation.address')} *
                                    </Field.Label>
                                    <Input
                                        placeholder={t('reservation.addressPlaceholder')}
                                        {...register('address', { required: t('reservation.addressError') })}
                                    />
                                    {errors.address && (
                                        <Field.ErrorText>{errors.address.message}</Field.ErrorText>
                                    )}
                                </Field.Root>

                                <Field.Root id="notes" invalid={false}>
                                    <Field.Label>
                                        {t('reservation.notes')}
                                    </Field.Label>
                                    <Textarea
                                        placeholder={t('reservation.notesPlaceholder')}
                                        {...register('notes')}
                                    />
                                </Field.Root>

                                <Flex justify="space-between" fontSize="lg" fontWeight="bold">
                                    <Text>
                                        {t('reservation.totalAmount')}
                                    </Text>
                                    <Text>${totalValue.toFixed(2)}</Text>
                                </Flex>

                                <Text fontSize="xs" color="gray.500">
                                    {t('reservation.noPayment')}
                                </Text>

                                <Button
                                    type="submit"
                                    size="lg"
                                    loading={isSubmitting}
                                >
                                    {t('reservation.submit')}
                                </Button>

                                <Text fontSize="xs" color="gray.500" >
                                    {t('reservation.concent')}
                                </Text>
                            </Stack>
                        </Box>
                    ) : (
                        <Stack gap={4}>
                            <Flex justify="space-between" fontSize="xl" fontWeight="bold" mb={4}>
                                <Text>
                                    {t('reservation.totalAmount')}
                                </Text>
                                <Text>${totalValue.toFixed(2)}</Text>
                            </Flex>

                            <Button size="lg" type="submit">
                                {t('reservation.reserve')}
                            </Button>

                            <Text fontSize="xs" color="gray.500">
                                {t('reservation.concent')}
                            </Text>
                        </Stack>
                    )}
                </Box>
            </Flex>
        </Box>
    );
};

export default CartPage;
