import React from 'react';
import { Button, Card, CardBody, Input } from "@nextui-org/react";
import {FaSignOutAlt, FaSearch, FaHome, FaChartBar, FaBell, FaClock, FaHeart, FaWallet } from 'react-icons/fa';

interface StaffSidebarProps {
  activeItem: string;
  setActiveItem: (item: string) => void;
  onLogout: () => void;
}

const StaffSidebar: React.FC<StaffSidebarProps> = ({ activeItem, setActiveItem, onLogout }) => {
  const SidebarItem = ({ title, icon, isActive, onClick }: { title: string, icon: React.ReactNode, isActive: boolean, onClick: () => void }) => (
    <Button
      className={`justify-start ${isActive ? 'bg-primary/10 text-primary' : 'text-default-500'}`}
      variant="light"
      startContent={icon}
      onClick={onClick}
      fullWidth
    >
      {title}
    </Button>
  );

  return (
    <Card className="h-screen w-64 rounded-none">
      <CardBody className="p-4">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white font-bold">
            
          </div>
          <span className="font-semibold">Staff</span>
        </div>
        <Input
          classNames={{
            base: "mb-4",
            inputWrapper: "bg-default-100",
          }}
          placeholder="HTML CSS"
          startContent={<FaSearch className="text-default-400" />}
        />
        <div className="flex flex-col gap-2">
          <SidebarItem
            title="Dashboard"
            icon={<FaHome />}
            isActive={activeItem === 'dashboard'}
            onClick={() => setActiveItem('dashboard')}
          />
          <SidebarItem
            title="Projects Management"
            icon={<FaChartBar />}
            isActive={activeItem === 'project'}
            onClick={() => setActiveItem('project')}
          />
          <SidebarItem
            title="Orders"
            icon={<FaBell />}
            isActive={activeItem === 'orders'}
            onClick={() => setActiveItem('orders')}
          />
          <SidebarItem
            title="Koi Pond"
            icon={<FaClock />}
            isActive={activeItem === 'koi'}
            onClick={() => setActiveItem('koi')}
          />
          
          
          <Button 
          color="danger" 
          startContent={<FaSignOutAlt/>}
          onClick={onLogout}
          className="mt-4"
            >
              Logout
            </Button>
        </div>
        
      </CardBody>
    </Card>
  );
};

export default StaffSidebar;