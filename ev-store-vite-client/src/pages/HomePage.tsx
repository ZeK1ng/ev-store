import { Box, Skeleton, SkeletonText, SimpleGrid, VStack, HStack, Icon } from '@chakra-ui/react'
import HeroSection from '@/components/homePage/HeroSection'
import CategorySection from '@/components/homePage/CategorySection'
import FAQSection from '@/components/homePage/FAQSection'
import { useEffect, useState } from 'react'
import API from '@/utils/AxiosAPI'
import { LuBatteryCharging } from 'react-icons/lu'

interface Category {
  id: number
  name: string
  description: string
  children: Category[]
}

const CategorySkeleton = () => {
  return (
    <Box pt={8}>
      <VStack gap={4} alignItems="stretch">
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Skeleton height="48px" width="300px" mb={2} />
          </Box>
          <Skeleton height="40px" width="120px" display={{ base: 'none', md: 'block' }} />
        </Box>

        <SimpleGrid
          display={{ base: 'none', md: 'grid' }}
          columns={{ md: 2, lg: 4 }}
          gap={{ md: 4, lg: 6 }}
        >
          {[1, 2, 3, 4].map((index) => (
            <Box
              key={index}
              p={4}
              borderWidth="1px"
              borderRadius="lg"
            >
              <HStack gap={4} alignItems="center">
                <Skeleton>
                  <Icon as={LuBatteryCharging} boxSize={8} />
                </Skeleton>
                <Skeleton height="24px" width="150px" />
              </HStack>
            </Box>
          ))}
        </SimpleGrid>

        <Box py={4}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
            {[1, 2, 3, 4].map((index) => (
              <Box key={index}>
                <Skeleton height="200px" mb={4} />
                <SkeletonText noOfLines={3} />
                <Skeleton height="40px" mt={4} />
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </VStack>
    </Box>
  )
}

const HomePage = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        const response = await API.get('/category/all')
        const data = response.data
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
    window.scrollTo(0, 0)
  }, [])

  return (
    <Box textAlign="center" px={{ base: 4, md: 8 }} pb={{ base: 4, md: 8 }}>
      <HeroSection />

      <Box
        mt="300px"
        textAlign="center"
        px={{ base: 4, md: 8 }}
        pb={{ base: 4, md: 8 }}
      >
        {isLoading ? (
          <>
            <CategorySkeleton />
            <CategorySkeleton />
          </>
        ) : (
          categories.map((category) => (
            <CategorySection
              key={category.id}
              category={category}
              showSubcategories={
                category.name === 'EV Chargers' ? 2 :
                  category.name === 'EV Adapters' ? 4 :
                    undefined
              }
            />
          ))
        )}

        <FAQSection />
      </Box>
    </Box>
  )
}

export default HomePage
