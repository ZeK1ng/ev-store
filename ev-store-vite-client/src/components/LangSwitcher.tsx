import { Select, Portal, createListCollection, HStack, Button, useBreakpointValue } from '@chakra-ui/react'
import { Language, useLanguage } from '@/contexts/LanguageContext'

const LangSwitcher = () => {
  const { language, setLanguage } = useLanguage()
  const isMobile = useBreakpointValue({ base: true, md: false })

  const langs = createListCollection({
    items: [
      { label: "GEO", value: "ka" },
      { label: "ENG", value: "en" },
      { label: "RUS", value: "ru" },
    ],
  })

  if (isMobile) {
    return (
      <HStack gap={2}>
        {langs.items.map((lang) => (
          <Button
            key={lang.value}
            size="sm"
            variant={language === lang.value ? "solid" : "outline"}
            colorScheme="blue"
            onClick={() => setLanguage(lang.value as Language)}
            p={2}
          >
            {lang.label}
          </Button>
        ))}
      </HStack>
    )
  }

  return (
    <Select.Root
      collection={langs}
      size="xs"
      value={[language]}
      width="70px"
      positioning={{ sameWidth: true }}
      onValueChange={(e) => {
        const newLang = e.value[0] as Language;
        setLanguage(newLang);
      }}
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {langs.items.map((lang) => (
              <Select.Item item={lang} key={lang.value}>
                {lang.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  )
}

export default LangSwitcher;

