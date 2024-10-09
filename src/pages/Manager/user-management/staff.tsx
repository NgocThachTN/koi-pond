import React, { useState } from 'react';
import DefaultManagerLayout from "@/layouts/defaultmanager";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  Button,
  Pagination
} from "@nextui-org/react";
import { EyeIcon, EditIcon, DeleteIcon } from "@nextui-org/shared-icons";

const staffMembers = [
  { id: 1, name: "John Doe", phoneNumber: "123-456-7890", address: "123 Staff St, Worktown, USA", userName: "johndoe", email: "john.doe@example.com", password: "********", roleId: 2 },
  { id: 2, name: "Jane Smith", phoneNumber: "234-567-8901", address: "456 Employee Ave, Jobcity, USA", userName: "janesmith", email: "jane.smith@example.com", password: "********", roleId: 2 },
  { id: 3, name: "Bob Johnson", phoneNumber: "345-678-9012", address: "789 Worker Ln, Laborville, USA", userName: "bobjohnson", email: "bob.johnson@example.com", password: "********", roleId: 2 },
  { id: 4, name: "Alice Brown", phoneNumber: "456-789-0123", address: "321 Staff Rd, Employeetown, USA", userName: "alicebrown", email: "alice.brown@example.com", password: "********", roleId: 2 },
  { id: 5, name: "Charlie Davis", phoneNumber: "567-890-1234", address: "654 Job St, Workerville, USA", userName: "charliedavis", email: "charlie.davis@example.com", password: "********", roleId: 2 },
  { id: 6, name: "Eva Wilson", phoneNumber: "678-901-2345", address: "987 Employee Blvd, Stafford, USA", userName: "evawilson", email: "eva.wilson@example.com", password: "********", roleId: 2 },
  { id: 7, name: "Frank Miller", phoneNumber: "789-012-3456", address: "246 Work Ave, Jobtown, USA", userName: "frankmiller", email: "frank.miller@example.com", password: "********", roleId: 2 },
  { id: 8, name: "Grace Lee", phoneNumber: "890-123-4567", address: "135 Staff Cir, Employeeville, USA", userName: "gracelee", email: "grace.lee@example.com", password: "********", roleId: 2 },
  { id: 9, name: "Henry Taylor", phoneNumber: "901-234-5678", address: "864 Job Rd, Labortown, USA", userName: "henrytaylor", email: "henry.taylor@example.com", password: "********", roleId: 2 },
  { id: 10, name: "Ivy Martin", phoneNumber: "012-345-6789", address: "975 Worker St, Staffville, USA", userName: "ivymartin", email: "ivy.martin@example.com", password: "********", roleId: 2 },
];

const columns = [
  { name: "ID", uid: "id" },
  { name: "NAME", uid: "name" },
  { name: "PHONE", uid: "phoneNumber" },
  { name: "ADDRESS", uid: "address" },
  { name: "USERNAME", uid: "userName" },
  { name: "EMAIL", uid: "email" },
  { name: "ROLE", uid: "roleId" },
  { name: "ACTIONS", uid: "actions" },
];

const StaffManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const pages = Math.ceil(staffMembers.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return staffMembers.slice(start, end);
  }, [page]);

  const renderCell = React.useCallback((staff: any, columnKey: React.Key) => {
    const cellValue = staff[columnKey as keyof typeof staff];

    switch (columnKey) {
      case "id":
        return <div className="text-bold">{cellValue}</div>;
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: `https://i.pravatar.cc/150?u=${staff.email}` }}
            description={staff.email}
            name={cellValue}
          >
            {staff.email}
          </User>
        );
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
        return cellValue;
    }
  }, []);

  return (
    <DefaultManagerLayout>
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-4">Staff Management</h1>
        <Table 
          aria-label="Example table with custom cells"
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
              <TableRow key={item.id}>
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