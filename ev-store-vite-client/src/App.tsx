import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppRoutes from '@/routes/AppRoutes';

const AppContent = () => {
  const { pathname } = useLocation()
  const hideFooter = pathname.startsWith('/cms-admin')

  return (
    <>
      <Header />
      <Box as="main" w="100%" maxW='1296px' justifySelf="center"> 
        <AppRoutes />
      </Box>
      {!hideFooter && <Footer />}
    </>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App;