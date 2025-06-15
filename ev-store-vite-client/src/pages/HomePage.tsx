import { Box } from '@chakra-ui/react'
import HeroSection from '@/components/homePage/HeroSection'
import CategorySection from '@/components/homePage/CategorySection'
import FAQSection from '@/components/homePage/FAQSection'
import { useEffect, useState } from 'react'
import API from '@/utils/AxiosAPI'

interface Category {
  id: number
  name: string
  description: string
  children: Category[]
}

const HomePage = () => {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await API.get('/category/all')
        const data = response.data
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
    window.scrollTo(0, 0);
  }, [])

  return (
    <Box textAlign="center" px={{ base: 4, md: 8 }} pb={{ base: 4, md: 8 }}>
      <HeroSection />
      
      <Box 
        mt="400px"
        textAlign="center" 
        px={{ base: 4, md: 8 }}
        pb={{ base: 4, md: 8 }}
      >
        {categories.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            showSubcategories={
              category.name === 'EV Chargers' ? 2 :
              category.name === 'EV Adapters' ? 4 :
              undefined
            }
          />
        ))}

        <FAQSection />
      </Box>
    </Box>
  )
}

export default HomePage
