import React from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useAuth } from '@apis/authen';

import IndexPage from "@/pages/home/index";
import LoginPage from "@/pages/Login/login";
import SignUpPage from "@/pages/Singup/signup";
import UserPage from "./pages/home/homeuser";
import AdminPage from "./pages/Admin/admin";
import StaffPage from "./pages/Staff/staff";
import UnauthorizedPage from "./pages/Unauthorized/unauthorized";

const ProtectedRoute: React.FC<{ element: React.ReactElement, allowedRole: string }> = ({ element, allowedRole }) => {
  const { isAuthenticated, userRole } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - Current userRole:', userRole);
  console.log('ProtectedRoute - Allowed Role:', allowedRole);

  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (userRole !== allowedRole) {
    console.log('User role does not match allowed role, redirecting to unauthorized');
    return <Navigate to="/unauthorized" replace />;
  }

  console.log('Access granted');
  return element;
};

const GuestRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated, userRole } = useAuth();

  if (isAuthenticated) {
    switch (userRole) {
      case 'user':
        return <Navigate to="/homeuser" replace />;
      case 'Admin':
        return <Navigate to="/admin" replace />;
      case 'staff':
        return <Navigate to="/staff" replace />;
      default:
        return <Navigate to="/unauthorized" replace />;
    }
  }

  return element;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<GuestRoute element={<IndexPage />} />} />
      <Route path="/login" element={<GuestRoute element={<LoginPage />} />} />
      <Route path="/signup" element={<GuestRoute element={<SignUpPage />} />} />

      {/* Protected routes */}
      <Route path="/homeuser" element={<ProtectedRoute element={<UserPage />} allowedRole="user" />} />
      <Route path="/admin" element={<ProtectedRoute element={<AdminPage />} allowedRole="Admin" />} />
      <Route path="/staff" element={<ProtectedRoute element={<StaffPage />} allowedRole="staff" />} />

      {/* Unauthorized Page */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;