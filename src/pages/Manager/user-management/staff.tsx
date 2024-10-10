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

const StaffManagement: React.FC = () => {
  const [staffMembers, setStaffMembers] = useState<AccountInfo[]>([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

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

  const renderCell = React.useCallback((staff: AccountInfo, columnKey: React.Key) => {
    const cellValue = staff[columnKey as keyof AccountInfo];

    switch (columnKey) {
      case "roleId":
        return (
          <Chip color="secondary" size="sm" variant="flat">
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
              <Button isIconOnly size="sm" variant="light">
                <EditIcon className="text-default-400" />
              </Button>
            </Tooltip>
            <Tooltip color="danger" content="Delete staff">
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
        <h1 className="text-2xl font-bold mb-4">Staff Management</h1>
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
      </div>
    </DefaultManagerLayout>
  );
};

export default StaffManagement;