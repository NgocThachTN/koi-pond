import React, { useState, useEffect } from 'react';
import { useAuth } from '@apis/authen';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Divider, Chip, useDisclosure, Pagination } from "@nextui-org/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/table";
import StaffSidebar from '../../pages/Staff/StaffSidebar';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
// Giả sử bạn có API này để lấy đơn hàng
import { getUserRequestsApi, UserRequest } from '@/apis/user.api';

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
      case 'project-sample':
        return <ProjectsSampleContent />;
      case 'project-design':
        return <ProjectsDesignContent />;
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
const ProjectsSampleContent = () => {
  const [orders, setOrders] = useState<UserRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure()
  const [selectedOrder, setSelectedOrder] = React.useState<UserRequest | null>(null)
  const [page, setPage] = React.useState(1)
  const [error, setError] = React.useState<string | null>(null)
  const rowsPerPage = 10
  const pages = Math.ceil(orders.length / rowsPerPage)
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return orders.slice(start, end)
  }, [page, orders])
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getUserRequestsApi('userEmail');
        // Filter orders to include only those with designs or no designs
        const filteredOrders = data.filter(order =>
          (!order.designs.$values || order.designs.$values.length === 0) &&
          order.samples.$values && order.samples.$values.length > 0
        );
        setOrders(filteredOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);
  const renderCell = React.useCallback((order: UserRequest, columnKey: React.Key) => {
    switch (columnKey) {
      case "id":
        return order.$id
      case "requestName":
        return order.requestName
      case "userName":
        return order.users.$values[0]?.userName || 'N/A'
      case "type":
        if (order.designs.$values[0]) {
          return 'Design'
        } else if (order.samples.$values[0]) {
          return 'Sample'
        } else {
          return 'No Selection'
        }
      case "description":
        return order.description
      case "details":
        return (
          <Button size="sm" color="secondary" onClick={() => {
            setSelectedOrder(order)
            onDetailsOpen()
          }}>
            View Details
          </Button>
        )
      default:
        return 'N/A'
    }
  }, [onDetailsOpen])

  return (
    <div className="min-h-screen bg-background">

      <div className="container mx-auto py-8">
        <Card className="mb-8">
          <CardHeader className="flex justify-between">
            <h1 className="text-2xl font-bold">Koi Pond Construction Orders</h1>
            <Button color="secondary">Create New Order</Button>
          </CardHeader>
          <CardBody>
            {isLoading ? (
              <p>Loading orders...</p>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <>
                <Table aria-label="Koi Pond Construction Orders Table">
                  <TableHeader>
                    <TableColumn key="id">Order ID</TableColumn>
                    <TableColumn key="requestName">Project Name</TableColumn>
                    <TableColumn key="userName">User Name</TableColumn>
                    <TableColumn key="type">Type</TableColumn>
                    <TableColumn key="description">Description</TableColumn>
                    <TableColumn key="details">Details</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {items?.map((item) => (
                      <TableRow key={item.$id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                      </TableRow>
                    )) || <TableRow><TableCell>No data available</TableCell></TableRow>}
                  </TableBody>
                </Table>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-small text-default-400">
                    Total {orders.length} orders
                  </span>
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="secondary"
                    page={page}
                    total={pages}
                    onChange={setPage}
                  />
                </div>
              </>
            )}
          </CardBody>
        </Card>
      </div>

      <Modal
        isOpen={isDetailsOpen}
        onClose={onDetailsClose}
        size="3xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-bold">Order Details</h2>
              </ModalHeader>
              <ModalBody>
                {selectedOrder && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Customer Informationnn</h3>
                        <p><strong>Name:</strong> {selectedOrder.users.$values[0]?.userName || 'N/A'}</p>
                        <p><strong>Email:</strong> {selectedOrder.users.$values[0]?.email || 'N/A'}</p>
                        <p><strong>Phone:</strong> {selectedOrder.users.$values[0]?.phoneNumber || 'N/A'}</p>
                        <p><strong>Address:</strong> {selectedOrder.users.$values[0]?.address || 'N/A'}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Order Information</h3>
                        <p><strong>Order ID:</strong> {selectedOrder.$id}</p>
                        <p><strong>Project Name:</strong> {selectedOrder.requestName}</p>
                        <p><strong>Description:</strong> {selectedOrder.description}</p>
                      </div>
                    </div>
                    <Divider />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Design Details</h3>
                        {selectedOrder.designs.$values[0] ? (
                          <>
                            <p><strong>Name:</strong> {selectedOrder.designs.$values[0].designName}</p>
                            <p><strong>Size:</strong> {selectedOrder.designs.$values[0].designSize}</p>
                            <p><strong>Price:</strong> ${selectedOrder.designs.$values[0].designPrice}</p>
                          </>
                        ) : (
                          <p>No design selected</p>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Sample Details</h3>
                        {selectedOrder.samples.$values[0] ? (
                          <>
                            <p><strong>Name:</strong> {selectedOrder.samples.$values[0].sampleName}</p>
                            <p><strong>Size:</strong> {selectedOrder.samples.$values[0].sampleSize}</p>
                            <p><strong>Price:</strong> ${selectedOrder.samples.$values[0].samplePrice}</p>
                          </>
                        ) : (
                          <p>No sample selected</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

const ProjectsDesignContent = () => {
  const [orders, setOrders] = useState<UserRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure()
  const [selectedOrder, setSelectedOrder] = React.useState<UserRequest | null>(null)
  const [page, setPage] = React.useState(1)
  const [error, setError] = React.useState<string | null>(null)
  const rowsPerPage = 10
  const pages = Math.ceil(orders.length / rowsPerPage)
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return orders.slice(start, end)
  }, [page, orders])
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getUserRequestsApi('userEmail');
        // Filter orders to include only those with designs or no designs
        const filteredOrders = data.filter(order =>
          (!order.samples.$values || order.samples.$values.length === 0) &&
          order.designs.$values && order.designs.$values.length > 0
        );
        setOrders(filteredOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);
  const renderCell = React.useCallback((order: UserRequest, columnKey: React.Key) => {
    switch (columnKey) {
      case "id":
        return order.$id
      case "requestName":
        return order.requestName
      case "userName":
        return order.users.$values[0]?.userName || 'N/A'
      case "type":
        if (order.designs.$values[0]) {
          return 'Design'
        } else if (order.samples.$values[0]) {
          return 'Sample'
        } else {
          return 'No Selection'
        }
      case "description":
        return order.description
      case "details":
        return (
          <Button size="sm" color="secondary" onClick={() => {
            setSelectedOrder(order)
            onDetailsOpen()
          }}>
            View Details
          </Button>
        )
      default:
        return 'N/A'
    }
  }, [onDetailsOpen])

  return (
    <div className="min-h-screen bg-background">

      <div className="container mx-auto py-8">
        <Card className="mb-8">
          <CardHeader className="flex justify-between">
            <h1 className="text-2xl font-bold">Koi Pond Construction Orders</h1>
            <Button color="secondary">Create New Order</Button>
          </CardHeader>
          <CardBody>
            {isLoading ? (
              <p>Loading orders...</p>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <>
                <Table aria-label="Koi Pond Construction Orders Table">
                  <TableHeader>
                    <TableColumn key="id">Order ID</TableColumn>
                    <TableColumn key="requestName">Project Name</TableColumn>
                    <TableColumn key="userName">User Name</TableColumn>
                    <TableColumn key="type">Type</TableColumn>
                    <TableColumn key="description">Description</TableColumn>
                    <TableColumn key="details">Details</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {items?.map((item) => (
                      <TableRow key={item.$id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                      </TableRow>
                    )) || <TableRow><TableCell>No data available</TableCell></TableRow>}
                  </TableBody>
                </Table>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-small text-default-400">
                    Total {orders.length} orders
                  </span>
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="secondary"
                    page={page}
                    total={pages}
                    onChange={setPage}
                  />
                </div>
              </>
            )}
          </CardBody>
        </Card>
      </div>

      <Modal
        isOpen={isDetailsOpen}
        onClose={onDetailsClose}
        size="3xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-bold">Order Details</h2>
              </ModalHeader>
              <ModalBody>
                {selectedOrder && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Customer Informationnn</h3>
                        <p><strong>Name:</strong> {selectedOrder.users.$values[0]?.userName || 'N/A'}</p>
                        <p><strong>Email:</strong> {selectedOrder.users.$values[0]?.email || 'N/A'}</p>
                        <p><strong>Phone:</strong> {selectedOrder.users.$values[0]?.phoneNumber || 'N/A'}</p>
                        <p><strong>Address:</strong> {selectedOrder.users.$values[0]?.address || 'N/A'}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Order Information</h3>
                        <p><strong>Order ID:</strong> {selectedOrder.$id}</p>
                        <p><strong>Project Name:</strong> {selectedOrder.requestName}</p>
                        <p><strong>Description:</strong> {selectedOrder.description}</p>
                      </div>
                    </div>
                    <Divider />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Design Details</h3>
                        {selectedOrder.designs.$values[0] ? (
                          <>
                            <p><strong>Name:</strong> {selectedOrder.designs.$values[0].designName}</p>
                            <p><strong>Size:</strong> {selectedOrder.designs.$values[0].designSize}</p>
                            <p><strong>Price:</strong> ${selectedOrder.designs.$values[0].designPrice}</p>
                          </>
                        ) : (
                          <p>No design selected</p>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Sample Details</h3>
                        {selectedOrder.samples.$values[0] ? (
                          <>
                            <p><strong>Name:</strong> {selectedOrder.samples.$values[0].sampleName}</p>
                            <p><strong>Size:</strong> {selectedOrder.samples.$values[0].sampleSize}</p>
                            <p><strong>Price:</strong> ${selectedOrder.samples.$values[0].samplePrice}</p>
                          </>
                        ) : (
                          <p>No sample selected</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
const KoiPondContent = () => {
  const [orders, setOrders] = useState<UserRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure()
  const [selectedOrder, setSelectedOrder] = React.useState<UserRequest | null>(null)
  const [page, setPage] = React.useState(1)
  const [error, setError] = React.useState<string | null>(null)
  const rowsPerPage = 10
  const pages = Math.ceil(orders.length / rowsPerPage)
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return orders.slice(start, end)
  }, [page, orders])
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getUserRequestsApi('userEmail');
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);
  const renderCell = React.useCallback((order: UserRequest, columnKey: React.Key) => {
    switch (columnKey) {
      case "id":
        return order.$id
      case "requestName":
        return order.requestName
      case "userName":
        return order.users.$values[0]?.userName || 'N/A'
      case "type":
        if (order.designs.$values[0]) {
          return 'Design'
        } else if (order.samples.$values[0]) {
          return 'Sample'
        } else {
          return 'No Selection'
        }
      case "description":
        return order.description
      case "details":
        return (
          <Button size="sm" color="secondary" onClick={() => {
            setSelectedOrder(order)
            onDetailsOpen()
          }}>
            View Details
          </Button>
        )
      default:
        return 'N/A'
    }
  }, [onDetailsOpen])

  return (
    <div className="min-h-screen bg-background">

      <div className="container mx-auto py-8">
        <Card className="mb-8">
          <CardHeader className="flex justify-between">
            <h1 className="text-2xl font-bold">Koi Pond Construction Orders</h1>
            <Button color="secondary">Create New Order</Button>
          </CardHeader>
          <CardBody>
            {isLoading ? (
              <p>Loading orders...</p>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <>
                <Table aria-label="Koi Pond Construction Orders Table">
                  <TableHeader>
                    <TableColumn key="id">Order ID</TableColumn>
                    <TableColumn key="requestName">Project Name</TableColumn>
                    <TableColumn key="userName">User Name</TableColumn>
                    <TableColumn key="type">Type</TableColumn>
                    <TableColumn key="description">Description</TableColumn>
                    <TableColumn key="details">Details</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {items?.map((item) => (
                      <TableRow key={item.$id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                      </TableRow>
                    )) || <TableRow><TableCell>No data available</TableCell></TableRow>}
                  </TableBody>
                </Table>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-small text-default-400">
                    Total {orders.length} orders
                  </span>
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="secondary"
                    page={page}
                    total={pages}
                    onChange={setPage}
                  />
                </div>
              </>
            )}
          </CardBody>
        </Card>
      </div>

      <Modal
        isOpen={isDetailsOpen}
        onClose={onDetailsClose}
        size="3xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-bold">Order Details</h2>
              </ModalHeader>
              <ModalBody>
                {selectedOrder && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Customer Informationnn</h3>
                        <p><strong>Name:</strong> {selectedOrder.users.$values[0]?.userName || 'N/A'}</p>
                        <p><strong>Email:</strong> {selectedOrder.users.$values[0]?.email || 'N/A'}</p>
                        <p><strong>Phone:</strong> {selectedOrder.users.$values[0]?.phoneNumber || 'N/A'}</p>
                        <p><strong>Address:</strong> {selectedOrder.users.$values[0]?.address || 'N/A'}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Order Information</h3>
                        <p><strong>Order ID:</strong> {selectedOrder.$id}</p>
                        <p><strong>Project Name:</strong> {selectedOrder.requestName}</p>
                        <p><strong>Description:</strong> {selectedOrder.description}</p>
                      </div>
                    </div>
                    <Divider />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Design Details</h3>
                        {selectedOrder.designs.$values[0] ? (
                          <>
                            <p><strong>Name:</strong> {selectedOrder.designs.$values[0].designName}</p>
                            <p><strong>Size:</strong> {selectedOrder.designs.$values[0].designSize}</p>
                            <p><strong>Price:</strong> ${selectedOrder.designs.$values[0].designPrice}</p>
                          </>
                        ) : (
                          <p>No design selected</p>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Sample Details</h3>
                        {selectedOrder.samples.$values[0] ? (
                          <>
                            <p><strong>Name:</strong> {selectedOrder.samples.$values[0].sampleName}</p>
                            <p><strong>Size:</strong> {selectedOrder.samples.$values[0].sampleSize}</p>
                            <p><strong>Price:</strong> ${selectedOrder.samples.$values[0].samplePrice}</p>
                          </>
                        ) : (
                          <p>No sample selected</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default StaffPage;