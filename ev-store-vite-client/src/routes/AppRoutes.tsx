import { Routes, Route } from 'react-router-dom';

import AdminPage from '@/pages/admin/AdminPage';
import ItemsAdminPage from '@/pages/admin/ItemsAdminPage';
import CategoriesAdminPage from '@/pages/admin/CategoriesAdminPage';
import ItemsManagementAdminPage from '@/pages/admin/ItemsManagementAdminPage';
import OrdersManagementAdminPage from '@/pages/admin/OrdersManagementAdminPage';

import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/auth/LoginPage';
import ProfilePage from '@/pages/auth/ProfilePage';
import SignupPage from '@/pages/auth/SignUp';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import AboutUs from '@/pages/AboutUs';
import CatalogPage from '@/pages/CatalogPage';
import ContactUsPage from '@/pages/ContactUsPage';
import ProductDetailsPage from '@/pages/ProductDetailsPage';
import CartPage from '@/pages/CartPage';
import PageNotFound from '@/pages/PageNotFound';
import OrderHistoryPage from '@/pages/auth/OrderHistoryPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Admin routes */}
      <Route path="/cms-admin" element={<AdminPage />} />
      <Route path="/cms-admin/items" element={<ItemsAdminPage />} />
      <Route path="/cms-admin/categories" element={<CategoriesAdminPage />} />
      <Route path="/cms-admin/items/:id" element={<ItemsManagementAdminPage />} />
      <Route path="/cms-admin/orders-management" element={<OrdersManagementAdminPage />} />
      
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/product/:id" element={<ProductDetailsPage />} />
      <Route path="/about-us" element={<AboutUs /> }/>
      <Route path="/contact-us" element={<ContactUsPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/order-history" element={<OrderHistoryPage />} />
      
      {/* Auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AppRoutes;