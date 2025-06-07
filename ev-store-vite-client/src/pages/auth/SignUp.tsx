import { useState, } from 'react';
import API from '@/utils/AxiosAPI';
import AuthController from '@/utils/AuthController';
import {
    Box,
    Button,
    Container,
    Heading,
    InputGroup,
    Input,
    SimpleGrid,
    Stack,
    Text,
    Field,
    PinInput,
    Flex,
    Alert,
    Accordion,
    Span,
    HStack,
    Separator
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { PasswordInput } from '@/components/ui/password-input';
import { LuUser, LuMail, LuPhone, LuKeyRound, LuMapPin } from "react-icons/lu"
import { useTranslation } from 'react-i18next'


interface SignupFormValues {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    address?: string;
    city?: string;
}

const SignupPage = () => {
    const { t } = useTranslation('auth');
    const navigate = useNavigate();

    if (AuthController.isLoggedIn()) {
        navigate('/');
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<SignupFormValues>({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
            address: "",
            city: "",
        }
    });

    const [step, setStep] = useState<'form' | 'pin'>('form');
    const [verificationPin, setVerificationPin] = useState('');

    const passwordValue = watch("password");

    const [formValues, setFormValues] = useState<SignupFormValues | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const onSubmit: SubmitHandler<SignupFormValues> = async (data) => {
        setFormValues(data);
        setIsLoading(true);

        try {
            await API.post('/auth/register', {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                mobile: data.phone,
                address: data.address,
                city: data.city,
                password: data.password,
            });
        } catch (err: any) {
            setApiError(t('signup.errors.sendOTPFailed'));
            return;
        } finally {
            setIsLoading(false);
        }

        setApiError(null);
        setStep('pin');
    };

    const onVerify = async () => {
        if (!formValues) return;
        setIsLoading(true);
        setApiError(null);
        try {
            const res = await API.post('/auth/verify', {
                email: formValues.email,
                verificationCode: verificationPin,
            });

            if (!res.data || !res.data.accessToken || !res.data.refreshToken) {
                setApiError(t('signup.errors.somethingWentWrong'));
                return;
            }

            AuthController.login({
                accessToken: res.data.accessToken,
                refreshToken: res.data.refreshToken,
            });

            navigate('/');
        } catch (err: any) {
            setApiError(t('signup.errors.verificationFailed'));
            return;
        } finally {
            setIsLoading(false);
        }
    };

    if (step === 'pin') {
        return (
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                minH="100vh"
                px={{ base: 6, sm: 8, md: 12, lg: 16 }}
            >
                <Container textAlign="center" maxW="lg" width="full" bg="whiteAlpha.50" borderRadius="lg" shadow="2xl" py={{ base: 6, md: 8 }}>
                    <Heading mb={4}>
                        {t('signup.verify.title')}
                    </Heading>
                    <Text mb={2}>
                        {t('signup.verify.description')}
                    </Text>

                    <PinInput.Root mb={4} size="lg"
                        otp onValueComplete={(details) => setVerificationPin(details.valueAsString)}>
                        <PinInput.HiddenInput />
                        <PinInput.Control>
                            <PinInput.Input index={0} />
                            <PinInput.Input index={1} />
                            <PinInput.Input index={2} />
                            <PinInput.Input index={3} />
                            <PinInput.Input index={4} />
                            <PinInput.Input index={5} />
                        </PinInput.Control>
                    </PinInput.Root>

                    {apiError && <Alert.Root status="error" mb={4}>
                        <Alert.Indicator />
                        <Alert.Title>{apiError}</Alert.Title>
                    </Alert.Root>}
                    <Button
                        colorScheme="blue"
                        disabled={verificationPin.length < 6 || isLoading}
                        loading={isLoading}
                        onClick={onVerify}
                    >
                        {t('signup.verify.verifyButton')}
                    </Button>
                </Container>
            </Box >
        );
    }

    return (
        <SimpleGrid columns={{ base: 1 }} minH="100vh">
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                py={{ base: 12, md: 16 }}
                px={{ base: 6, sm: 8, md: 12, lg: 16 }}
            >
                <Container maxW="lg" width="full" bg="whiteAlpha.50" borderRadius="lg" shadow="2xl" py={{ base: 6, md: 8 }}>
                    <Stack gap={8}>
                        <Stack gap={2}>
                            <Heading as="h1" size="xl" fontWeight="bold">
                                {t('signup.title')}
                            </Heading>
                            <Text>
                                {t('signup.description')}
                            </Text>
                        </Stack>

                        <Box as="form" onSubmit={handleSubmit(onSubmit)} width="full">
                            <Stack gap={5}>
                                <Flex gap={4}>
                                    <Box flex={1}>
                                        <Field.Root id="firstName" invalid={!!errors.firstName}>
                                            <Field.Label fontWeight="medium" fontSize="sm">
                                                {t('signup.firstName')}
                                            </Field.Label>
                                            <InputGroup startElement={<LuUser />}>
                                                <Input
                                                    size="lg"
                                                    type="text"
                                                    placeholder={t('signup.firstNamePlaceholder')}
                                                    {...register("firstName", { required: t('signup.firstNameRequired') })}
                                                />
                                            </InputGroup>
                                            {errors.firstName && <Field.ErrorText>{errors.firstName.message}</Field.ErrorText>}
                                        </Field.Root>
                                    </Box>
                                    <Box flex={1}>
                                        <Field.Root id="lastName" invalid={!!errors.lastName}>
                                            <Field.Label fontWeight="medium" fontSize="sm">
                                                {t('signup.lastName')}
                                            </Field.Label>
                                            <InputGroup startElement={<LuUser />}>
                                                <Input
                                                    size="lg"
                                                    type="text"
                                                    placeholder={t('signup.lastNamePlaceholder')}
                                                    {...register("lastName", { required: t('signup.lastNameRequired') })}
                                                />
                                            </InputGroup>
                                            {errors.lastName && <Field.ErrorText>{errors.lastName.message}</Field.ErrorText>}
                                        </Field.Root>
                                    </Box>
                                </Flex>


                                <Field.Root id="email" invalid={!!errors.email}>
                                    <Field.Label fontWeight="medium" fontSize="sm">
                                        {t('signup.email')}
                                    </Field.Label>
                                    <InputGroup startElement={<LuMail />}>
                                        <Input
                                            size="lg"
                                            type="email"
                                            placeholder={t('signup.emailPlaceholder')}
                                            {...register("email", {
                                                required: t('signup.emailRequired')
                                            })}
                                        />
                                    </InputGroup>
                                    {errors.email && <Field.ErrorText>{errors.email.message}</Field.ErrorText>}
                                </Field.Root>

                                <Field.Root id="phone" invalid={!!errors.phone}>
                                    <Field.Label fontWeight="medium" fontSize="sm">
                                        {t('signup.phone')}
                                    </Field.Label>
                                    <InputGroup startElement={<LuPhone />}>
                                        <Input
                                            size="lg"
                                            type="tel"
                                            placeholder={t('signup.phonePlaceholder')}
                                            {...register("phone", {
                                                required: t('signup.phoneRequired')
                                            })}
                                        />
                                    </InputGroup>
                                    {errors.phone && <Field.ErrorText>{errors.phone.message}</Field.ErrorText>}
                                </Field.Root>

                                <Accordion.Root size="md" collapsible>
                                    <Accordion.Item value="profile">
                                        <Accordion.ItemTrigger>
                                            <Span flex="1">
                                                <HStack align="center" gap={2}>
                                                    <LuMapPin />
                                                    {t('signup.address.title')}
                                                </HStack>
                                            </Span>
                                            <Accordion.ItemIndicator />
                                        </Accordion.ItemTrigger>
                                        <Accordion.ItemContent>
                                            <Accordion.ItemBody>
                                                <Separator />
                                                <Stack gap={2} p={2}>
                                                    <Text fontSize="sm" color="fg.muted">
                                                        {t('signup.address.description')}
                                                    </Text>
                                                    <Field.Root id="city" invalid={false}>
                                                        <Field.Label fontWeight="medium" fontSize="sm">
                                                            {t('signup.address.city')}
                                                        </Field.Label>
                                                        <InputGroup >
                                                            <Input
                                                                size="lg"
                                                                type="text"
                                                                placeholder={t('signup.address.cityPlaceholder')}
                                                                {...register("city")}
                                                            />
                                                        </InputGroup>
                                                    </Field.Root>

                                                    <Field.Root id="address" invalid={false}>
                                                        <Field.Label fontWeight="medium" fontSize="sm">
                                                            {t('signup.address.address')}
                                                        </Field.Label>
                                                        <InputGroup>
                                                            <Input
                                                                size="lg"
                                                                type="text"
                                                                placeholder={t('signup.address.addressPlaceholder')}
                                                                {...register("address")}
                                                            />
                                                        </InputGroup>
                                                    </Field.Root>
                                                </Stack>
                                            </Accordion.ItemBody>
                                        </Accordion.ItemContent>
                                    </Accordion.Item>
                                </Accordion.Root>

                                <Field.Root id="password" invalid={!!errors.password}>
                                    <Field.Label fontWeight="medium" fontSize="sm">
                                        {t('signup.password')}
                                    </Field.Label>
                                    <InputGroup startElement={<LuKeyRound />}>
                                        <PasswordInput
                                            size="lg"
                                            placeholder={t('signup.passwordPlaceholder')}
                                            {...register("password", {
                                                required: t('signup.passwordRequired'),
                                                minLength: { value: 8, message: t('signup.passwordMinLength') },
                                            })}
                                        />
                                    </InputGroup>
                                    {errors.password && <Field.ErrorText>{errors.password.message}</Field.ErrorText>}
                                </Field.Root>

                                <Field.Root id="confirmPassword" invalid={!!errors.confirmPassword}>
                                    <Field.Label fontWeight="medium" fontSize="sm">
                                        {t('signup.confirmPassword')}
                                    </Field.Label>
                                    <InputGroup startElement={<LuKeyRound />}>
                                        <PasswordInput
                                            placeholder={t('signup.confirmPasswordPlaceholder')}
                                            size="lg"
                                            {...register("confirmPassword", {
                                                required: t('signup.confirmPasswordRequired'),
                                                validate: value => value === passwordValue || t('signup.passwordsDoNotMatch'),
                                            })}
                                        />
                                    </InputGroup>
                                    {errors.confirmPassword && <Field.ErrorText>{errors.confirmPassword.message}</Field.ErrorText>}
                                </Field.Root>

                                {apiError && <Alert.Root status="error">
                                    <Alert.Indicator />
                                    <Alert.Title>{apiError}</Alert.Title>
                                </Alert.Root>}
                                <Button type="submit" width="full" size="lg" loading={isLoading}>
                                    {t('signup.submitButton')}
                                </Button>

                                <Box textAlign="center">
                                    <Text fontSize="sm">
                                        {t('signup.alreadyHaveAccount')}
                                        {' '}
                                        <Link to="/login">
                                            <Text as="span" textDecoration="underline">
                                                {t('signup.loginLink')}
                                            </Text>
                                        </Link>
                                    </Text>
                                </Box>
                            </Stack>
                        </Box>
                    </Stack>
                </Container>
            </Box>
        </SimpleGrid>
    );
};

export default SignupPage;