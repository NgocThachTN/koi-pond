import React from 'react';
import { useAuth } from '@apis/authen';
import { useNavigate } from 'react-router-dom';
import { Button } from "@nextui-org/react";

function AdminPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p className="mb-4">Welcome to the admin page!</p>
      <Button 
        color="danger" 
        onClick={handleLogout}
      >
        Logout
      </Button>
    </div>
  );
}

export default AdminPage;
