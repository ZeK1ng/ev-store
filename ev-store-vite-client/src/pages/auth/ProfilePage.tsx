import { useState, useMemo } from 'react';
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
                justifyContent="center"
                py={{ base: 8, md: 12 }}
                px={{ base: 6, sm: 8, md: 12, lg: 16 }}
            >
                <Box bg="whiteAlpha.50" borderRadius="lg" shadow="2xl" p={6} maxW="500px" w="full" h="max-content">
                    <Heading textAlign="center" mb={6}>{t('profile.title')}</Heading>
                    <Separator mb={6} />
                    <Stack gap={4}>
                        <Flex gap={4}>
                            <Box flex={1}>
                                <Field.Root id="firstName" invalid={false}>
                                    <Field.Label>
                                        {t('profile.firstName')}
                                    </Field.Label>
                                    <Input size="lg" value={firstName} disabled />
                                </Field.Root>
                            </Box>
                            <Box flex={1}>
                                <Field.Root id="lastName" invalid={false}>
                                    <Field.Label>
                                        {t('profile.lastName')}
                                    </Field.Label>
                                    <Input size="lg" value={lastName} disabled />
                                </Field.Root>
                            </Box>
                        </Flex>

                        <Field.Root id="email" invalid={false}>
                            <Field.Label>
                                {t('profile.email')}
                            </Field.Label>
                            <InputGroup startElement={<LuMail />}>
                                <Input size="lg" value={email} disabled />
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
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
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
                                    value={city}
                                    onChange={e => setCity(e.target.value)}
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