import { useRef } from 'react'
import {
    Box,
    Flex,
    Heading,
    Button,
    Image,
    Text,
    Card,
    IconButton
} from '@chakra-ui/react'
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'


export interface Product {
    id: string
    title: string
    description: string
    price: string
    imageUrl: string
}

const dummyProducts: Product[] = Array.from({ length: 10 }, (_, i) => ({
    id: `p${i + 1}`,
    title: `Product Title ${i + 1}`,
    description: `This is a description for product ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
    price: `$${(i + 1) * 50}`,
    imageUrl: `https://placehold.co/300x200?text=Prod+${i + 1}`
}))

const PopularProductsSlider = () => {
    const sliderRef = useRef<HTMLDivElement>(null)
    const { t } = useTranslation('home')

    const scroll = (offset: number) => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: offset, behavior: 'smooth' })
        }
    }

    return (
        <Box px={{ base: 4, md: 16 }} py={12}>
            <Flex justify="space-between" align="center" mb={4}>
                <Heading size={{base: '2xl', md: '4xl'}} textAlign={'left'}>{t('popularProducts.title')}</Heading>
                <Flex>
                    <IconButton
                        aria-label="Scroll left"
                        onClick={() => scroll(-400)}
                        mr={2}
                    >
                        <FaChevronLeft />
                    </IconButton>
                    <IconButton
                        aria-label="Scroll right"
                        onClick={() => scroll(400)}
                    >
                        <FaChevronRight />
                    </IconButton>
                </Flex>
            </Flex>

            <Flex
                ref={sliderRef}
                overflowX="auto"
                gap={4}
                py={4}
                css={{
                    scrollSnapType: 'x mandatory',
                    '&::-webkit-scrollbar': { display: 'none' }
                }}
                scrollBehavior="smooth"
            >
                {dummyProducts.map((product, index) => (

                    <Box
                        key={product.id}
                        flex={{ base: '0 0 300px', md: '0 0 27%' }}
                        scrollSnapAlign="start"
                    >
                        <Card.Root overflow="hidden" key={index}>
                            <Image
                                src={product.imageUrl}
                                alt={product.title}
                                w="full"
                                h="200px"
                                objectFit="cover"
                            />

                            <Card.Body gap="2">
                                <Card.Title>{product.title}</Card.Title>
                                <Card.Description>{product.description}</Card.Description>
                                <Text textStyle="2xl" fontWeight="medium">
                                    {product.price}
                                </Text>
                            </Card.Body>

                            <Card.Footer gap="2">
                                <Button variant="solid">{t('popularProducts.buyNowLabel')}</Button>
                                <Button variant="ghost">{t('popularProducts.learnMoreLabel')}</Button>
                            </Card.Footer>
                        </Card.Root>
                    </Box>
                ))}
            </Flex>
            <Flex justify="center" align="center" mt={4}>
                <Button size="lg" variant="subtle">
                    {t('popularProducts.seeAllLabel')}
                </Button>
            </Flex>
        </Box >
    )
}

export default PopularProductsSlider
