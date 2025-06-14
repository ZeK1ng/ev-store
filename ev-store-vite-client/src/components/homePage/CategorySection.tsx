import { Box, Heading, SimpleGrid, VStack, HStack, Icon, Text } from '@chakra-ui/react'
import PopularProductsSlider from './PopularProductsSlider'
import { Link as RouterLink } from 'react-router-dom'
import {
  LuBatteryCharging,
  LuCable,
} from 'react-icons/lu'
import FeaturesSection from './FeaturesSection'
import { PiChargingStation } from "react-icons/pi";
import { TbPlugConnectedX, TbRecharging } from "react-icons/tb";
import { useTranslation } from 'react-i18next'

interface Category {
  id: number
  name: string
  description: string
  children: Category[]
}

interface CategorySectionProps {
  category: Category
  showSubcategories?: number
}

const getCategoryIcon = (categoryName: string, parentCategoryName: string) => {
  const iconMap: { [key: string]: any } = {
    "Portable Chargers": LuBatteryCharging,
    "Wall-Mounted Chargers": PiChargingStation,
    "EV Adapters": TbRecharging,
    "EV Cables": LuCable,
    "EV Connectors": TbPlugConnectedX,
  }

  return iconMap[categoryName] || iconMap[parentCategoryName] || LuBatteryCharging
}

const CategorySection = ({ category, showSubcategories = 4 }: CategorySectionProps) => {
  const { t } = useTranslation('home')

  return (
    <Box pt={8}>
      {
        category.name === 'EV Adapters' && (
          <FeaturesSection />
        )
      }
      <VStack gap={4} alignItems="stretch">
        <Box>
          <Heading as="h2" size="3xl" textAlign="left">
            {t(`categorySection.${category.name.toLocaleLowerCase().replace(" ", "_")}`)}
          </Heading>
          <Text fontSize="md" textAlign="left" color="gray.500">
            {t(`categorySection.${category.name.toLocaleLowerCase().replace(" ", "_")}_description`)}
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: showSubcategories || 2 }} gap={{ base: 2, md: 4, lg: 6 }}>
          {category.children.slice(0, showSubcategories).map((subcategory) => (
            <RouterLink
              key={subcategory.id}
              to={`/catalog?categories=${subcategory.id}`}
              style={{ textDecoration: 'none' }}
            >
              <Box
                p={4}
                borderWidth="1px"
                borderRadius="lg"
                _hover={{
                  shadow: 'md',
                  bg: 'bg.muted',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s'
                }}
                transition="all 0.2s"
              >
                <HStack gap={4} alignItems="center">
                  <Icon
                    as={getCategoryIcon(subcategory.name, category.name)}
                    boxSize={8}
                  />
                  <Heading as="h3" size="md" textAlign="left">
                    {subcategory.name}
                  </Heading>
                </HStack>
              </Box>
            </RouterLink>
          ))}
        </SimpleGrid>

        <PopularProductsSlider categoryId={category.id} hidePandings={true} hideTitle={true} />
      </VStack>
    </Box>
  )
}

export default CategorySection 