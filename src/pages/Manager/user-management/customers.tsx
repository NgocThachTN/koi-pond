import React, { useState, useEffect, useMemo } from 'react';
import DefaultManagerLayout from "@/layouts/defaultmanager";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  Button,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
  Select,
  SelectItem
} from "@nextui-org/react";
import { EyeIcon, EditIcon, DeleteIcon, SearchIcon } from "@nextui-org/shared-icons";
import { FaPlus } from 'react-icons/fa';
import { getAccountInfo, AccountInfo, updateAccountInfo, deleteAccountInfo, createAccountInfo, CreateAccountInfo } from '@/apis/manager.api';

// Add this type definition
type ExtendedAccountInfo = AccountInfo & { status: string };

const columns = [
  { name: "NO", uid: "no" },
  { name: "NAME", uid: "name" },
  { name: "PHONE", uid: "phoneNumber" },
  { name: "ADDRESS", uid: "address" },
  { name: "EMAIL", uid: "email" },
  { name: "ROLE", uid: "roleId" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

const CustomerManagement: React.FC = () => {
  const [users, setUsers] = useState<ExtendedAccountInfo[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ExtendedAccountInfo[]>([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<AccountInfo & { status: string } | null>(null);
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const [newCustomer, setNewCustomer] = useState<CreateAccountInfo>({
    accountId: 0,
    name: "",
    phoneNumber: "",
    address: "",
    userName: "",
    email: "",
    password: "",
    roleId: 1,
    status: "Active" // Add default status
  });
  const rowsPerPage = 7;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAccountInfo();
        const customers = data.filter(user => user.roleId === 1);
        setUsers(customers);
        setFilteredUsers(customers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredUsers(filtered);
    setPage(1);
  }, [searchTerm, users]);

  const pages = Math.ceil(filteredUsers.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredUsers.slice(start, end).map((user, index) => ({
      ...user,
      no: start + index + 1
    }));
  }, [page, filteredUsers]);

  const handleEdit = (user: AccountInfo) => {
    setSelectedUser(user);
    onEditOpen();
  };

  const handleDelete = (user: AccountInfo) => {
    setSelectedUser(user);
    onDeleteOpen();
  };

  const handleUpdateUser = async () => {
    if (selectedUser) {
      try {
        await updateAccountInfo(selectedUser.accountId, selectedUser);
        const updatedUsers = users.map(user => 
          user.accountId === selectedUser.accountId ? {...user, ...selectedUser} : user
        );
        setUsers(updatedUsers);
        onEditClose();
      } catch (error) {
        console.error("Failed to update user:", error);
      }
    }
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      try {
        await deleteAccountInfo(selectedUser.accountId);
        const updatedUsers = users.filter(user => user.accountId !== selectedUser.accountId);
        setUsers(updatedUsers);
        onDeleteClose();
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  const handleCreateCustomer = async () => {
    try {
      const customerToCreate = {
        ...newCustomer,
        status: "Active" // Đảm bảo status luôn được gán là "Active"
      };
      await createAccountInfo(customerToCreate);
      // Refresh customer list after creating a new one
      const data = await getAccountInfo();
      const customers = data.filter(user => user.roleId === 1);
      setUsers(customers);
      onCreateClose();
      // Reset form
      setNewCustomer({
        accountId: 0,
        name: "",
        phoneNumber: "",
        address: "",
        userName: "",
        email: "",
        password: "",
        roleId: 1,
        status: "Active" // Reset status to default
      });
    } catch (error) {
      console.error("Failed to create customer:", error);
    }
  };

  const renderCell = React.useCallback((user: ExtendedAccountInfo & { no: number }, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof (ExtendedAccountInfo & { no: number })];

    switch (columnKey) {
      case "no":
        return <div>{user.no}</div>;
      case "roleId":
        return (
          <Chip color="primary" size="sm" variant="flat">
            Customer
          </Chip>
        );
      case "status":
        return (
          <Chip color={user.status === "Active" ? "success" : "danger"} size="sm" variant="flat">
            {user.status}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Details">
              <Button isIconOnly size="sm" variant="light">
                <EyeIcon className="text-default-400" />
              </Button>
            </Tooltip>
            <Tooltip content="Edit user">
              <Button isIconOnly size="sm" variant="light" onPress={() => handleEdit(user)}>
                <EditIcon className="text-default-400" />
              </Button>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <Button isIconOnly size="sm" variant="light" onPress={() => handleDelete(user)}>
                <DeleteIcon className="text-danger" />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue as string;
    }
  }, []);

  return (
    <DefaultManagerLayout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Customer Management</h1>
          <div className="flex gap-4">
            <Input
              isClearable
              className="w-full sm:max-w-[44%]"
              placeholder="Search by name..."
              startContent={<SearchIcon />}
              value={searchTerm}
              onClear={() => setSearchTerm("")}
              onValueChange={setSearchTerm}
            />
            <Button color="primary" endContent={<FaPlus />} onPress={onCreateOpen}>
              Add New Customer
            </Button>
          </div>
        </div>
        <Table 
          aria-label="Customer table with custom cells"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          }
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={items}>
            {(item) => (
              <TableRow key={item.$id}>
                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Modal isOpen={isEditOpen} onClose={onEditClose}>
          <ModalContent>
            <ModalHeader>Edit User</ModalHeader>
            <ModalBody>
              {selectedUser && (
                <>
                  <Input
                    label="Name"
                    value={selectedUser.name}
                    onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                  />
                  <Input
                    label="Phone"
                    value={selectedUser.phoneNumber}
                    onChange={(e) => setSelectedUser({...selectedUser, phoneNumber: e.target.value})}
                  />
                  <Input
                    label="Address"
                    value={selectedUser.address}
                    onChange={(e) => setSelectedUser({...selectedUser, address: e.target.value})}
                  />
                  <Input
                    label="Email"
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                  />
                  <Select
                    label="Status"
                    selectedKeys={[selectedUser.status]}
                    onChange={(e) => setSelectedUser({...selectedUser, status: e.target.value})}
                  >
                    <SelectItem key="Active" value="Active">Active</SelectItem>
                    <SelectItem key="Inactive" value="Inactive">Inactive</SelectItem>
                  </Select>
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={handleUpdateUser}>
                Save Changes
              </Button>
              <Button color="danger" variant="light" onPress={onEditClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
          <ModalContent>
            <ModalHeader>Delete User</ModalHeader>
            <ModalBody>
              Are you sure you want to delete this user?
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={handleDeleteUser}>
                Delete
              </Button>
              <Button color="primary" variant="light" onPress={onDeleteClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal isOpen={isCreateOpen} onClose={onCreateClose}>
          <ModalContent>
            <ModalHeader>Create New Customer</ModalHeader>
            <ModalBody>
              <Input
                label="Name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
              />
              <Input
                label="Phone"
                value={newCustomer.phoneNumber}
                onChange={(e) => setNewCustomer({...newCustomer, phoneNumber: e.target.value})}
              />
              <Input
                label="Address"
                value={newCustomer.address}
                onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
              />
              <Input
                label="Username"
                value={newCustomer.userName}
                onChange={(e) => setNewCustomer({...newCustomer, userName: e.target.value})}
              />
              <Input
                label="Email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
              />
              <Input
                label="Password"
                type="password"
                value={newCustomer.password}
                onChange={(e) => setNewCustomer({...newCustomer, password: e.target.value})}
              />
              <Select
                label="Status"
                selectedKeys={[newCustomer.status]}
                onChange={(e) => setNewCustomer({...newCustomer, status: e.target.value})}
              >
                <SelectItem key="Active" value="Active">Active</SelectItem>
                <SelectItem key="Inactive" value="Inactive">Inactive</SelectItem>
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={handleCreateCustomer}>
                Create Customer
              </Button>
              <Button color="danger" variant="light" onPress={onCreateClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </DefaultManagerLayout>
  );
};

export default CustomerManagement;
