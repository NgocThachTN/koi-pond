import React, { useEffect, useState } from 'react';
import DefaultStaffLayout from '@/layouts/defaultstaff';
import { getMaintenanceRequestsApi, MaintenanceRequest } from '@/apis/user.api';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Spinner, User } from "@nextui-org/react";

const MaintenanceManagement: React.FC = () => {
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMaintenanceRequests();
  }, []);

  const fetchMaintenanceRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMaintenanceRequestsApi();
      console.log('Fetched response:', response);
      if (response.data && response.data.$values && Array.isArray(response.data.$values)) {
        setMaintenanceRequests(response.data.$values);
      } else {
        setError('Received invalid data from the API');
      }
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
      setError('Failed to fetch maintenance requests');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "user", label: "User" },
    { key: "requestName", label: "Request Name" },
    { key: "maintenanceName", label: "Maintenance Name" },
    { key: "startDate", label: "Start Date" },
    { key: "endDate", label: "End Date" },
    { key: "status", label: "Status" },
  ];

  const renderCell = (request: MaintenanceRequest, columnKey: React.Key) => {
    const user = request.requests.$values[0]?.users.$values[0];
    switch (columnKey) {
      case "id":
        return request.maintenanceRequestId;
      case "user":
        return (
          <User
            name={user?.name || 'N/A'}
            description={user?.email || 'N/A'}
            avatarProps={{ radius: "full", size: "sm" }}
          />
        );
      case "requestName":
        return request.requests.$values[0]?.requestName || 'N/A';
      case "maintenanceName":
        return request.maintenance.$values[0]?.maintencaceName || 'N/A';
      case "startDate":
        return new Date(request.maintenanceRequestStartDate).toLocaleDateString();
      case "endDate":
        return new Date(request.maintenanceRequestEndDate).toLocaleDateString();
      case "status":
        return (
          <Chip color={request.status === 'Completed' ? 'success' : 'warning'} variant="flat">
            {request.status}
          </Chip>
        );
      default:
        return 'N/A';
    }
  };

  if (loading) {
    return (
      <DefaultStaffLayout>
        <div className="flex justify-center items-center h-64">
          <Spinner label="Loading..." color="primary" />
        </div>
      </DefaultStaffLayout>
    );
  }

  if (error) {
    return (
      <DefaultStaffLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Maintenance Management</h1>
          <p className="text-red-500">{error}</p>
        </div>
      </DefaultStaffLayout>
    );
  }

  console.log('Maintenance Requests:', maintenanceRequests);

  return (
    <DefaultStaffLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Maintenance Management</h1>
        {maintenanceRequests.length > 0 ? (
          <Table aria-label="Maintenance requests table">
            <TableHeader columns={columns}>
              {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={maintenanceRequests}>
              {(item) => (
                <TableRow key={item.maintenanceRequestId}>
                  {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        ) : (
          <p>No maintenance requests found.</p>
        )}
      </div>
    </DefaultStaffLayout>
  );
};

export default MaintenanceManagement;