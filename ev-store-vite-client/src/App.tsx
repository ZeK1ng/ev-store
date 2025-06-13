import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppRoutes from '@/routes/AppRoutes';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/contexts/LanguageContext';

const AppContent = () => {
  const { pathname } = useLocation()
  const hideFooter = pathname.startsWith('/cms-admin')

  return (
    <>
      <Header />
      <Box as="main" w="100%" bg="bg.subtle">
        <Box w="100%" maxW="1296px" mx="auto">
          <AppRoutes />
        </Box>
      </Box>
      {!hideFooter && <Footer />}
      <Toaster />
    </>
  )
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <AppContent />
      </Router>
    </LanguageProvider>
  )
}

export default App;