import React from 'react';
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
import { useForm, SubmitHandler } from 'react-hook-form';
import { PasswordInput } from '@/components/ui/password-input';
import { BsImage } from 'react-icons/bs';

interface SignupFormValues {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const SignupPage: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<SignupFormValues>({
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        }
    });

    const passwordValue = watch("password");

    const onSubmit: SubmitHandler<SignupFormValues> = (data) => {
        console.log('Signup data:', data);
        // Add user registration logic here
    };

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
                                Create your account
                            </Heading>
                            <Text >
                                Get started by creating your account
                            </Text>
                        </Stack>

                        <Box as="form" onSubmit={handleSubmit(onSubmit)} width="full">
                            <Stack gap={5}>
                                <Field.Root id="fullName" invalid={!!errors.fullName}>
                                    <Field.Label fontWeight="medium" fontSize="sm">Full Name</Field.Label>
                                    <Input
                                        size="lg"
                                        type="text"
                                        placeholder="Your full name"
                                        {...register("fullName", {
                                            required: "Full name is required"
                                        })}
                                    />
                                    {errors.fullName && <Field.ErrorText>{errors.fullName.message}</Field.ErrorText>}
                                </Field.Root>

                                <Field.Root id="email" invalid={!!errors.email}>
                                    <Field.Label fontWeight="medium" fontSize="sm">Email</Field.Label>
                                    <Input
                                        size="lg"
                                        type="email"
                                        placeholder="you@example.com"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address"
                                            }
                                        })}
                                    />
                                    {errors.email && <Field.ErrorText>{errors.email.message}</Field.ErrorText>}
                                </Field.Root>

                                <Field.Root id="password" invalid={!!errors.password}>
                                    <Field.Label fontWeight="medium" fontSize="sm">Password</Field.Label>
                                    <PasswordInput
                                        size="lg"
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: {
                                                value: 8,
                                                message: "Password must be at least 8 characters"
                                            }
                                        })}
                                    />
                                    {errors.password && <Field.ErrorText>{errors.password.message}</Field.ErrorText>}
                                </Field.Root>

                                <Field.Root id="confirmPassword" invalid={!!errors.confirmPassword}>
                                    <Field.Label fontWeight="medium" fontSize="sm">Confirm Password</Field.Label>
                                    <PasswordInput
                                        size="lg"
                                        {...register("confirmPassword", {
                                            required: "Please confirm your password",
                                            validate: value =>
                                                value === passwordValue || "The passwords do not match"
                                        })}
                                    />
                                    {errors.confirmPassword && <Field.ErrorText>{errors.confirmPassword.message}</Field.ErrorText>}
                                </Field.Root>

                                <Button
                                    type="submit"
                                    width="full"
                                    size="lg"
                                    mt={3}
                                >
                                    Sign up
                                </Button>

                                <Box textAlign="center" mt={2}>
                                    <Text fontSize="sm" >
                                        Already have an account?{' '}
                                        <Link to="/login">
                                            Sign in
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