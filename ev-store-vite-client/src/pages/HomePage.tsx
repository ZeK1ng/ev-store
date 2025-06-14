import { Box } from '@chakra-ui/react'
import HeroSection from '@/components/homePage/HeroSection'
import CategorySection from '@/components/homePage/CategorySection'
import FAQSection from '@/components/homePage/FAQSection'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import API from '@/utils/AxiosAPI'
import PopularProductsSlider from '@/components/homePage/PopularProductsSlider'

interface Category {
  id: number
  name: string
  description: string
  children: Category[]
}

const HomePage = () => {
  const { t } = useTranslation('home')
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
  }, [])

  return (
    <Box textAlign="center" p={{ base: 4, md: 8 }}>
      <HeroSection />

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
  )
}

export default HomePage
