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

const users = [
  { id: 1, name: "Tony Reichert", phoneNumber: "123-456-7890", address: "123 Main St, Anytown, USA", userName: "tonyreich", email: "tony.reichert@example.com", password: "********", roleId: 3 },
  { id: 2, name: "Zoey Lang", phoneNumber: "234-567-8901", address: "456 Elm St, Somewhere, USA", userName: "zoeylang", email: "zoey.lang@example.com", password: "********", roleId: 3 },
  { id: 3, name: "Jane Fisher", phoneNumber: "345-678-9012", address: "789 Oak St, Nowhere, USA", userName: "janefisher", email: "jane.fisher@example.com", password: "********", roleId: 3 },
  { id: 4, name: "William Howard", phoneNumber: "456-789-0123", address: "321 Pine St, Elsewhere, USA", userName: "willhoward", email: "william.howard@example.com", password: "********", roleId: 3 },
  { id: 5, name: "Kristen Copper", phoneNumber: "567-890-1234", address: "654 Maple St, Anywhere, USA", userName: "kristenc", email: "kristen.copper@example.com", password: "********", roleId: 3 },
  { id: 6, name: "Mike Johnson", phoneNumber: "678-901-2345", address: "987 Cedar St, Someplace, USA", userName: "mikej", email: "mike.johnson@example.com", password: "********", roleId: 3 },
  { id: 7, name: "Sarah Parker", phoneNumber: "789-012-3456", address: "246 Birch St, Othertown, USA", userName: "sarahp", email: "sarah.parker@example.com", password: "********", roleId: 3 },
  { id: 8, name: "Steve Rogers", phoneNumber: "890-123-4567", address: "135 Walnut St, Anotherplace, USA", userName: "stever", email: "steve.rogers@example.com", password: "********", roleId: 3 },
  { id: 9, name: "Natasha Romanoff", phoneNumber: "901-234-5678", address: "864 Ash St, Somewhere Else, USA", userName: "natashar", email: "natasha.romanoff@example.com", password: "********", roleId: 3 },
  { id: 10, name: "Bruce Banner", phoneNumber: "012-345-6789", address: "975 Oak St, Anytown, USA", userName: "bruceb", email: "bruce.banner@example.com", password: "********", roleId: 3 },
  { id: 11, name: "Peter Parker", phoneNumber: "123-456-7891", address: "321 Elm St, New York, USA", userName: "peterp", email: "peter.parker@example.com", password: "********", roleId: 3 },
  { id: 12, name: "Mary Jane Watson", phoneNumber: "234-567-8902", address: "654 Pine St, New York, USA", userName: "maryjanew", email: "maryjane.watson@example.com", password: "********", roleId: 3 },
  { id: 13, name: "Tony Stark", phoneNumber: "345-678-9013", address: "789 Stark Tower, New York, USA", userName: "tonystark", email: "tony.stark@example.com", password: "********", roleId: 3 },
  { id: 14, name: "Steve Rogers", phoneNumber: "456-789-0124", address: "101 America St, Washington, USA", userName: "steverogers", email: "steve.rogers@example.com", password: "********", roleId: 3 },
  { id: 15, name: "Thor Odinson", phoneNumber: "567-890-1235", address: "1 Asgard Rd, Norway", userName: "thorodinson", email: "thor.odinson@example.com", password: "********", roleId: 3 },
  { id: 16, name: "Bruce Wayne", phoneNumber: "678-901-2346", address: "1007 Mountain Drive, Gotham", userName: "brucewayne", email: "bruce.wayne@example.com", password: "********", roleId: 3 },
  { id: 17, name: "Clark Kent", phoneNumber: "789-012-3457", address: "344 Clinton St, Metropolis", userName: "clarkkent", email: "clark.kent@example.com", password: "********", roleId: 3 },
  { id: 18, name: "Diana Prince", phoneNumber: "890-123-4568", address: "1 Paradise Island", userName: "dianaprince", email: "diana.prince@example.com", password: "********", roleId: 3 },
  { id: 19, name: "Barry Allen", phoneNumber: "901-234-5679", address: "123 Central City", userName: "barryallen", email: "barry.allen@example.com", password: "********", roleId: 3 },
  { id: 20, name: "Hal Jordan", phoneNumber: "012-345-6780", address: "456 Coast City", userName: "haljordan", email: "hal.jordan@example.com", password: "********", roleId: 3 },
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

const CustomerManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const rowsPerPage = 7;

  const pages = Math.ceil(users.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return users.slice(start, end);
  }, [page]);

  const renderCell = React.useCallback((user: any, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof typeof user];

    switch (columnKey) {
      case "id":
        return <div className="text-bold">{cellValue}</div>;
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: `https://i.pravatar.cc/150?u=${user.email}` }}
            description={user.email}
            name={cellValue}
          >
            {user.email}
          </User>
        );
      case "roleId":
        return (
          <Chip color={user.roleId === 1 ? "primary" : "secondary"} size="sm" variant="flat">
            {user.roleId === 1 ? "Admin" : "Customer"}
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
        return cellValue;
    }
  }, []);

  return (
    <DefaultManagerLayout>
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-4">Customer Management</h1>
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

export default CustomerManagement;