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
  useDisclosure
} from "@nextui-org/react";
import { EyeIcon, EditIcon, DeleteIcon } from "@nextui-org/shared-icons";
import { FaPlus } from 'react-icons/fa';
import { getAccountInfo, AccountInfo, updateAccountInfo, deleteAccountInfo, createAccountInfo, CreateAccountInfo } from '@/apis/manager.api';

const columns = [
  { name: "NAME", uid: "name" },
  { name: "PHONE", uid: "phoneNumber" },
  { name: "ADDRESS", uid: "address" },
  { name: "EMAIL", uid: "email" },
  { name: "ROLE", uid: "roleId" },
  { name: "ACTIONS", uid: "actions" },
];

const StaffManagement: React.FC = () => {
  const [staffMembers, setStaffMembers] = useState<AccountInfo[]>([]);
  const [page, setPage] = useState(1);
  const [selectedStaff, setSelectedStaff] = useState<AccountInfo | null>(null);
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const [newStaff, setNewStaff] = useState<CreateAccountInfo>({
    accountId: 0,
    name: "",
    phoneNumber: "",
    address: "",
    userName: "",
    email: "",
    password: "",
    roleId: 3 // Mặc định là role staff
  });
  const rowsPerPage = 7;

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await getAccountInfo();
        const staff = data.filter(user => user.roleId === 3);
        
        // Remove duplicates based on email
        const uniqueStaff = staff.reduce((acc: AccountInfo[], current) => {
          const x = acc.find(item => item.email === current.email);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);

        setStaffMembers(uniqueStaff);
      } catch (error) {
        console.error("Failed to fetch staff:", error);
      }
    };

    fetchStaff();
  }, []);

  const pages = Math.ceil(staffMembers.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return staffMembers.slice(start, end);
  }, [page, staffMembers]);

  const handleEdit = (staff: AccountInfo) => {
    setSelectedStaff(staff);
    onEditOpen();
  };

  const handleDelete = (staff: AccountInfo) => {
    setSelectedStaff(staff);
    onDeleteOpen();
  };

  const handleUpdateStaff = async () => {
    if (selectedStaff) {
      try {
        await updateAccountInfo(selectedStaff.accountId, selectedStaff);
        const updatedStaff = staffMembers.map(staff => 
          staff.accountId === selectedStaff.accountId ? selectedStaff : staff
        );
        setStaffMembers(updatedStaff);
        onEditClose();
      } catch (error) {
        console.error("Failed to update staff:", error);
      }
    }
  };

  const handleDeleteStaff = async () => {
    if (selectedStaff) {
      try {
        await deleteAccountInfo(selectedStaff.accountId);
        const updatedStaff = staffMembers.filter(staff => staff.accountId !== selectedStaff.accountId);
        setStaffMembers(updatedStaff);
        onDeleteClose();
      } catch (error) {
        console.error("Failed to delete staff:", error);
      }
    }
  };

  const handleCreateStaff = async () => {
    try {
      await createAccountInfo(newStaff);
      // Refresh danh sách nhân viên sau khi tạo mới
      const data = await getAccountInfo();
      const staff = data.filter(user => user.roleId === 3);
      setStaffMembers(staff);
      onCreateClose();
      // Reset form
      setNewStaff({
        accountId: 0,
        name: "",
        phoneNumber: "",
        address: "",
        userName: "",
        email: "",
        password: "",
        roleId: 3
      });
    } catch (error) {
      console.error("Failed to create staff:", error);
    }
  };

  const renderCell = React.useCallback((staff: AccountInfo, columnKey: React.Key) => {
    const cellValue = staff[columnKey as keyof AccountInfo];

    switch (columnKey) {
      case "roleId":
        return (
          <Chip color="primary" size="sm" variant="flat">
            Staff
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
            <Tooltip content="Edit staff">
              <Button isIconOnly size="sm" variant="light" onPress={() => handleEdit(staff)}>
                <EditIcon className="text-default-400" />
              </Button>
            </Tooltip>
            <Tooltip color="danger" content="Delete staff">
              <Button isIconOnly size="sm" variant="light" onPress={() => handleDelete(staff)}>
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
          <h1 className="text-2xl font-bold">Staff Management</h1>
          <Button color="primary" endContent={<FaPlus />} onPress={onCreateOpen}>
            Add New Staff
          </Button>
        </div>
        <Table 
          aria-label="Staff table with custom cells"
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
            <ModalHeader>Edit Staff</ModalHeader>
            <ModalBody>
              {selectedStaff && (
                <>
                  <Input
                    label="Name"
                    value={selectedStaff.name}
                    onChange={(e) => setSelectedStaff({...selectedStaff, name: e.target.value})}
                  />
                  <Input
                    label="Phone"
                    value={selectedStaff.phoneNumber}
                    onChange={(e) => setSelectedStaff({...selectedStaff, phoneNumber: e.target.value})}
                  />
                  <Input
                    label="Address"
                    value={selectedStaff.address}
                    onChange={(e) => setSelectedStaff({...selectedStaff, address: e.target.value})}
                  />
                  <Input
                    label="Email"
                    value={selectedStaff.email}
                    onChange={(e) => setSelectedStaff({...selectedStaff, email: e.target.value})}
                  />
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={handleUpdateStaff}>
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
            <ModalHeader>Delete Staff</ModalHeader>
            <ModalBody>
              Are you sure you want to delete this staff member?
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={handleDeleteStaff}>
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
            <ModalHeader>Create New Staff</ModalHeader>
            <ModalBody>
              <Input
                label="Name"
                value={newStaff.name}
                onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
              />
              <Input
                label="Phone"
                value={newStaff.phoneNumber}
                onChange={(e) => setNewStaff({...newStaff, phoneNumber: e.target.value})}
              />
              <Input
                label="Address"
                value={newStaff.address}
                onChange={(e) => setNewStaff({...newStaff, address: e.target.value})}
              />
              <Input
                label="Username"
                value={newStaff.userName}
                onChange={(e) => setNewStaff({...newStaff, userName: e.target.value})}
              />
              <Input
                label="Email"
                value={newStaff.email}
                onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
              />
              <Input
                label="Password"
                type="password"
                value={newStaff.password}
                onChange={(e) => setNewStaff({...newStaff, password: e.target.value})}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={handleCreateStaff}>
                Create Staff
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

export default StaffManagement;