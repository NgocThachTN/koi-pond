import React from 'react';
import { useAuth } from '@/apis/authen'; // Đảm bảo đường dẫn này chính xác
import { useNavigate } from 'react-router-dom';
import { Button } from "@nextui-org/react"; // Giả sử bạn đang sử dụng NextUI

function StaffPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Staff Dashboard</h1>
      <div className="mb-4">
        {/* Nội dung trang Staff ở đây */}
        <p>Welcome to the Staff page!</p>
      </div>
      <Button 
        color="danger" 
        onClick={handleLogout}
      >
        Logout
      </Button>
    </div>
  );
}

export default StaffPage;
