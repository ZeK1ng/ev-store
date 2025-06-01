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
} from '@chakra-ui/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FaTrash } from 'react-icons/fa';
import { LuMinus, LuPlus } from 'react-icons/lu';

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
                <Heading size="xl">Reservation Cart</Heading>
                <Badge px={2} ml={4} variant="solid">
                    {cartItems.length} item{cartItems.length !== 1 && 's'}
                </Badge>
            </Flex>

            <Flex direction={{ base: 'column', lg: 'row' }} gap={8}>
                <Box flex={2} borderRadius="md" border="xs" borderColor="border" p={6} h="max-content">
                    <Heading size="lg" mb={4}>
                        Items to Reserve
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

                                <HStack gap={4} alignSelf={{base: 'end', md: 'center'}}>
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
                                        color="red.500"
                                        onClick={() => removeItem(item.id)}
                                    >
                                        <FaTrash />
                                    </IconButton>
                                </HStack>
                            </Flex>
                        ))}

                        {cartItems.length === 0 && (
                            <Text textAlign="center" color="gray.500">
                                Your cart is empty.
                            </Text>
                        )}
                    </Stack>
                </Box>

                <Box flex={1} borderRadius="md" border="xs" borderColor="border" p={6} h="max-content">
                    <Heading size="lg" mb={4}>
                        Reservation Details
                    </Heading>

                    {!isAuthenticated ? (
                        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
                            <Stack gap={4}>
                                <Field.Root id="fullName" invalid={!!errors.fullName}>
                                    <Field.Label>Full Name *</Field.Label>
                                    <Input
                                        placeholder="John Doe"
                                        {...register('fullName', { required: 'Full name is required' })}
                                    />
                                    {errors.fullName && (
                                        <Field.ErrorText>{errors.fullName.message}</Field.ErrorText>
                                    )}
                                </Field.Root>

                                <Field.Root id="email" invalid={!!errors.email}>
                                    <Field.Label>Email Address *</Field.Label>
                                    <Input
                                        placeholder="you@example.com"
                                        type="email"
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Invalid email address',
                                            },
                                        })}
                                    />
                                    {errors.email && (
                                        <Field.ErrorText>{errors.email.message}</Field.ErrorText>
                                    )}
                                </Field.Root>

                                <Field.Root id="phone" invalid={!!errors.phone}>
                                    <Field.Label>Phone Number *</Field.Label>
                                    <Input
                                        placeholder="+1 (555) 123-4567"
                                        {...register('phone', { required: 'Phone number is required' })}
                                    />
                                    {errors.phone && (
                                        <Field.ErrorText>{errors.phone.message}</Field.ErrorText>
                                    )}
                                </Field.Root>

                                <Field.Root id="address" invalid={!!errors.address}>
                                    <Field.Label>Address *</Field.Label>
                                    <Input
                                        placeholder="123 Main Street, City, Country"
                                        {...register('address', { required: 'Address is required' })}
                                    />
                                    {errors.address && (
                                        <Field.ErrorText>{errors.address.message}</Field.ErrorText>
                                    )}
                                </Field.Root>

                                <Field.Root id="notes" invalid={false}>
                                    <Field.Label>Special Notes</Field.Label>
                                    <Textarea
                                        placeholder="Any special requirements or preferred pickup/delivery time..."
                                        {...register('notes')}
                                    />
                                </Field.Root>

                                <Flex justify="space-between" fontSize="sm" mt={6}>
                                    <Text>
                                        Subtotal ({cartItems.length} item
                                        {cartItems.length !== 1 && 's'})
                                    </Text>
                                    <Text fontWeight="bold">${subtotal.toFixed(2)}</Text>
                                </Flex>

                                <Flex justify="space-between" fontSize="lg" fontWeight="bold">
                                    <Text>Total Value</Text>
                                    <Text>${totalValue.toFixed(2)}</Text>
                                </Flex>

                                <Text fontSize="xs" color="gray.500">
                                    * This is a reservation only. No payment required now.
                                </Text>

                                <Button
                                    type="submit"
                                    size="lg"
                                    loading={isSubmitting}
                                >
                                    Reserve Items
                                </Button>

                                <Text fontSize="xs" color="gray.500" textAlign="center">
                                    By reserving, you agree to our terms. We'll contact you within 24 hours.
                                </Text>
                            </Stack>
                        </Box>
                    ) : (
                        <Stack gap={4}>
                            <Flex justify="space-between" fontSize="lg">
                                <Text>
                                    Subtotal ({cartItems.length} item{cartItems.length !== 1 && 's'})
                                </Text>
                                <Text fontWeight="bold">${subtotal.toFixed(2)}</Text>
                            </Flex>

                            <Flex justify="space-between" fontSize="xl" fontWeight="bold" mb={4}>
                                <Text>Total Value</Text>
                                <Text>${totalValue.toFixed(2)}</Text>
                            </Flex>

                            <Button size="lg" type="submit">
                                Reserve Items
                            </Button>

                            <Text fontSize="xs" color="gray.500" textAlign="center">
                                * This is a reservation only. No payment required now.
                            </Text>
                        </Stack>
                    )}
                </Box>
            </Flex>
        </Box>
    );
};

export default CartPage;
