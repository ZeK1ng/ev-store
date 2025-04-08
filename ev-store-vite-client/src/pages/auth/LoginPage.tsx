// src/pages/LoginPage.tsx

import React from 'react';
import {
    Box,
    Button,
    Container,
    Heading,
    HStack,
    Input,
    Link,
    SimpleGrid,
    Stack,
    Text,
    Icon,
    Field,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { PasswordInput } from '@/components/ui/password-input';
import { BsImage } from 'react-icons/bs';

interface LoginFormValues {
    email: string;
    password: string;
}

const LoginPage: React.FC = () => {
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
                                Welcome back
                            </Heading>
                            <Text >
                                Sign in to your account
                            </Text>
                        </Stack>

                        <Box as="form" onSubmit={onSubmit} width="full">
                            <Stack gap={5}>
                                <Field.Root id="email" invalid={!!errors.email}>
                                    <Field.Label fontWeight="medium" fontSize="sm">Email</Field.Label>
                                    <Input
                                        size="lg"
                                        type="email"
                                        placeholder="you@example.com"
                                        {...register("email", { required: "Email is required" })}
                                    />
                                    {errors.email && <Field.ErrorText>{errors.email.message}</Field.ErrorText>}
                                </Field.Root>

                                <Field.Root id="password" invalid={!!errors.password}>
                                    <Field.Label fontWeight="medium" fontSize="sm">Password</Field.Label>
                                    <PasswordInput
                                        size="lg"
                                        {...register("password", { required: "Password is required" })}
                                    />
                                    {errors.password && <Field.ErrorText>{errors.password.message}</Field.ErrorText>}
                                </Field.Root>

                                <HStack justify="flex-end" mt={-2} mb={3}>
                                    <Link
                                        href="forgot-password"

                                        fontWeight="medium"
                                        fontSize="sm"
                                        _hover={{ textDecoration: 'underline' }}
                                    >
                                        Forgot password?
                                    </Link>
                                </HStack>


                                <Button
                                    type="submit"
                                    width="full"
                                    size="lg"
                                >
                                    Sign in
                                </Button>
                            </Stack>
                        </Box>

                        <Box textAlign="center" mt={0}>
                            <Text fontSize="sm" >
                                Don't have an account yet?{' '}
                                <Link href="/signup" fontWeight="medium">
                                    Sign up
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