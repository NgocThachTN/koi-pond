import React, { useState } from 'react';
import { useAuth } from '@apis/authen';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Divider, Chip } from "@nextui-org/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/table";
import StaffSidebar from '../../pages/Staff/StaffSidebar';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';

function StaffPage() {
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

  const renderContent = () => {
    switch (activeItem) {
      case 'dashboard':
        return <DashboardContent users={users} />;
      case 'project':
        return <ProjectsManagementContent />;
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
      <StaffSidebar
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        onLogout={handleLogout}
      />

      <div className="flex-1 overflow-auto">
        <header className="flex justify-between items-center p-4 bg-background">
          <h1 className="text-2xl font-bold"></h1>
         
        </header>
        <main className="p-4">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

const DashboardContent = ({ users }: { users: User[] }) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <StatCard title="Total Users" value={18275} change={2.5} />
      <StatCard title="Revenue" value={24780} change={-0.7} isNegative />
      <StatCard title="Active Projects" value={23} change={1} />
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

const StatCard = ({ title, value, change, isNegative = false }: {
  title: string;
  value: number | string;
  change: number;
  isNegative?: boolean;
}) => (
  <Card>
    <CardBody>
      <p className="text-sm text-default-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
      <p className={`text-sm ${isNegative ? 'text-danger' : 'text-success'}`}>{change}</p>
    </CardBody>
  </Card>
);
const ProjectsManagementContent = () => {
  const [isOpenSample, setIsOpenSample] = useState(false);
  const [isOpenDesign, setIsOpenDesign] = useState(false);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-1">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Sample</h3>
          </CardHeader>
          <CardBody>
            <Button onPress={() => setIsOpenSample(true)}>Open Sample Popup</Button>
          </CardBody>
        </Card>
        <Modal isOpen={isOpenSample} onOpenChange={setIsOpenSample}>
          <ModalContent>
            <ModalHeader>Sample Popup</ModalHeader>
            <ModalBody>
              <p>This is the content of the Sample popup.</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={() => setIsOpenSample(false)}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
      <div className="col-span-1">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Design</h3>
          </CardHeader>
          <CardBody>
            <Button onPress={() => setIsOpenDesign(true)}>Open Design Popup</Button>
          </CardBody>
        </Card>
        <Modal isOpen={isOpenDesign} onOpenChange={setIsOpenDesign}>
          <ModalContent>
            <ModalHeader>Design Popup</ModalHeader>
            <ModalBody>
              <p>This is the content of the Design popup.</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={() => setIsOpenDesign(false)}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

const OrdersContent = () => (
  <div>
    <h1>Orders</h1>
  </div>
);
const KoiPondContent = () => (
  <div>
    <h1>Koi Pond</h1>
  </div>
);

export default StaffPage;