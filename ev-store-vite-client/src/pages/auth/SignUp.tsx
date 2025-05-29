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
    Flex
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { PasswordInput } from '@/components/ui/password-input';
import { BsImage } from 'react-icons/bs';
import { useTranslation } from 'react-i18next'


interface SignupFormValues {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const SignupPage = () => {
    const { t } = useTranslation('auth');

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
            password: "",
            confirmPassword: "",
        }
    });

    const [step, setStep] = useState<'form' | 'pin'>('form');
    const [verificationPin, setVerificationPin] = useState('');

    const passwordValue = watch("password");

    const onSubmit: SubmitHandler<SignupFormValues> = (data) => {
        console.log('Signup data:', data);
        setStep('pin');
    };

    const onVerify = () => {
        console.log('Entered PIN:', verificationPin);
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
                <Container maxW="md" textAlign="center">
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
                        </PinInput.Control>
                    </PinInput.Root>

                    <Button
                        colorScheme="blue"
                        disabled={verificationPin.length < 4}
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
                                            <Input
                                                size="lg"
                                                type="text"
                                                placeholder={t('signup.firstNamePlaceholder')}
                                                {...register("firstName", { required: t('signup.firstNameRequired') })}
                                            />
                                            {errors.firstName && <Field.ErrorText>{errors.firstName.message}</Field.ErrorText>}
                                        </Field.Root>
                                    </Box>
                                    <Box flex={1}>
                                    <Field.Root id="lastName" invalid={!!errors.lastName}>
                                            <Field.Label fontWeight="medium" fontSize="sm">
                                                {t('signup.lastName')}
                                            </Field.Label>
                                            <Input
                                                size="lg"
                                                type="text"
                                                placeholder={t('signup.lastNamePlaceholder')}
                                                {...register("lastName", { required: t('signup.lastNameRequired') })}
                                            />
                                            {errors.lastName && <Field.ErrorText>{errors.lastName.message}</Field.ErrorText>}
                                        </Field.Root>
                                    </Box>
                                </Flex>



                                <Field.Root id="email" invalid={!!errors.email}>
                                    <Field.Label fontWeight="medium" fontSize="sm">
                                        {t('signup.email')}
                                    </Field.Label>
                                    <Input
                                        size="lg"
                                        type="email"
                                        placeholder={t('signup.emailPlaceholder')}
                                        {...register("email", {
                                            required: t('signup.emailRequired')
                                        })}
                                    />
                                    {errors.email && <Field.ErrorText>{errors.email.message}</Field.ErrorText>}
                                </Field.Root>

                                <Field.Root id="password" invalid={!!errors.password}>
                                    <Field.Label fontWeight="medium" fontSize="sm">
                                        {t('signup.password')}
                                    </Field.Label>
                                    <PasswordInput
                                        size="lg"
                                        {...register("password", {
                                            required: t('signup.passwordRequired'),
                                            minLength: { value: 8, message: t('signup.passwordMinLength') },
                                        })}
                                    />
                                    {errors.password && <Field.ErrorText>{errors.password.message}</Field.ErrorText>}
                                </Field.Root>

                                <Field.Root id="confirmPassword" invalid={!!errors.confirmPassword}>
                                    <Field.Label fontWeight="medium" fontSize="sm">
                                        {t('signup.confirmPassword')}
                                    </Field.Label>
                                    <PasswordInput
                                        size="lg"
                                        {...register("confirmPassword", {
                                            required: t('signup.confirmPasswordRequired'),
                                            validate: value => value === passwordValue || t('signup.passwordsDoNotMatch'),
                                        })}
                                    />
                                    {errors.confirmPassword && <Field.ErrorText>{errors.confirmPassword.message}</Field.ErrorText>}
                                </Field.Root>

                                <Button type="submit" width="full" size="lg">
                                    {step === 'form' ?
                                        t('signup.submitButton') :
                                        t('signup.verifyButton')
                                    }
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
