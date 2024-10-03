import React, { useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from '@apis/authen'; // Đảm bảo đường dẫn này chính xác

import IndexPage from "@/pages/home/index";
import DocsPage from "@/pages/Docs/docs";
import PricingPage from "@/pages/Pricing/pricing";
import BlogPage from "@/pages/Blog/blog";
import AboutPage from "@/pages/About/about";
import LoginPage from "@/pages/Login/login";
import SignUpPage from "@/pages/Singup/signup";
import ServicesPage from "@/pages/Services/services";
import UserPage from "./pages/home/homeuser";
import Blog1Page from "./components/Blog/blog1";
import Blog2Page from "./components/Blog/blog2";
import Blog3Page from "./components/Blog/blog3"; 
import BlogPageUser from "./pages/Blog/bloguser";
import PricingPageUser from "@/pages/Pricing/pricinguser";
import AboutPageUser from "./pages/About/aboutuser";
import DocsPageUser from "@/pages/Docs/docsuser"; 
import OrdersPage from "./pages/Orders/Orders";
import AdminPage from "./pages/Admin/admin";
import StaffPage from "./pages/Staff/staff";

const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return element;
};

const RootRedirect: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/homeuser" replace />;
  }
  
  return <IndexPage />;
};

function App() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/homeuser');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/homeuser" /> : <IndexPage />} />
      
      {/* Guest routes */}
      <Route element={<DocsPage />} path="/docs" />
      <Route element={<PricingPage />} path="/pricing"/>
      <Route element={<BlogPage />} path="/blog" />
      <Route element={<AboutPage />} path="/about" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<SignUpPage />} path="/signup" />
      <Route element={<ServicesPage />} path="/services" />

      {/* Guest Blog */}
      <Route element={<Blog1Page/>} path="/blog/blog1" />
      <Route element={<Blog2Page/>} path="/blog/blog2" />
      <Route element={<Blog3Page/>} path="/blog/blog3" />

      {/* Protected User routes */}
      <Route element={isAuthenticated ? <UserPage /> : <Navigate to="/login" />} path="/homeuser" />
      <Route element={isAuthenticated ? <BlogPageUser /> : <Navigate to="/login" />} path="/bloguser" />
      <Route element={isAuthenticated ? <PricingPageUser /> : <Navigate to="/login" />} path="/pricinguser" />
      <Route element={isAuthenticated ? <AboutPageUser /> : <Navigate to="/login" />} path="/aboutuser" />
      <Route element={isAuthenticated ? <DocsPageUser /> : <Navigate to="/login" />} path="/docsuser" />
      <Route element={isAuthenticated ? <OrdersPage /> : <Navigate to="/login" />} path="/orders"/>

      {/* Admin Pages */}
      <Route element={isAuthenticated ? <AdminPage /> : <Navigate to="/login" />} path="/admin" />
      <Route element={isAuthenticated ? <StaffPage /> : <Navigate to="/login" />} path="/staff"/>
    </Routes>
  );
}

export default App;
