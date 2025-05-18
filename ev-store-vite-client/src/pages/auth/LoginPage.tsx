// src/pages/LoginPage.tsx

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
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { PasswordInput } from '@/components/ui/password-input';
import { BsImage } from 'react-icons/bs';
import { useTranslation } from 'react-i18next'

interface LoginFormValues {
    email: string;
    password: string;
}

const LoginPage = () => {
    const { t } = useTranslation('auth');
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({});

    const onSubmit = handleSubmit((data: LoginFormValues) => {
        console.log('Login data:', data);
    });

    return (
        <SimpleGrid columns={{ base: 1 }} minH="100vh">
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                py={{ base: 12, md: 16 }}
                px={{ base: 6, sm: 8, md: 12, lg: 16 }}
            >
                <Container maxW="md" width="full">
                    <Stack gap={8}>
                        <HStack gap={3} align="center" justify="flex-start">
                            <Icon as={BsImage} boxSize={8} />
                            <Heading as="h2" size="md" fontWeight="semibold">
                                Logo
                            </Heading>
                        </HStack>

                        <Stack gap={2}>
                            <Heading as="h1" size="xl" fontWeight="bold">
                                {t('login.title')}
                            </Heading>
                            <Text >
                                {t('login.description')}
                            </Text>
                        </Stack>

                        <Box as="form" onSubmit={onSubmit} width="full">
                            <Stack gap={5}>
                                <Field.Root id="email" invalid={!!errors.email}>
                                    <Field.Label fontWeight="medium" fontSize="sm">
                                        {t('login.email')}
                                    </Field.Label>
                                    <Input
                                        size="lg"
                                        type="email"
                                        placeholder={t('login.emailPlaceholder')}
                                        {...register("email", { required: t('login.emailRequired')})}
                                    />
                                    {errors.email && <Field.ErrorText>{errors.email.message}</Field.ErrorText>}
                                </Field.Root>

                                <Field.Root id="password" invalid={!!errors.password}>
                                    <Field.Label fontWeight="medium" fontSize="sm">
                                        {t('login.password')}
                                    </Field.Label>
                                    <PasswordInput
                                        size="lg"
                                        {...register("password", { required: t('login.passwordRequired') })}
                                    />
                                    {errors.password && <Field.ErrorText>{errors.password.message}</Field.ErrorText>}
                                </Field.Root>

                                <HStack justify="flex-end" mt={-2} mb={3}>
                                    <Link to="/forgot-password">
                                        <Text fontSize="sm" color="blue.500">
                                            {t('login.forgotPassword')}
                                        </Text>
                                    </Link>
                                </HStack>


                                <Button
                                    type="submit"
                                    width="full"
                                    size="lg"
                                >
                                    {t('login.submit')}
                                </Button>
                            </Stack>
                        </Box>

                        <Box textAlign="center" mt={0}>
                            <Text fontSize="sm" >
                                {t('login.noAccount')}
                                {' '}
                                <Link to="/signup">
                                    <Text as="span">
                                        {t('login.signUp')}
                                    </Text>
                                </Link>
                            </Text>
                        </Box>
                    </Stack>
                </Container >
            </Box >
        </SimpleGrid >
    );
};

export default LoginPage;