import { Box } from '@chakra-ui/react'
import HeroSection from '@/components/homePage/HeroSection'
import FeaturesSection from '@/components/homePage/FeaturesSection'

const HomePage = () => {
  return (
    <Box textAlign="center">
      <HeroSection />
      <FeaturesSection />
    </Box>
  )
}

export default HomePage
