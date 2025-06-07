import { useState, useEffect } from 'react';
import API from '@/utils/AxiosAPI';
import AuthController from '@/utils/AuthController';
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
    Text
} from '@chakra-ui/react';
import { LuMail, LuPhone, LuMapPin } from "react-icons/lu"
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

    const [userData, setUserData] = useState<UserDetails>({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        city: '',
        address: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await API.get('/user/details', {
                    headers: {
                        Authorization: `Bearer ${AuthController.getAccessToken()}`
                    }
                });
                setUserData(response.data);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };
        fetchUserData();
    }, []);

    const [isDirty, setIsDirty] = useState(false);

    const handleSave = async () => {
        if (!isDirty) return;

        const updateData: ProfileUpdateData = {
            mobile: userData.mobile,
            city: userData.city,
            address: userData.address
        };

        try {
            await API.patch('/user/update', updateData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            setIsDirty(false);
        } catch (error) {
            console.error('Failed to update user data:', error);
        }

    };

    return (
        <SimpleGrid columns={{ base: 1 }} minH="100vh">
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
                                    <Input size="lg" value={userData?.firstName} disabled />
                                </Field.Root>
                            </Box>
                            <Box flex={1}>
                                <Field.Root id="lastName" invalid={false}>
                                    <Field.Label>
                                        {t('profile.lastName')}
                                    </Field.Label>
                                    <Input size="lg" value={userData?.lastName} disabled />
                                </Field.Root>
                            </Box>
                        </Flex>

                        <Field.Root id="email" invalid={false}>
                            <Field.Label>
                                {t('profile.email')}
                            </Field.Label>
                            <InputGroup startElement={<LuMail />}>
                                <Input size="lg" value={userData?.email} disabled />
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
                                    value={userData?.mobile}
                                    onChange={e => setUserData({
                                        ...userData,
                                        mobile: e.target.value
                                    })}
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
                                    value={userData?.city}
                                    onChange={e => setUserData({
                                        ...userData,
                                        city: e.target.value
                                    })}
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
                                value={userData?.address}
                                onChange={e => setUserData({
                                    ...userData,
                                    address: e.target.value
                                })}
                            />
                        </Field.Root>

                        <Button size="lg" mt={4} w="full" onClick={handleSave} disabled={!isDirty}>
                            {t('profile.updateButton')}
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </SimpleGrid >
    );

}

export default ProfilePage;