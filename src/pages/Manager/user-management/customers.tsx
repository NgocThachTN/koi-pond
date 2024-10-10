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
  Pagination
} from "@nextui-org/react";
import { EyeIcon, EditIcon, DeleteIcon } from "@nextui-org/shared-icons";
import { getAccountInfo, AccountInfo } from '@/apis/manager.api';

const columns = [
  { name: "NAME", uid: "name" },
  { name: "PHONE", uid: "phoneNumber" },
  { name: "ADDRESS", uid: "address" },
  { name: "EMAIL", uid: "email" },
  { name: "ROLE", uid: "roleId" },
  { name: "ACTIONS", uid: "actions" },
];

const CustomerManagement: React.FC = () => {
  const [users, setUsers] = useState<AccountInfo[]>([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 7;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAccountInfo();
        const customers = data.filter(user => user.roleId === 1);
        
        // Remove duplicates based on email
        const uniqueCustomers = customers.reduce((acc: AccountInfo[], current) => {
          const x = acc.find(item => item.email === current.email);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);

        setUsers(uniqueCustomers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const pages = Math.ceil(users.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return users.slice(start, end);
  }, [page, users]);

  const renderCell = React.useCallback((user: AccountInfo, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof AccountInfo];

    switch (columnKey) {
      case "roleId":
        return (
          <Chip color="primary" size="sm" variant="flat">
            Customer
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
              <Button isIconOnly size="sm" variant="light">
                <EditIcon className="text-default-400" />
              </Button>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <Button isIconOnly size="sm" variant="light">
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
        <h1 className="text-2xl font-bold mb-4">Customer Management</h1>
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
      </div>
    </DefaultManagerLayout>
  );
};

export default CustomerManagement;