import { Box, Heading, SimpleGrid, VStack, HStack, Icon } from '@chakra-ui/react'
import PopularProductsSlider from './PopularProductsSlider'
import { Link as RouterLink } from 'react-router-dom'
import {
  LuBatteryCharging,
  LuCable,
} from 'react-icons/lu'
import { PiChargingStation } from "react-icons/pi";
import { TbPlugConnectedX, TbRecharging } from "react-icons/tb";


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
  return (
    <Box pt={8}>
      <VStack gap={4} alignItems="stretch">
        <Box>
          <Heading as="h2" size="xl" textAlign="left">
            {category.name}
          </Heading>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: showSubcategories || 2 }} gap={{base: 2, md: 4, lg: 6}}>
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
                  bg: 'gray.50',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s'
                }}
                transition="all 0.2s"
              >
                <HStack gap={4} alignItems="center">
                  <Icon
                    as={getCategoryIcon(subcategory.name, category.name)}
                    boxSize={8}
                    color="#9CE94F"
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