import { useState } from 'react';
import API from '@/utils/AxiosAPI';
import AuthController from '@/utils/AuthController';

import {
    Box,
    Button,
    Container,
    Heading,
    HStack,
    Input,
    InputGroup,
    SimpleGrid,
    Stack,
    Text,
    Field,
    Alert
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { PasswordInput } from '@/components/ui/password-input';
import { LuMail, LuKeyRound } from "react-icons/lu"
import { useTranslation } from 'react-i18next'

interface LoginFormValues {
    email: string;
    password: string;
}

const LoginPage = () => {
    const { t } = useTranslation('auth');
    const navigate = useNavigate();

    if (AuthController.isLoggedIn()) {
        navigate('/');
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({});

    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const onSubmit = handleSubmit(async (data: LoginFormValues) => {
        setIsLoading(true);
        setApiError(null);
        try {
            const response = await API.post('/auth/login', {
                username: data.email,
                password: data.password,
            });

            if (!response.data || !response.data.accessToken || !response.data.refreshToken) {
                setApiError(t('login.errors.somethingWentWrong'));
                return;
            }
           
            AuthController.login({
                accessToken: response.data.accessToken,
                refreshToken: response.data.refreshToken,
            });
            
            navigate('/');
        } catch (err: any) {
            setApiError(t('login.errors.loginFailed'));
        } finally {
            setIsLoading(false);
        }
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
                <Container maxW="lg" width="full" bg="whiteAlpha.50" borderRadius="lg" shadow="2xl" py={{ base: 6, md: 8 }}>
                    <Stack gap={8}>

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
                                    <InputGroup startElement={<LuMail />}>
                                        <Input
                                            size="lg"
                                            type="email"
                                            placeholder={t('login.emailPlaceholder')}
                                            {...register("email", { required: t('login.emailRequired') })}
                                        />
                                    </InputGroup>
                                    {errors.email && <Field.ErrorText>{errors.email.message}</Field.ErrorText>}
                                </Field.Root>

                                <Field.Root id="password" invalid={!!errors.password}>
                                    <Field.Label fontWeight="medium" fontSize="sm">
                                        {t('login.password')}
                                    </Field.Label>
                                    <InputGroup startElement={<LuKeyRound />}>
                                        <PasswordInput
                                            placeholder={t('login.passwordPlaceholder')}
                                            size="lg"
                                            {...register("password", { required: t('login.passwordRequired') })}
                                        />
                                    </InputGroup>
                                    {errors.password && <Field.ErrorText>{errors.password.message}</Field.ErrorText>}
                                </Field.Root>

                                <HStack justify="flex-end" mt={-2}>
                                    <Link to="/forgot-password">
                                        <Text fontSize="sm" color="blue.500" textDecoration="underline">
                                            {t('login.forgotPassword')}
                                        </Text>
                                    </Link>
                                </HStack>

                                {apiError && <Alert.Root status="error">
                                    <Alert.Indicator />
                                    <Alert.Title>{apiError}</Alert.Title>
                                </Alert.Root>}
                                <Button
                                    type="submit"
                                    width="full"
                                    size="lg"
                                    loading={isLoading}
                                >
                                    {t('login.submit')}
                                </Button>
                            </Stack>
                        </Box>

                        <Box textAlign="center" mt={0}>
                            <Text fontSize="sm" >
                                {t('login.noAccount')}
                                {' '}
                                <Link to="/signup" >
                                    <Text as="span" textDecoration="underline">
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