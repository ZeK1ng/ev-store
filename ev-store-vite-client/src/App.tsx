import { BrowserRouter as Router } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppRoutes from '@/routes/AppRoutes';

function App() {
  return (
    <Router>
      <Header />
      <Box as="main">
        <AppRoutes />
      </Box>
      <Footer />
    </Router>
  );
}

export default App;