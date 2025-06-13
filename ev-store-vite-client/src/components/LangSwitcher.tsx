import { Select, Portal, createListCollection } from '@chakra-ui/react'
import { Language, useLanguage } from '@/contexts/LanguageContext'



const LangSwitcher = () => {
  const { language, setLanguage } = useLanguage()

  const langs = createListCollection({
    items: [
      { label: "ქართული", value: "ka" },
      { label: "English", value: "en" },
      { label: "Русский", value: "ru" },
    ],
  })
  

  return (
    <Select.Root
      collection={langs}
      size={{ base: "lg", md: "xs" }}
      value={[language]}
      width={{ base: "100%", md: "120px" }}
      positioning={{ sameWidth: true }}
      onValueChange={(e) => {
        const newLang = e.value[0] as Language;
        setLanguage(newLang);
        localStorage.setItem('ev-language', newLang);
      }}
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Select Lang" />
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

