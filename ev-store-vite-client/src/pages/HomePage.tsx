import { Box, Heading, Text } from '@chakra-ui/react'

const HomePage = () => {
  return (
    <Box textAlign="center" mt={8}>
      <Heading as="h1" mb={4}>
        Welcome to My App!
      </Heading>
      <Text fontSize="lg">
        This is a sample home page with some random welcoming content.
        Enjoy exploring the application and have fun with the theme switcher!
      </Text>
    </Box>
  )
}

export default HomePage
