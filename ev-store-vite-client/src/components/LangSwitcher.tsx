import { Select, Portal, createListCollection } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

const LangSwitcher = () => {
  const { i18n } = useTranslation()

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
      value={[ i18n.language ]}
      width={{ base: "100%", md: "120px" }}
      positioning={{ sameWidth: true }}
      onValueChange={(e) => {
        i18n.changeLanguage(e.value[0])
        
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

