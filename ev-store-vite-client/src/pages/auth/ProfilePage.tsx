import { useState, useEffect } from 'react';
import API from '@/utils/AxiosAPI';
import {
    Box,
    Button,
    Heading,
    Input,
    InputGroup,
    SimpleGrid,
    Stack,
    Flex,
    Textarea,
    Separator,
    Field,
    HStack,
    Text,
    EmptyState,
    Spinner,
    Center,
    VStack,
    ButtonGroup
} from '@chakra-ui/react';
import { LuMail, LuPhone, LuMapPin, LuWifiOff } from "react-icons/lu"
import { useTranslation } from 'react-i18next'

interface UserDetails {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    city: string;
    address: string;
}

interface ProfileUpdateData {
    mobile: string;
    city: string;
    address: string;
}

const ProfilePage = () => {
    const { t } = useTranslation('auth');
    const [userData, setUserData] = useState<UserDetails | null>(null);
    const [originalData, setOriginalData] = useState<UserDetails | null>(null);

    const [isDirty, setIsDirty] = useState(false);
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUserData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await API.get('/user/details');
            setUserData(response.data);
            setOriginalData(response.data);
        } catch (err: any) {
            setError(t('profile.loadError'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        if (userData && originalData) {
            setIsDirty(
                userData.mobile !== originalData.mobile ||
                userData.city !== originalData.city ||
                userData.address !== originalData.address
            );
        } else {
            setIsDirty(false);
        }
    }, [userData, originalData]);

    const handleFieldChange = (field: keyof ProfileUpdateData, value: string) => {
        if (userData) {
            setUserData({ ...userData, [field]: value });
        }
    };

    const handleSave = async () => {
        if (!isDirty || !userData) return;
        setUpdateLoading(true);
        setError(null);

        const updateData: ProfileUpdateData = {
            mobile: userData.mobile,
            city: userData.city,
            address: userData.address
        };

        try {
            await API.patch('/user/update', updateData);
            setOriginalData({ ...userData });
            setIsDirty(false);
        } catch (err: any) {
            setError(t('profile.updateError'));
        } finally {
            setUpdateLoading(false);
        }
    };

    if (loading) {
        return (
            <Center minH="90vh">
                <Spinner size="xl" borderWidth="4px"/>
            </Center>
        );
    }

    if (error) {
        return (
            <Center minH="90vh">
                <Stack gap={8} maxW="lg" w="full">
                    <EmptyState.Root>
                        <EmptyState.Content>
                            <EmptyState.Indicator>
                                <LuWifiOff />
                            </EmptyState.Indicator>
                            <VStack textAlign="center">
                                <EmptyState.Title>
                                    {t('profile.emptyTitle')}
                                </EmptyState.Title>
                                <EmptyState.Description>
                                    {t('profile.emptyDescription')}
                                </EmptyState.Description>
                            </VStack>
                            <ButtonGroup>
                                <Button onClick={fetchUserData}>{t('profile.tryAgain')}</Button>
                            </ButtonGroup>
                        </EmptyState.Content>
                    </EmptyState.Root>
                </Stack>
            </Center>
        );
    }

    return (
        <SimpleGrid columns={{ base: 1 }} minH="90vh">
            <Box
                display="flex"
                justifyContent="center"
                py={{ base: 8, md: 12 }}
                px={{ base: 6, sm: 8, md: 12, lg: 16 }}
            >
                <Box bg="whiteAlpha.50" borderRadius="lg" shadow="2xl" p={6} maxW="800px" w="full" h="max-content">
                    <Heading textAlign="center" mb={6}>{t('profile.title')}</Heading>
                    <Separator mb={6} />
                    <Stack gap={4}>
                        <Flex gap={4}>
                            <Box flex={1}>
                                <Field.Root id="firstName" invalid={false}>
                                    <Field.Label>
                                        {t('profile.firstName')}
                                    </Field.Label>
                                    <Input size="lg" value={userData?.firstName || ''} disabled />
                                </Field.Root>
                            </Box>
                            <Box flex={1}>
                                <Field.Root id="lastName" invalid={false}>
                                    <Field.Label>
                                        {t('profile.lastName')}
                                    </Field.Label>
                                    <Input size="lg" value={userData?.lastName || ''} disabled />
                                </Field.Root>
                            </Box>
                        </Flex>

                        <Field.Root id="email" invalid={false}>
                            <Field.Label>
                                {t('profile.email')}
                            </Field.Label>
                            <InputGroup startElement={<LuMail />}>
                                <Input size="lg" value={userData?.email || ''} disabled />
                            </InputGroup>
                        </Field.Root>

                        <HStack>
                            <Separator flex="1" />
                            <Text flexShrink="0" color="fg.muted">
                                {t('profile.editableFields')}
                            </Text>
                            <Separator flex="1" />
                        </HStack>

                        <Field.Root id="phone" invalid={false}>
                            <Field.Label>
                                {t('profile.phone')}
                            </Field.Label>
                            <InputGroup startElement={<LuPhone />}>
                                <Input
                                    type="number"
                                    size="lg"
                                    placeholder={t('profile.phonePlaceholder')}
                                    value={userData?.mobile || ''}
                                    onChange={e => handleFieldChange('mobile', e.target.value)}
                                />
                            </InputGroup>
                        </Field.Root>

                        <Field.Root id="city" invalid={false}>
                            <Field.Label>
                                {t('profile.city')}
                            </Field.Label>
                            <InputGroup startElement={<LuMapPin />}>
                                <Input
                                    size="lg"
                                    placeholder={t('profile.cityPlaceholder')}
                                    value={userData?.city || ''}
                                    onChange={e => handleFieldChange('city', e.target.value)}
                                />
                            </InputGroup>
                        </Field.Root>

                        <Field.Root id="address" invalid={false}>
                            <Field.Label>
                                {t('profile.address')}
                            </Field.Label>
                            <Textarea
                                size="lg"
                                placeholder={t('profile.addressPlaceholder')}
                                value={userData?.address || ''}
                                onChange={e => handleFieldChange('address', e.target.value)}
                            />
                        </Field.Root>

                        <Button
                            size="lg"
                            mt={4}
                            w="full"
                            onClick={handleSave}
                            disabled={!isDirty || updateLoading}
                            loading={updateLoading}
                        >
                            {t('profile.updateButton')}
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </SimpleGrid >
    );
}

export default ProfilePage;
