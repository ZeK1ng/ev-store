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
import { useForm, SubmitHandler } from 'react-hook-form';
import { BsImage } from 'react-icons/bs'; // Placeholder logo icon

interface ForgotPasswordFormValues {
    email: string;
}

const ForgotPasswordPage: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormValues>({
        defaultValues: {
            email: "",
        }
    });

    const onSubmit: SubmitHandler<ForgotPasswordFormValues> = (data) => {
        console.log('Forgot password request:', data);
        // Add logic to send password reset link here
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
                                Forgot your password?
                            </Heading>
                            <Text>
                                No worries, enter your email below to receive reset instructions.
                            </Text>
                        </Stack>

                        <Box as="form" onSubmit={handleSubmit(onSubmit)} width="full">
                            <Stack gap={5}>
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

                                <Button
                                    type="submit"
                                    colorScheme="blue" // Using a default color scheme
                                    width="full"
                                    size="lg"
                                    mt={3}
                                >
                                    Send Reset Instructions
                                </Button>

                                <Box textAlign="center" mt={2}>
                                     <Text fontSize="sm">
                                        Remembered your password?{' '}
                                        <Link href="/login" fontWeight="medium">
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

export default ForgotPasswordPage;