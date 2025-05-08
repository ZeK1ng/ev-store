import { Box } from '@chakra-ui/react'
import HeroSection from '@/components/homePage/HeroSection'
import FeaturesSection from '@/components/homePage/FeaturesSection'
import FeaturedIChargersSection, { FeaturedItem } from '@/components/homePage/FeaturedChargersSection'
import FeaturedOBDSection, { FeaturedOBDItem } from '@/components/homePage/FeaturedOBDSection'
import FAQSection from '@/components/homePage/FAQSection'
import { useTranslation } from 'react-i18next'

const dummyDataCharger: [FeaturedItem, FeaturedItem, FeaturedItem, FeaturedItem] = [
  {
    id: '1',
    title: 'EV adapters',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    imageUrl: 'https://placehold.co/150x150',
  },
  {
    id: '2',
    title: 'EV adapters',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    imageUrl: 'https://placehold.co/120x120',
  },
  {
    id: '3',
    title: 'EV adapters',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    imageUrl: 'https://placehold.co/120x120',
  },
  {
    id: '4',
    title: 'EV adapters',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    imageUrl: 'https://placehold.co/150x150',
  },
]

const dummyDataOBD: [FeaturedOBDItem, FeaturedOBDItem, FeaturedOBDItem, FeaturedOBDItem, FeaturedOBDItem] = [
  {
    id: '1',
    title: 'OBD adapters',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    imageUrl: 'https://placehold.co/150x150',
  },
  {
    id: '2',
    title: 'OBD adapters',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    imageUrl: 'https://placehold.co/120x120',
  },
  {
    id: '3',
    title: 'OBD adapters',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    imageUrl: 'https://placehold.co/120x120',
  },
  {
    id: '4',
    title: 'OBD adapters',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    imageUrl: 'https://placehold.co/150x150',
  },
  {
    id: '5',
    title: 'OBD adapters',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    imageUrl: 'https://placehold.co/150x150',
  },
]


const HomePage = () => {
  const { t } = useTranslation('home')

  return (
    <Box textAlign="center">
      <HeroSection />
      <FeaturesSection />
      <FeaturedIChargersSection
        title={t('featuredEVItems.title')}
        seeAllLabel={t('featuredEVItems.seeAllLabel')}
        learnMoreLabel={t('featuredEVItems.learnMoreLabel')}
        onSeeAll={() => console.log('See all clicked')}
        items={dummyDataCharger}
      />
      <FeaturedOBDSection
        title={t('featuredOBDItems.title')}
        seeAllLabel={t('featuredOBDItems.seeAllLabel')}
        learnMoreLabel={t('featuredOBDItems.learnMoreLabel')}
        onSeeAll={() => console.log('See all clicked')}
        items={dummyDataOBD}
      />
      <FAQSection />
    </Box>
  )
}

export default HomePage
