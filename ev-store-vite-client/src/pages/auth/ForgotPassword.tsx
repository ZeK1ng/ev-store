
import { useState } from 'react';
import {
    Box,
    Button,
    Container,
    Heading,
    Input,
    InputGroup,
    SimpleGrid,
    Stack,
    Text,
    Field,
    PinInput,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { LuMail, LuKeyRound } from "react-icons/lu"
import { useForm, SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next'
import { PasswordInput } from '@/components/ui/password-input';


interface ForgotPasswordFormValues {
    email: string;
}

interface SetNewPasswordFormValues {
    newPassword: string;
    confirmPassword: string;
}

const ForgotPasswordPage = () => {
    const { t } = useTranslation('auth');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormValues>({
        defaultValues: { email: "" }
    });

    const {
        register: registerNewPassword,
        handleSubmit: handleSubmitNewPassword,
        formState: { errors: errorsNewPassword },
        watch
    } = useForm<SetNewPasswordFormValues>({
        defaultValues: {
            newPassword: '',
            confirmPassword: '',
        }
    });

    const [step, setStep] = useState<'form' | 'pin' | 'new-password'>('form');
    const [verificationPin, setVerificationPin] = useState('');
    const passwordValue = watch("newPassword");

    const onSubmit: SubmitHandler<ForgotPasswordFormValues> = (data) => {
        console.log('Forgot password request:', data);
        // TODO: send reset link & trigger PIN step
        setStep('pin');
    };

    const onVerify = () => {
        console.log('Entered PIN for reset:', verificationPin);
        // TODO: verify PIN and redirect to reset-password form
        setStep('new-password');
    };

    const onNewPwdSubmit: SubmitHandler<SetNewPasswordFormValues> = (data) => {
        console.log('New password submitted:', data);
    }

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
                        {t('forgotPassword.verifyPin.title')}
                    </Heading>
                    <Text mb={6}>
                        {t('forgotPassword.verifyPin.description')}
                    </Text>

                    <PinInput.Root mb={4} size="lg"
                        otp onValueComplete={(details) => setVerificationPin(details.valueAsString)}>
                        <PinInput.HiddenInput />
                        <PinInput.Control>
                            <PinInput.Input index={0} />
                            <PinInput.Input index={1} />
                            <PinInput.Input index={2} />
                            <PinInput.Input index={3} />
                        </PinInput.Control>
                    </PinInput.Root>

                    <Button
                        colorScheme="blue"
                        disabled={verificationPin.length < 4}
                        onClick={onVerify}
                    >
                        {t('forgotPassword.verifyPin.verifyButton')}
                    </Button>
                </Container>
            </Box>
        );
    }

    if (step === 'new-password') {
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
                        {t('forgotPassword.newPassword.title')}
                    </Heading>
                    <Text mb={6}>
                        {t('forgotPassword.newPassword.description')}
                    </Text>

                    <Box as="form" width="full" onSubmit={handleSubmitNewPassword(onNewPwdSubmit)}>
                        <Stack gap={5}>
                            <Field.Root id="new-password" invalid={!!errorsNewPassword.newPassword}>
                                <Field.Label fontWeight="medium" fontSize="sm">
                                    {t('forgotPassword.newPassword.label')}
                                </Field.Label>
                                <InputGroup startElement={<LuKeyRound />}>
                                    <PasswordInput
                                        size="lg"
                                        type="password"
                                        placeholder={t('forgotPassword.newPassword.placeholder')}
                                        {...registerNewPassword("newPassword", {
                                            required: t('forgotPassword.newPassword.required')
                                        })}
                                    />
                                </InputGroup>
                                {errorsNewPassword.newPassword && <Field.ErrorText>{errorsNewPassword.newPassword.message}</Field.ErrorText>}
                            </Field.Root>

                            <Field.Root id="confirm-password" invalid={!!errorsNewPassword.confirmPassword}>
                                <Field.Label fontWeight="medium" fontSize="sm">
                                    {t('forgotPassword.newPassword.confirmLabel')}
                                </Field.Label>
                                <InputGroup startElement={<LuKeyRound />}>
                                    <PasswordInput
                                        size="lg"
                                        type="password"
                                        placeholder={t('forgotPassword.newPassword.confirmPlaceholder')}
                                        {...registerNewPassword("confirmPassword", {
                                            required: t('forgotPassword.newPassword.confirmRequired'),
                                            validate: (value) => value === passwordValue || t('signup.passwordsDoNotMatch'),
                                        })}
                                    />
                                </InputGroup>
                                {errorsNewPassword.confirmPassword && <Field.ErrorText>{errorsNewPassword.confirmPassword.message}</Field.ErrorText>}
                            </Field.Root>

                            <Button
                                type="submit"
                                colorScheme="blue"
                                width="full"
                                size="lg"
                            >
                                {t('forgotPassword.newPassword.submitButton')}
                            </Button>
                        </Stack>
                    </Box>
                </Container>
            </Box>
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
                                {t('forgotPassword.title')}
                            </Heading>
                            <Text>
                                {t('forgotPassword.description')}
                            </Text>
                        </Stack>

                        <Box as="form" onSubmit={handleSubmit(onSubmit)} width="full">
                            <Stack gap={5}>
                                <Field.Root id="email" invalid={!!errors.email}>
                                    <Field.Label fontWeight="medium" fontSize="sm">
                                        {t('forgotPassword.email')}
                                    </Field.Label>
                                    <InputGroup startElement={<LuMail />}>
                                        <Input
                                            size="lg"
                                            type="email"
                                            placeholder={t('forgotPassword.emailPlaceholder')}
                                            {...register("email", {
                                                required: t('forgotPassword.emailRequired')
                                            })}
                                        />
                                    </InputGroup>
                                    {errors.email && <Field.ErrorText>{errors.email.message}</Field.ErrorText>}
                                </Field.Root>

                                <Button
                                    type="submit"
                                    colorScheme="blue"
                                    width="full"
                                    size="lg"
                                    mt={3}
                                >
                                    {t('forgotPassword.submitButton')}
                                </Button>

                                <Box textAlign="center">
                                    <Text fontSize="sm">
                                        {t('forgotPassword.rememberPassword')}
                                        {' '}
                                        <Link to="/login">
                                            <Text as="span" textDecoration="underline">
                                                {t('forgotPassword.loginLink')}
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

export default ForgotPasswordPage;
