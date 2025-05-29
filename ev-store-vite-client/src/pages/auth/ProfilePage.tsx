import { useState, useMemo } from 'react';
import {
    Box,
    Button,
    Heading,
    Input,
    SimpleGrid,
    Stack,
    Flex,
    Textarea,
    Separator,
    Field,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next'

interface ProfileUpdateData {
    phone: string;
    city: string;
    address: string;
}

const ProfilePage = () => {
    const { t } = useTranslation('auth');

    const firstName = 'John'
    const lastName = 'Doe'
    const email = 'john.doe@example.com'

    const initialData: ProfileUpdateData = useMemo(() => ({
        phone: '555555',
        city: 'Tbilisi',
        address: '123 Main Street',
    }), [])

    // Editable fields
    const [phone, setPhone] = useState(initialData.phone)
    const [city, setCity] = useState(initialData.city)
    const [address, setAddress] = useState(initialData.address)

    const handleSave = () => {
        const updatePayload: ProfileUpdateData = { phone, city, address };
        // TODO: send updatePayload to backend
        console.log('Profile saved:', updatePayload)
    }

    // determine if any field was changed
    const isDirty = (
        phone !== initialData.phone ||
        city !== initialData.city ||
        address !== initialData.address
    )

    return (
        <SimpleGrid columns={{ base: 1 }} minH="100vh">
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                py={{ base: 12, md: 16 }}
                px={{ base: 6, sm: 8, md: 12, lg: 16 }}
            >
                <Box bg="whiteAlpha.50" borderRadius="lg" shadow="md" p={8} maxW="600px" w="full">
                    <Heading textAlign="center" mb={6}>{t('profile.title')}</Heading>
                    <Separator mb={6} />
                    <Stack gap={4}>
                        <Flex gap={4}>
                            <Box flex={1}>
                                <Field.Root id="firstName" invalid={false}>
                                    <Field.Label>
                                        {t('profile.firstName')}
                                    </Field.Label>
                                    <Input value={firstName} disabled />
                                </Field.Root>
                            </Box>
                            <Box flex={1}>
                                <Field.Root id="lastName" invalid={false}>
                                    <Field.Label>
                                        {t('profile.lastName')}
                                    </Field.Label>
                                    <Input value={lastName} disabled />
                                </Field.Root>
                            </Box>
                        </Flex>

                        <Field.Root id="email" invalid={false}>
                            <Field.Label>
                                {t('profile.email')}
                            </Field.Label>
                            <Input value={email} disabled />
                        </Field.Root>

                        <Field.Root id="phone" invalid={false}>
                            <Field.Label>
                                {t('profile.phone')}
                            </Field.Label>
                            <Input
                                type="number"
                                placeholder={t('profile.phonePlaceholder')}
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                            />
                        </Field.Root>

                        <Field.Root id="city" invalid={false}>
                            <Field.Label>
                                {t('profile.city')}
                            </Field.Label>
                            <Input
                                placeholder={t('profile.cityPlaceholder')}
                                value={city}
                                onChange={e => setCity(e.target.value)}
                            />
                        </Field.Root>

                        <Field.Root id="address" invalid={false}>
                            <Field.Label>
                                {t('profile.address')}
                            </Field.Label>
                            <Textarea
                                placeholder={t('profile.addressPlaceholder')}
                                value={address}
                                onChange={e => setAddress(e.target.value)}
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