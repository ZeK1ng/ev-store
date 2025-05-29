import { useState } from 'react';
import {
    Box,
    Button,
    Container,
    Heading,
    HStack,
    Input,
    SimpleGrid,
    Stack,
    Text,
    Icon,
    Field,
    PinInput,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { BsImage } from 'react-icons/bs';
import { useTranslation } from 'react-i18next'

interface ForgotPasswordFormValues {
    email: string;
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

    const [step, setStep] = useState<'form' | 'pin'>('form');
    const [verificationPin, setVerificationPin] = useState('');

    const onSubmit: SubmitHandler<ForgotPasswordFormValues> = (data) => {
        console.log('Forgot password request:', data);
        // TODO: send reset link & trigger PIN step
        setStep('pin');
    };

    const onVerify = () => {
        console.log('Entered PIN for reset:', verificationPin);
        // TODO: verify PIN and redirect to reset-password form
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
                <Container textAlign="center" maxW="lg" width="full" bg="whiteAlpha.50" borderRadius="lg" shadow="md" py={{ base: 6, md: 8 }}>
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

    return (
        <SimpleGrid columns={{ base: 1 }} minH="100vh">
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                py={{ base: 12, md: 16 }}
                px={{ base: 6, sm: 8, md: 12, lg: 16 }}
            >
                <Container maxW="lg" width="full" bg="whiteAlpha.50" borderRadius="lg" shadow="md" py={{ base: 6, md: 8 }}>
                    <Stack gap={8}>
                        <HStack gap={3} align="center">
                            <Icon as={BsImage} boxSize={8} />
                            <Heading as="h2" size="md" fontWeight="semibold">
                                Logo
                            </Heading>
                        </HStack>

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
                                    <Input
                                        size="lg"
                                        type="email"
                                        placeholder={t('forgotPassword.emailPlaceholder')}
                                        {...register("email", {
                                            required: t('forgotPassword.emailRequired')
                                        })}
                                    />
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
