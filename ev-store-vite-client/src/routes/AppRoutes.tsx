import { Routes, Route } from 'react-router-dom';

import AdminPage from '@/pages/admin/AdminPage';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignUp';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import AboutUs from '@/pages/AboutUs';
import PageNotFound from '@/pages/PageNotFound';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/cms-admin" element={<AdminPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/about-us" element={<AboutUs /> }/>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AppRoutes;
