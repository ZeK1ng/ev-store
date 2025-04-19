import React from 'react';
import {
    Box,
    Button,
    Container,
    Heading,
    Stack,
    Text,
    Icon,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';

const PageNotFound: React.FC = () => {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            minH="calc(100vh - 80px)"
            textAlign="center"
            py={{ base: 12, md: 16 }}
            px={{ base: 6, sm: 8 }}
        >
            <Container maxW="md">
                <Stack gap={6} align="center">
                    <Icon as={FiAlertTriangle} boxSize={16} />
                    <Stack gap={2}>
                        <Heading as="h1" size="2xl" fontWeight="bold">
                            404 - Page Not Found
                        </Heading>
                        <Text fontSize="lg">
                            Oops! The page you are looking for does not exist or may have been moved.
                        </Text>
                    </Stack>

                    <Button>
                        <Link to="/">Go Back Home</Link>
                    </Button>
                </Stack>
            </Container>
        </Box>
    );
};

export default PageNotFound;