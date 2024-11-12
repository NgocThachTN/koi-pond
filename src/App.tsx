crossOriginIsolated
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
import PricingUser from "@/pages/Pricing/pricinguser";
import PricingUser2 from "@/pages/Pricing/pricinguser2";
import AboutPageUser from "./pages/About/aboutuser";
import DocsPageUser from "@/pages/Docs/docsuser";
import OrdersPage from "./pages/Orders/Orders";
import AdminPage from "./pages/Manager/manager";
import StaffPage from "./pages/Staff/staff";
import StaffDashboard from "./pages/Staff/dashbroad/Dashbroad";
import DesignAndSampleStaff from "./pages/Staff/request-management/design-and-sample";
import MaintenanceStaffManagement from "./pages/Staff/request-management/maintenance";
import ContractStaffManagement from "./pages/Staff/contract-management/contract-management";
import MaintenanceManagementStaff from "./pages/Staff/maintenance-management/maintenance-management";
import PricingUser1 from "./pages/Pricing/pricinguser1";
// Import các trang Manager
import Dashboard from "@/pages/Manager/dashbroad/Dashbroad";
import StaffManagement from "@/pages/Manager/user-management/staff";
import CustomerManagement from "@/pages/Manager/user-management/customers";
import DesignAndSample from "@/pages/Manager/request-management/design-and-sample";
import MaintenanceManagement from "@/pages/Manager/request-management/maintenance";
import FeedbackManagement from "@/pages/Manager/feedback-management/feedback-management";
import Blog1PageUser from "./components/BlogUser/blog1user";
import ContractManagement from "@/pages/Manager/contract-management/contract-management";
import Blog3PageUser from "./components/BlogUser/blog3user";
import Blog2PageUser from "./components/BlogUser/blog2user";
import UnauthorizedPage from "@/pages/Unauthorized/unauthorized";

const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated, userRole } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);
  console.log('ProtectedRoute - userRole:', userRole);
  console.log('ProtectedRoute - current path:', location.pathname);

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

const RoleBasedRedirect: React.FC = () => {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  switch (userRole) {
    case 'Manager':
      return <Navigate to="/manager" replace />;
    case 'Staff':
      return <Navigate to="/staff" replace />;
    default:
      return <Navigate to="/homeuser" replace />;
  }
};

function App() {
  const { isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('Current route:', location.pathname);
    console.log('Current userRole:', userRole);
  }, [location, userRole]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? <RoleBasedRedirect /> : <IndexPage />
        }
      />

      {/* Guest routes */}
      <Route element={<GuestRoute element={<DocsPage />} />} path="/docs" />
      <Route element={<GuestRoute element={<PricingPage />} />} path="/pricing" />
      <Route element={<GuestRoute element={<PricingUser1 />} />} path="/pricinguser1" />
      <Route element={<GuestRoute element={<BlogPage />} />} path="/blog" />
      <Route element={<GuestRoute element={<AboutPage />} />} path="/about" />
      <Route element={<GuestRoute element={<LoginPage />} />} path="/login" />
      <Route element={<GuestRoute element={<SignUpPage />} />} path="/signup" />
      <Route element={<GuestRoute element={<ServicesPage />} />} path="/services" />

      {/* Guest Blog */}
      <Route element={<GuestRoute element={<Blog1Page />} />} path="/blog/blog1" />
      <Route element={<GuestRoute element={<Blog2Page />} />} path="/blog/blog2" />
      <Route element={<GuestRoute element={<Blog3Page />} />} path="/blog/blog3" />

      {/* Protected User routes */}
      <Route
        path="/homeuser"
        element={
          <ProtectedRoute
            element={
              userRole === 'Manager' ? <Navigate to="/manager" /> :
                userRole === 'Staff' ? <Navigate to="/staff" /> :
                  <UserPage />
            }
          />
        }
      />
      <Route
        path="/bloguser"
        element={
          <ProtectedRoute element={<BlogPageUser />} />
        }
      />
      <Route
        path="/pricinguser"
        element={
          <ProtectedRoute element={<PricingUser />} />
        }
      />
      <Route
        path="/aboutuser"
        element={
          <ProtectedRoute element={<AboutPageUser />} />
        }
      />
      <Route
        path="/docsuser"
        element={
          <ProtectedRoute element={<DocsPageUser />} />
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute element={<OrdersPage />} />
        }
      />
      <Route
        path="/pricinguser2"
        element={
          <ProtectedRoute element={<PricingUser2 />} />
        }
      />
      <Route
        path="/BlogUser/blog1user"
        element={
          <ProtectedRoute element={<Blog1PageUser />} />
        }
      />
      <Route element={isAuthenticated ? <BlogPageUser /> : <Navigate to="/bloguser" />} path="/bloguser" />
      <Route element={isAuthenticated ? <PricingUser /> : <Navigate to="/pricinguser" />} path="/pricinguser" />
      <Route element={isAuthenticated ? <AboutPageUser /> : <Navigate to="/aboutuser" />} path="/aboutuser" />
      <Route element={isAuthenticated ? <DocsPageUser /> : <Navigate to="/docsuser" />} path="/docsuser" />
      <Route element={isAuthenticated ? <OrdersPage /> : <Navigate to="/orders" />} path="/orders" />
      <Route element={isAuthenticated ? <PricingUser2 /> : <Navigate to="/pricinguser2" />} path="/pricinguser2" />
      <Route element={isAuthenticated ? <Blog1PageUser /> : <Navigate to="/BlogUser/blog1user" />} path="/BlogUser/blog1user" />
      <Route element={isAuthenticated ? <Blog2PageUser /> : <Navigate to="/BlogUser/blog2user" />} path="/BlogUser/blog2user" />
      <Route element={isAuthenticated ? <Blog3PageUser /> : <Navigate to="/BlogUser/blog3user" />} path="/BlogUser/blog3user" />

      {/* Manager Pages */}
      <Route
        path="/manager"
        element={
          <ProtectedRoute
            element={userRole === 'Manager' ? <AdminPage /> : <Navigate to="/unauthorized" />}
          />
        }
      />
      <Route
        path="/manager/dashboard"
        element={
          <ProtectedRoute
            element={userRole === 'Manager' ? <Dashboard /> : <Navigate to="/unauthorized" />}
          />
        }
      />
      <Route
        path="/manager/user-management/staff"
        element={
          <ProtectedRoute
            element={userRole === 'Manager' ? <StaffManagement /> : <Navigate to="/unauthorized" />}
          />
        }
      />
      <Route
        path="/manager/user-management/customers"
        element={
          <ProtectedRoute
            element={userRole === 'Manager' ? <CustomerManagement /> : <Navigate to="/unauthorized" />}
          />
        }
      />
      <Route
        path="/manager/request-management/design-and-sample"
        element={
          <ProtectedRoute
            element={userRole === 'Manager' ? <DesignAndSample /> : <Navigate to="/unauthorized" />}
          />
        }
      />
      <Route
        path="/manager/request-management/maintenance"
        element={
          <ProtectedRoute
            element={userRole === 'Manager' ? <MaintenanceManagement /> : <Navigate to="/unauthorized" />}
          />
        }
      />
      <Route
        path="/manager/feedback-management"
        element={
          <ProtectedRoute
            element={userRole === 'Manager' ? <FeedbackManagement /> : <Navigate to="/unauthorized" />}
          />
        }
      />
      <Route
        path="/manager/contract-management"
        element={
          <ProtectedRoute
            element={userRole === 'Manager' ? <ContractManagement /> : <Navigate to="/unauthorized" />}
          />
        }
      />

      {/* Staff Page */}
      <Route
        path="/staff"
        element={
          <ProtectedRoute
            element={userRole === 'Staff' ? <StaffPage /> : <Navigate to="/unauthorized" />}
          />
        }
      />

      <Route
        path="/staff/dashboard"
        element={
          <ProtectedRoute
            element={userRole === 'Staff' ? <StaffDashboard /> : <Navigate to="/unauthorized" />}
          />
        }
      />

      <Route
        path="/staff/request-management/design-and-sample"
        element={
          <ProtectedRoute
            element={userRole === 'Staff' ? <DesignAndSampleStaff /> : <Navigate to="/unauthorized" />}
          />
        }
      />
      <Route
        path="/staff/request-management/maintenance"
        element={
          <ProtectedRoute
            element={userRole === 'Staff' ? <MaintenanceStaffManagement /> : <Navigate to="/unauthorized" />}
          />
        }
      />
      <Route
        path="/staff/contract-management"
        element={
          <ProtectedRoute
            element={userRole === 'Staff' ? <ContractStaffManagement /> : <Navigate to="/unauthorized" />}
          />
        }
      />
      <Route
        path="/staff/maintenance-management"
        element={
          <ProtectedRoute
            element={userRole === 'Staff' ? <MaintenanceManagementStaff /> : <Navigate to="/unauthorized" />}
          />
        }
      />

      {/* Catch-all routes */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
}

export default App;