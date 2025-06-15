import { Box, Heading, SimpleGrid, VStack, HStack, Icon, Text, Button, Menu, Portal, Separator } from '@chakra-ui/react'
import PopularProductsSlider from './PopularProductsSlider'
import { Link as RouterLink } from 'react-router-dom'
import {
    LuBatteryCharging,
    LuCable,
} from 'react-icons/lu'
import FeaturesSection from './FeaturesSection'
import { PiChargingStation } from "react-icons/pi";
import { TbPlugConnectedX, TbRecharging } from "react-icons/tb";
import { LuArrowRight, LuArrowDownWideNarrow } from 'react-icons/lu'
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
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                        <Heading as="h2" size="3xl" textAlign="left">
                            {t(`categorySection.${category.name.toLocaleLowerCase().replace(" ", "_")}`)}
                        </Heading>
                        <Text fontSize="md" textAlign="left" color="gray.500" maxW="768px">
                            {t(`categorySection.${category.name.toLocaleLowerCase().replace(" ", "_")}_description`)}
                        </Text>
                    </Box>
                    <Button
                        as={RouterLink}
                        variant="surface"
                        display={{ base: 'none', md: 'flex' }}
                        asChild
                    >
                        <RouterLink to={`/catalog?categories=${category.id}`}>
                            {t('viewAllCategory')} <LuArrowRight />
                        </RouterLink>
                    </Button>
                </Box>

                <Box display={{ base: 'block', md: 'none' }} width="100%">
                    <Menu.Root>
                        <Menu.Trigger asChild>
                            <Button variant="outline" width="100%" justifyContent="space-between">
                                {t('mobileSelectCategory')} <LuArrowDownWideNarrow />
                            </Button>
                        </Menu.Trigger>
                        <Portal >
                            <Menu.Positioner width="70%">
                                <Menu.Content>
                                    <RouterLink to={`/catalog?categories=${category.id}`} style={{ textDecoration: 'none' }}>
                                        <Menu.Item value="view-all">
                                            {t('viewAllCategory')}
                                        </Menu.Item>
                                    </RouterLink>
                                    {category.children.slice(0, showSubcategories).map((subcategory) => (
                                        <>
                                            <Separator my={1} />

                                            <RouterLink
                                                key={subcategory.id}
                                                to={`/catalog?categories=${subcategory.id}`}
                                                style={{ textDecoration: 'none' }}
                                            >
                                                <Menu.Item value={`category-${subcategory.id}`}>
                                                    <HStack>
                                                        <Icon
                                                            as={getCategoryIcon(subcategory.name, category.name)}
                                                            boxSize={5}
                                                        />
                                                        <Text>{subcategory.name}</Text>
                                                    </HStack>
                                                </Menu.Item>
                                            </RouterLink>
                                        </>
                                    ))}
                                </Menu.Content>
                            </Menu.Positioner>
                        </Portal>
                    </Menu.Root>
                </Box>
                <SimpleGrid
                    display={{ base: 'none', md: 'grid' }}
                    columns={{ md: 2, lg: showSubcategories || 2 }}
                    gap={{ md: 4, lg: 6 }}
                >
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