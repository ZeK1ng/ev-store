import { Select, Portal, createListCollection } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

const LangSwitcher = () => {
  const { i18n } = useTranslation()

  const frameworks = createListCollection({
    items: [
      { label: "ქართული", value: "ka" },
      { label: "English", value: "en" },
    ],
  })

  return (
    <Select.Root 
      collection={frameworks}
      defaultValue={["ka"]}
      width="180px"
      positioning={{ sameWidth: true }}
      onValueChange={(e) => {
        i18n.changeLanguage(e.value[0])
        console.log("Selected language:", e.value[0]);
        
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
            {frameworks.items.map((framework) => (
              <Select.Item item={framework} key={framework.value}>
                {framework.label}
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

