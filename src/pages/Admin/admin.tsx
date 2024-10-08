import React, { useState } from 'react';
import { useAuth } from '@apis/authen';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Divider, Chip } from "@nextui-org/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/table";
import { FaUsers, FaShoppingCart, FaFish, FaTachometerAlt } from 'react-icons/fa';

function AdminPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('dashboard');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const users = [
    { id: 1, name: "Tony Reichert", role: "CEO", team: "Management", status: "active", age: "29" },
    { id: 2, name: "Zoey Lang", role: "Tech Lead", team: "Development", status: "paused", age: "25" },
    { id: 3, name: "Jane Fisher", role: "Designer", team: "Design", status: "active", age: "22" },
  ];

  const SidebarItem = ({ title, icon, isActive, onClick }) => (
    <Button
      className={`justify-start ${isActive ? 'bg-primary text-white' : ''}`}
      variant={isActive ? "solid" : "light"}
      startContent={icon}
      onClick={onClick}
      fullWidth
    >
      {title}
    </Button>
  );

  const renderContent = () => {
    switch (activeItem) {
      case 'dashboard':
        return <DashboardContent users={users} />;
      case 'users':
        return <UserManagementContent />;
      case 'orders':
        return <OrdersContent />;
      case 'koi':
        return <KoiPondContent />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Card className="h-screen w-64 rounded-none">
        <CardBody className="p-4">
          <div className="flex flex-col gap-2">
            <SidebarItem
              title="Dashboard"
              icon={<FaTachometerAlt />}
              isActive={activeItem === 'dashboard'}
              onClick={() => setActiveItem('dashboard')}
            />
            <SidebarItem
              title="User Management"
              icon={<FaUsers />}
              isActive={activeItem === 'users'}
              onClick={() => setActiveItem('users')}
            />
            <SidebarItem
              title="Orders"
              icon={<FaShoppingCart />}
              isActive={activeItem === 'orders'}
              onClick={() => setActiveItem('orders')}
            />
            <SidebarItem
              title="Koi Pond Construction"
              icon={<FaFish />}
              isActive={activeItem === 'koi'}
              onClick={() => setActiveItem('koi')}
            />
          </div>
        </CardBody>
      </Card>

      <div className="flex-1 overflow-auto">
        <header className="flex justify-between items-center p-4 bg-background">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button
            color="danger"
            variant="flat"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </header>
        <main className="p-4">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

const DashboardContent = ({ users }) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <StatCard title="Total Users" value="18,275" change="+2.5%" />
      <StatCard title="Revenue" value="$24,780" change="-0.7%" isNegative />
      <StatCard title="Active Projects" value="23" change="+1" />
    </div>

    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Recent Users</h3>
      </CardHeader>
      <Divider />
      <CardBody>
        <Table aria-label="Example static collection table">
          <TableHeader>
            <TableColumn>NAME</TableColumn>
            <TableColumn>ROLE</TableColumn>
            <TableColumn>TEAM</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>AGE</TableColumn>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.team}</TableCell>
                <TableCell>
                  <Chip color={user.status === 'active' ? 'success' : 'warning'} variant="flat">
                    {user.status}
                  </Chip>
                </TableCell>
                <TableCell>{user.age}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  </>
);

const StatCard = ({ title, value, change, isNegative = false }) => (
  <Card>
    <CardBody>
      <p className="text-sm text-default-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
      <p className={`text-sm ${isNegative ? 'text-danger' : 'text-success'}`}>{change}</p>
    </CardBody>
  </Card>
);

const UserManagementContent = () => (
  <Card>
    <CardHeader>
      <h3 className="text-lg font-semibold">User Management</h3>
    </CardHeader>
    <CardBody>
      <p>User management content goes here.</p>
    </CardBody>
  </Card>
);

const OrdersContent = () => (
  <Card>
    <CardHeader>
      <h3 className="text-lg font-semibold">Orders</h3>
    </CardHeader>
    <CardBody>
      <p>Orders content goes here.</p>
    </CardBody>
  </Card>
);

const KoiPondContent = () => (
  <Card>
    <CardHeader>
      <h3 className="text-lg font-semibold">Koi Pond Construction Process</h3>
    </CardHeader>
    <CardBody>
      <p>Koi pond construction process content goes here.</p>
    </CardBody>
  </Card>
);

export default AdminPage;