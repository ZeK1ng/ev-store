import { useState, useEffect, useRef } from 'react';
import AuthController from '@/utils/AuthController';
import API from '@/utils/AxiosAPI';
import { getCart, removeItemFromCart, updateItemQuantity, clearCart } from '@/utils/helpers';
import CachedImage from "@/utils/CachedImage";
import {
    Box,
    Flex,
    Stack,
    Text,
    Heading,
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
    ButtonGroup,
    Spinner,
    Center,
} from '@chakra-ui/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FaTrash } from 'react-icons/fa';
import { LuMinus, LuPlus, LuWifiOff, LuShoppingCart, LuClipboardCheck, LuChevronDown } from 'react-icons/lu';
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from 'react-router-dom'
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedText } from '@/utils/languageUtils';

interface UserDetails {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    city: string;
    address: string;
}

interface CartItem {
    productId: number;
    nameGE: string;
    nameRUS: string;
    nameENG: string;
    descriptionGE: string;
    descriptionRUS: string;
    descriptionENG: string;
    quantity: number;
    price: number;
    mainImageId: number;
}

interface CartResponse {
    cartId: number;
    items: CartItem[];
    cartTotalPrice: number;
}

interface ReservationFormValues {
    name: string;
    email: string;
    mobile: string;
    city: string;
    address: string;
    specialInstructions: string;
}

const CartPage = () => {
    const { t } = useTranslation('cart');
    const { language } = useLanguage();
    const [userData, setUserData] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reservationSuccess, setReservationSuccess] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartTotalPrice, setCartTotalPrice] = useState(0);

    const fetchUserData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await API.get('/user/details');
            setUserData(response.data);
        } catch (err: any) {
            setError(t('profile.loadError'));
        } finally {
            setLoading(false);
        }
    };

    const fetchCartData = async () => {
        setLoading(true);
        setError(null);
        try {
            if (AuthController.isLoggedIn()) {
                const response = await API.get<CartResponse>('cart/cart-for-user');
                setCartItems(response.data.items);
                setCartTotalPrice(response.data.cartTotalPrice);
            } else {
                const localCart = getCart();
                if (localCart.length > 0) {
                    const productIds = localCart.map((item: { productId: number }) => item.productId);
                    const response = await API.post<CartItem[]>('/product/bulk', productIds);
                    const itemsWithQuantity = response.data.map((item) => ({
                        ...item,
                        quantity: localCart.find((cartItem: { productId: number }) => cartItem.productId === item.productId)?.quantity || 1
                    }));
                    setCartItems(itemsWithQuantity);
                    setCartTotalPrice(itemsWithQuantity.reduce((sum, item) => sum + (item.price * item.quantity), 0));
                }
            }
        } catch (err: any) {
            setError(t('cart.loadError'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (AuthController.isLoggedIn()) {
            fetchUserData();
        }
        fetchCartData();
    }, []);

    const reloadPage = () => {
        window.location.reload();
    };

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ReservationFormValues>({
        defaultValues: AuthController.isLoggedIn()
            ? {
                mobile: userData?.mobile,
                city: userData?.city,
                address: userData?.address,
                specialInstructions: '',
            } : {
                name: '',
                email: '',
                mobile: '',
                city: '',
                address: '',
                specialInstructions: '',
            },
        shouldUnregister: true,
    });

    const removeItem = async (productId: number) => {
        try {
            if (AuthController.isLoggedIn()) {
                await API.delete(`/cart/delete?productId=${productId}`);
            } else {
                removeItemFromCart(productId);
            }
            setCartItems((prev) => prev.filter((item) => item.productId !== productId));
            await fetchCartData();
        } catch (err) {
            setError(t('cart.deleteError'));
        }
    };

    const updateQuantity = async (productId: number, newQty: number) => {
        try {
            if (AuthController.isLoggedIn()) {
                await API.put(`/cart/update?productId=${productId}&quantity=${newQty}`);
            } else {
                updateItemQuantity(productId, newQty);
            }
            setCartItems((prev) =>
                prev.map((item) =>
                    item.productId === productId ? { ...item, quantity: newQty } : item
                )
            );
            await fetchCartData();
        } catch (err) {
            setError(t('cart.updateError'));
        }
    };

    useEffect(() => {
        if (!AuthController.isLoggedIn()) {
            const subtotal = cartItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );
            setCartTotalPrice(subtotal);
        }
    }, [cartItems]);

    const onSubmitAuth: SubmitHandler<ReservationFormValues> = async (data) => {
        try {
            setLoading(true);
            setError(null);
            await API.post('/reservation/create', {
                mobile: data.mobile,
                city: data.city,
                address: data.address,
                specialInstructions: data.specialInstructions,
            });
            setReservationSuccess(true);
        } catch (err: any) {
            setError(t('reservation.error'));
        } finally {
            setLoading(false);
        }
    };

    const onSubmitGuest: SubmitHandler<ReservationFormValues> = async (data) => {
        try {
            setLoading(true);
            setError(null);

            const itemsDataToSend = cartItems.map((item) => ({
                quantity: item.quantity,
                productId: item.productId,
                productName: getLocalizedText(item, language, 'name'),
                productPrice: item.price,
            }));
            await API.post('/reservation/create-guest', {
                ...data,
                cartItems: itemsDataToSend,
            });
            clearCart();
            setReservationSuccess(true);
        } catch (err: any) {
            setError(t('reservation.error'));
        } finally {
            setLoading(false);
        }
    };

    const reservationRef = useRef<HTMLDivElement>(null);
    const [showStickyButton, setShowStickyButton] = useState(true);

    useEffect(() => {

        const handleScroll = () => {
            if (reservationRef.current) {
                const rect = reservationRef.current.getBoundingClientRect();
                setShowStickyButton(rect.top > window.innerHeight - 200);
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (loading) {
        return (
            <Center minH="90vh">
                <Spinner size="xl" borderWidth="4px" />
            </Center>
        );
    }

    if (error) {
        return (
            <Center minH="90vh">
                <Stack gap={8} maxW="lg" w="full">
                    <EmptyState.Root>
                        <EmptyState.Content>
                            <EmptyState.Indicator>
                                <LuWifiOff />
                            </EmptyState.Indicator>
                            <VStack textAlign="center">
                                <EmptyState.Title>
                                    {t('emptyTitle')}
                                </EmptyState.Title>
                                <EmptyState.Description>
                                    {t('emptyDescription')}
                                </EmptyState.Description>
                            </VStack>
                            <ButtonGroup>
                                <Button onClick={reloadPage}>{t('tryAgain')}</Button>
                            </ButtonGroup>
                        </EmptyState.Content>
                    </EmptyState.Root>
                </Stack>
            </Center>
        );
    }

    if (reservationSuccess) {
        return (
            <Center minH="90vh">
                <VStack gap={6}>
                    <LuClipboardCheck color="#9CE94F" size="60px" />
                    <Heading size="lg">{t('reservation.successTitle')}</Heading>
                    <Text fontSize="lg" color="gray.600">{t('reservation.successDescription')}</Text>
                    <ButtonGroup gap={4}>
                        <RouterLink to="/catalog">
                            <Button size="lg" bg="#9CE94F" color="gray.950" w="100%">
                                {t('reservation.goToShopping')}
                            </Button>
                        </RouterLink>
                        {AuthController.isLoggedIn() && (
                            <RouterLink to="/order-history">
                                <Button size="lg" variant="outline" colorScheme="green" w="100%">
                                    {t('reservation.goToOrderHistory')}
                                </Button>
                            </RouterLink>
                        )}
                    </ButtonGroup>
                </VStack>
            </Center>
        );
    }


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
                <Box flex={2} borderRadius="md" border="xs" borderColor="border.emphasized" p={6} h="max-content">
                    <Heading size="lg" mb={4}>
                        {t('cart.title')}
                    </Heading>

                    <Stack gap={4}>
                        {cartItems.length > 0 && cartItems.map((item, index) => (
                            <RouterLink
                                to={`/product/${item.productId}`}
                                key={index}
                                style={{
                                    display: 'block',
                                    textDecoration: 'none'
                                }}
                            >

                                <Flex
                                    align="flex-start"
                                    justify="space-between"
                                    flexDirection={{ base: 'column', md: 'row' }}
                                    p={{ base: 2, md: 4 }}
                                    bg="bg.muted" borderRadius="lg"
                                    gap={4}
                                    _hover={{ shadow: 'lg', transition: 'all 0.2s' }}
                                    cursor="pointer"
                                >
                                    <HStack gap={4} align="center">

                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            gap="1rem"
                                            p={2}
                                            borderRadius="md"
                                            cursor="pointer"
                                        >
                                            <CachedImage
                                                imageId={item.mainImageId}
                                                alt={getLocalizedText(item, language, 'name')}
                                                width="80px"
                                                height="80px"
                                                objectFit="cover"
                                                borderRadius="md"
                                            />
                                            <Box>
                                                <Text fontWeight="bold">{getLocalizedText(item, language, 'name')}</Text>
                                                <HStack>
                                                    <Text fontSize="sm" color="gray.500" lineClamp={3}>{getLocalizedText(item, language, 'description')}</Text>
                                                </HStack>
                                            </Box>
                                        </Box>
                                    </HStack>

                                    <HStack gap={4} alignSelf={{ base: 'end', md: 'center' }}>
                                        <Field.Root id={`quantity-${item.productId}`} invalid={false}>
                                            <NumberInput.Root 
                                                defaultValue={String(item.quantity)} 
                                                unstyled 
                                                spinOnPress={false}
                                                min={1} 
                                                max={50} 
                                                step={1}
                                                onValueChange={(e) => {
                                                    const val = parseInt(e.value);
                                                    if (!isNaN(val) && val >= 1) {
                                                        updateQuantity(item.productId, val);
                                                    }
                                                }}
                                            >
                                                <HStack gap="2">
                                                    <NumberInput.DecrementTrigger asChild>
                                                        <IconButton 
                                                            variant="outline" 
                                                            size="sm" 
                                                            _hover={{ bg: 'gray.500', color: 'white' }}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                            }}
                                                        >
                                                            <LuMinus />
                                                        </IconButton>
                                                    </NumberInput.DecrementTrigger>
                                                    <NumberInput.ValueText 
                                                        textAlign="center" 
                                                        fontSize="lg" 
                                                        minW="3ch"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                        }}
                                                    />
                                                    <NumberInput.IncrementTrigger asChild>
                                                        <IconButton 
                                                            variant="outline" 
                                                            size="sm" 
                                                            _hover={{ bg: 'gray.500', color: 'white' }}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                            }}
                                                        >
                                                            <LuPlus />
                                                        </IconButton>
                                                    </NumberInput.IncrementTrigger>
                                                </HStack>
                                            </NumberInput.Root>
                                        </Field.Root>

                                        <Text fontWeight="bold">{(item.price * item.quantity).toFixed(2)}</Text>

                                        <IconButton
                                            aria-label="Remove item"
                                            size="sm"
                                            colorScheme="red"
                                            variant="outline"
                                            _hover={{ bg: 'red.500', color: 'white' }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                removeItem(item.productId);
                                            }}
                                        >
                                            <FaTrash />
                                        </IconButton>
                                    </HStack>
                                </Flex>
                            </RouterLink>
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
                                        <Button asChild>
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

                <Box
                    ref={reservationRef}
                    flex={1}
                    borderRadius="md"
                    border="xs"
                    borderColor="border.emphasized"
                    p={6}
                    h="max-content"
                >
                    <Heading size="lg" mb={4}>
                        {t('reservation.title')}
                    </Heading>

                    <Box as="form" onSubmit={handleSubmit(AuthController.isLoggedIn() ? onSubmitAuth : onSubmitGuest)}>
                        <Stack gap={4}>
                            {!AuthController.isLoggedIn() && (
                                <>
                                    <Field.Root id="name" invalid={!!errors.name}>
                                        <Field.Label>
                                            {t('reservation.name')} *
                                        </Field.Label>
                                        <Input
                                            placeholder={t('reservation.namePlaceholder')}
                                            {...register('name', { required: t('reservation.nameError') })}
                                        />
                                        {errors.name && (
                                            <Field.ErrorText>{errors.name.message}</Field.ErrorText>
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
                                </>
                            )}

                            <Field.Root id="mobile" invalid={!!errors.mobile}>
                                <Field.Label>
                                    {t('reservation.mobile')} *
                                </Field.Label>
                                <Input
                                    defaultValue={userData?.mobile || ''}
                                    placeholder={t('reservation.mobilePlaceholder')}
                                    {...register('mobile', { required: t('reservation.mobileError') })}
                                />
                                {errors.mobile && (
                                    <Field.ErrorText>{errors.mobile.message}</Field.ErrorText>
                                )}
                            </Field.Root>

                            <Field.Root id="city" invalid={!!errors.city}>
                                <Field.Label>
                                    {t('reservation.city')} *
                                </Field.Label>
                                <Input
                                    defaultValue={userData?.city || ''}
                                    placeholder={t('reservation.cityPlaceholder')}
                                    {...register('city', { required: t('reservation.cityError') })}
                                />
                                {errors.city && (
                                    <Field.ErrorText>{errors.city.message}</Field.ErrorText>
                                )}
                            </Field.Root>

                            <Field.Root id="address" invalid={!!errors.address}>
                                <Field.Label>
                                    {t('reservation.address')} *
                                </Field.Label>
                                <Input
                                    defaultValue={userData?.address || ''}
                                    placeholder={t('reservation.addressPlaceholder')}
                                    {...register('address', { required: t('reservation.addressError') })}
                                />
                                {errors.address && (
                                    <Field.ErrorText>{errors.address.message}</Field.ErrorText>
                                )}
                            </Field.Root>

                            <Field.Root id="specialInstructions" invalid={false}>
                                <Field.Label>
                                    {t('reservation.specialRequests')}
                                </Field.Label>
                                <Textarea
                                    placeholder={t('reservation.specialRequestsPlaceholder')}
                                    {...register('specialInstructions')}
                                />
                            </Field.Root>

                            <Flex justify="space-between" fontSize="lg" fontWeight="bold">
                                <Text>
                                    {t('reservation.totalAmount')}
                                </Text>
                                <Text>${cartTotalPrice.toFixed(2)}</Text>
                            </Flex>

                            <Text fontSize="xs" color="gray.500">
                                {t('reservation.noPayment')}
                            </Text>

                            <Button
                                type="submit"
                                size="lg"
                                bg="#9CE94F"
                                color="gray.950"
                                loading={isSubmitting}
                                disabled={cartItems.length === 0}
                            >
                                {t('reservation.submit')}
                            </Button>

                            <Text fontSize="xs" color="gray.500" >
                                {t('reservation.concent')}
                            </Text>
                        </Stack>
                    </Box>
                </Box>
            </Flex>
            {showStickyButton && (
                <Box
                    position="fixed"
                    bottom="0"
                    left="0"
                    width="100vw"
                    zIndex="sticky"
                    display={{ base: 'block', lg: 'none' }}
                    bg="bg.muted"
                    shadow="xl"
                    p={3}
                    textAlign="center"
                >
                    <Button
                        size="xl"
                        bg="#9CE94F"
                        color="gray.950"
                        width="90%"
                        onClick={() => {
                            if (reservationRef.current) {
                                window.scrollTo({
                                    top: reservationRef.current.offsetTop - 100,
                                    behavior: 'smooth'
                                });
                            }
                        }}
                    >
                        <LuChevronDown /> {t('reservation.goToReservation')}
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default CartPage;
