import { useState } from 'react';
import {
    Box,
    Flex,
    Image,
    Heading,
    Text,
    Stack,
    Button,
    HStack,
    IconButton,
    NumberInput,
    Field,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { LuMinus, LuPlus } from 'react-icons/lu';
import PopularProductsSlider from '@/components/homePage/PopularProductsSlider';
import { useTranslation } from "react-i18next";

interface FormValues {
    quantity: number;
}

const ProductDetailsPage = () => {
    const { t } = useTranslation('cart');
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const product = {
        id: '1',
        nameEn: 'Fast Charger',
        descriptionEn: 'High-speed EV charger for home use.',
        price: 299.99,
        mainImage: 'https://placehold.co/600x400',
        images: [
            'https://placehold.co/100x100?text=Img1',
            'https://placehold.co/100x100?text=Img2',
            'https://placehold.co/100x100?text=Img3',
            'https://placehold.co/100x100?text=Img4',
            'https://placehold.co/100x100?text=Img5',
            'https://placehold.co/100x100?text=Img6',
            'https://placehold.co/100x100?text=Img7',
            'https://placehold.co/100x100?text=Img8',
            'https://placehold.co/100x100?text=Img9',
        ],
    };

    const allThumbnails = [product.mainImage, ...product.images];
    const [activeImage, setActiveImage] = useState<string>(product.mainImage);

    const {
        register,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: { quantity: 1 },
    });

    return (
        <Box>
            <Flex direction={{ base: 'column', md: 'row' }} px={{ base: 4, md: 16 }} pt={12}>
                <Box flex={1}>
                    <Image
                        src={activeImage}
                        alt={product.nameEn}
                        objectFit="cover"
                        h={{ base: '300px', md: '400px' }}
                        w="full"
                        borderRadius="md"
                    />

                    <HStack
                        mt={4}
                        gap={2}
                        overflowX="auto"
                        flexWrap="nowrap"
                        css={{
                            msOverflowStyle: 'none',
                            scrollbarWidth: 'none',
                            '::-webkit-slider-value-text': {
                              display: 'none', 
                            }
                          }}
                    >
                        {allThumbnails.map((src, idx) => (
                            <IconButton
                                key={idx}
                                onClick={() => setActiveImage(src)}
                                aria-label={`Thumbnail ${idx + 1}`}
                                border="xs"
                                borderColor={src === activeImage ? 'green.500' : 'blackAlpha.200'}
                                borderRadius="md"
                                _hover={{ borderColor: 'green.400' }}
                                cursor="pointer"
                                boxSize="50px"
                                overflow={'hidden'}
                            >
                                <Image
                                    src={src}
                                    alt={`${product.nameEn} thumbnail ${idx + 1}`}
                                />
                            </IconButton>
                        ))}
                    </HStack>
                </Box>

                <Box flex={1} pl={{ base: 0, md: 6 }} pt={{ base: 4, md: 0 }}>
                    <Stack gap={4}>
                        <Heading size="2xl">{product.nameEn}</Heading>
                        <Text fontSize="lg" color="gray.500">
                            {product.descriptionEn}
                        </Text>
                        <Text fontSize="2xl" fontWeight="bold">
                            ${product.price.toFixed(2)}
                        </Text>

                        <Field.Root invalid={false}>
                            <NumberInput.Root defaultValue="1" unstyled spinOnPress={false}
                                min={1} max={50} step={1}
                                onValueChange={(e) => console.log(e.value)}
                            >
                                <HStack gap="2">
                                    <NumberInput.DecrementTrigger asChild>
                                        <IconButton variant="outline" size="sm">
                                            <LuMinus />
                                        </IconButton>
                                    </NumberInput.DecrementTrigger>
                                    <NumberInput.ValueText textAlign="center" fontSize="lg" minW="3ch" />
                                    <NumberInput.IncrementTrigger asChild>
                                        <IconButton variant="outline" size="sm">
                                            <LuPlus />
                                        </IconButton>
                                    </NumberInput.IncrementTrigger>
                                </HStack>
                            </NumberInput.Root>
                        </Field.Root>

                        <Button size="lg" colorScheme="blue" w="max-content">
                            {t('details.addToCart')}
                        </Button>
                    </Stack>
                </Box>
            </Flex>

            <PopularProductsSlider categories={["ulala"]} showAll={false} />
        </Box>
    );
};

export default ProductDetailsPage;
