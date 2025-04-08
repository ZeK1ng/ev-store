import { Routes, Route } from 'react-router-dom';

import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignUp'; // Ensure this path is correct
import ForgotPassword from '@/pages/auth/ForgotPassword'; // Ensure this path is correct
import PageNotFound from '@/pages/PageNotFound';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Corrected path */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AppRoutes;
