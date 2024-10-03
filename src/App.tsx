import React, { useEffect } from "react";
import { Route, Routes, Navigate, useNavigate, useLocation } from "react-router-dom";
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

const GuestRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/homeuser" replace />;
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

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <GuestRoute 
            element={isAuthenticated ? <Navigate to="/homeuser" /> : <IndexPage />} 
          />
        } 
      />
      
      {/* Guest routes */}
      <Route element={<GuestRoute element={<DocsPage />} />} path="/docs" />
      <Route element={<GuestRoute element={<PricingPage />} />} path="/pricing"/>
      <Route element={<GuestRoute element={<BlogPage />} />} path="/blog" />
      <Route element={<GuestRoute element={<AboutPage />} />} path="/about" />
      <Route element={<GuestRoute element={<LoginPage />} />} path="/login" />
      <Route element={<GuestRoute element={<SignUpPage />} />} path="/signup" />
      <Route element={<GuestRoute element={<ServicesPage />} />} path="/services" />

      {/* Guest Blog */}
      <Route element={<GuestRoute element={<Blog1Page/>} />} path="/blog/blog1" />
      <Route element={<GuestRoute element={<Blog2Page/>} />} path="/blog/blog2" />
      <Route element={<GuestRoute element={<Blog3Page/>} />} path="/blog/blog3" />

      {/* Protected User routes */}
      <Route element={isAuthenticated ? <UserPage /> : <Navigate to="/homeuser" />} path="/homeuser" />
      <Route element={isAuthenticated ? <BlogPageUser /> : <Navigate to="/bloguser" />} path="/bloguser" />
      <Route element={isAuthenticated ? <PricingPageUser /> : <Navigate to="/pricinguser" />} path="/pricinguser" />
      <Route element={isAuthenticated ? <AboutPageUser /> : <Navigate to="/aboutuser" />} path="/aboutuser" />
      <Route element={isAuthenticated ? <DocsPageUser /> : <Navigate to="/docsuser" />} path="/docsuser" />
      <Route element={isAuthenticated ? <OrdersPage /> : <Navigate to="/orders" />} path="/orders"/>

      {/* Admin Pages */}
      <Route element={isAuthenticated ? <AdminPage /> : <Navigate to="/login" />} path="/admin" />
      <Route element={isAuthenticated ? <StaffPage /> : <Navigate to="/login" />} path="/staff"/>
    </Routes>
  );
}

export default App;