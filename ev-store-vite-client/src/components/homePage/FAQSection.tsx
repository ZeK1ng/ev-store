import {
    Box,
    Heading,
    Accordion, Span
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

interface FAQItem {
    value: string
    title: string
    text: string
}

const FAQSection = () => {
    const { t } = useTranslation('home')

    const faqItems = t('faq.items', { returnObjects: true }) as FAQItem[]

    return (
        <Box px={{ base: 4, md: 16 }} py={12}>
            <Heading as="h2" size={{base: '2xl', md: '4xl'}} mb={6} textAlign={{base: 'left', md: 'center'}}>
                {t('faq.title')}
            </Heading>
            <Accordion.Root size="lg" multiple variant={"enclosed"}>
                {faqItems.map((item) => (
                    <Accordion.Item key={item.value} value={item.value}>
                        <Accordion.ItemTrigger>
                            <Span flex="1">{item.title}</Span>
                            <Accordion.ItemIndicator />
                        </Accordion.ItemTrigger>
                        <Accordion.ItemContent>
                            <Accordion.ItemBody textAlign={"start"}>{item.text}</Accordion.ItemBody>
                        </Accordion.ItemContent>
                    </Accordion.Item>
                ))}
            </Accordion.Root>
        </Box>
    )
}

export default FAQSection
