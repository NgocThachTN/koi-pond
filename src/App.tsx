import React from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useAuth } from '@apis/authen';

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

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/homeuser" replace /> : <IndexPage />}
      />
      
      {/* Public routes */}
      <Route path="/docs" element={<DocsPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/services" element={<ServicesPage />} />

      {/* Public Blog */}
      <Route path="/blog/blog1" element={<Blog1Page />} />
      <Route path="/blog/blog2" element={<Blog2Page />} />
      <Route path="/blog/blog3" element={<Blog3Page />} />

      {/* Auth routes */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/homeuser" replace /> : <LoginPage />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/homeuser" replace /> : <SignUpPage />} />

      {/* Protected User routes */}
      <Route path="/homeuser" element={<ProtectedRoute><UserPage /></ProtectedRoute>} />
      <Route path="/bloguser" element={<ProtectedRoute><BlogPageUser /></ProtectedRoute>} />
      <Route path="/pricinguser" element={<ProtectedRoute><PricingPageUser /></ProtectedRoute>} />
      <Route path="/aboutuser" element={<ProtectedRoute><AboutPageUser /></ProtectedRoute>} />
      <Route path="/docsuser" element={<ProtectedRoute><DocsPageUser /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />

      {/* Admin Pages */}
      <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
      <Route path="/staff" element={<ProtectedRoute><StaffPage /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;