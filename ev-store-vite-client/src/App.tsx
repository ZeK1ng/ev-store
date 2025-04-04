import { Box } from '@chakra-ui/react'
import Header from '@/components/Header'
import HomePage from '@/pages/HomePage'

function App() {
  return (
    <>
      <Header />
      <Box as="main" p={4}>
        <HomePage />
      </Box>
    </>
  )
}

export default App