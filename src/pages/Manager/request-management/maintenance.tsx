import React, { useEffect, useState, useCallback } from 'react';
import DefaultManagerLayout from '@/layouts/defaultmanager';
import { getMaintenanceRequestsApi, MaintenanceRequest, updateMaintenanceRequestByDesignApi, updateMaintenanceRequestBySampleApi } from '@/apis/user.api';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Spinner, User, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Textarea, Select, SelectItem } from "@nextui-org/react";

const MaintenanceManagement: React.FC = () => {
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<MaintenanceRequest | null>(null);
  const [searchStatus, setSearchStatus] = useState<string>("");

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
    { key: "actions", label: "Actions" },
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
          <Chip
            color={getStatusColor(request.status)}
            variant="flat"
          >
            {request.status}
          </Chip>
        );
      case "actions":
        return (
          <Button color="primary" onClick={() => openEditModal(request)}>
            Edit
          </Button>
        );
      default:
        return 'N/A';
    }
  };

  const openEditModal = (request: MaintenanceRequest) => {
    setEditingRequest(JSON.parse(JSON.stringify(request))); // Create a deep copy
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingRequest(null);
    setIsEditModalOpen(false);
  };

  const handleEditSubmit = async () => {
    if (!editingRequest) return;

    try {
      setLoading(true);
      let response;
      if (editingRequest.requests.$values[0]?.designs) {
        response = await updateMaintenanceRequestByDesignApi(editingRequest);
      } else if (editingRequest.requests.$values[0]?.samples) {
        response = await updateMaintenanceRequestBySampleApi(editingRequest);
      } else {
        throw new Error('Invalid request type');
      }

      console.log('Update response:', response);

      // Check if the response is successful based on status code
      if (response.status === 200) {
        await fetchMaintenanceRequests();
        closeEditModal();
        // You can add a success message here if you want
        console.log('MaintenanceRequest updated successfully');
      } else {
        console.error('Update failed:', response.data);
        setError('Failed to update maintenance request');
      }
    } catch (error) {
      console.error('Error updating maintenance request:', error);
      setError('An error occurred while updating the maintenance request');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (editingRequest) {
      const updatedRequest = { ...editingRequest };
      switch (field) {
        case 'requestName':
          updatedRequest.requests.$values[0].requestName = value;
          break;
        case 'maintencaceName':
          updatedRequest.maintenance.$values[0].maintencaceName = value;
          break;
        case 'maintenanceRequestStartDate':
        case 'maintenanceRequestEndDate':
        case 'status':
          updatedRequest[field] = value;
          break;
        case 'description':
          updatedRequest.requests.$values[0].description = value;
          break;
      }
      setEditingRequest(updatedRequest);
    }
  };

  const filteredRequests = maintenanceRequests.filter(request =>
    request.status.toLowerCase().includes(searchStatus.toLowerCase())
  );

  const renderTableBody = useCallback(() => {
    console.log('Rendering table body, filteredRequests:', filteredRequests);
    return (
      <TableBody items={filteredRequests}>
        {(item) => (
          <TableRow key={item.maintenanceRequestId}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    );
  }, [filteredRequests]);

  const statusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Processing', label: 'Processing' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Cancelled', label: 'Cancelled' },
  ];

  const getStatusColor = (status: string): ChipProps["color"] => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Processing':
        return 'primary';
      case 'Completed':
        return 'success';
      case 'Cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <DefaultManagerLayout>
        <div className="flex justify-center items-center h-64">
          <Spinner label="Loading..." color="primary" />
        </div>
      </DefaultManagerLayout>
    );
  }

  if (error) {
    return (
      <DefaultManagerLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Maintenance Management</h1>
          <p className="text-red-500">{error}</p>
        </div>
      </DefaultManagerLayout>
    );
  }

  console.log('Maintenance Requests:', maintenanceRequests);

  return (
    <DefaultManagerLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Maintenance Management</h1>
        <div className="flex justify-between items-center mb-4">
          <Input
            className="max-w-xs"
            size="sm"
            placeholder="Search by status..."
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
            startContent={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 text-default-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            }
          />
        </div>
        {filteredRequests.length > 0 ? (
          <Table aria-label="Maintenance requests table">
            <TableHeader columns={columns}>
              {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            {renderTableBody()}
          </Table>
        ) : (
          <p>No maintenance requests found.</p>
        )}

        <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
          <ModalContent>
            <ModalHeader>Edit Maintenance Request</ModalHeader>
            <ModalBody>
              {editingRequest && (
                <>
                  <Input
                    label="Request Name"
                    value={editingRequest.requests.$values[0]?.requestName || ''}
                    onChange={(e) => handleInputChange('requestName', e.target.value)}
                  />
                  <Input
                    label="Maintenance Name"
                    value={editingRequest.maintenance.$values[0]?.maintencaceName || ''}
                    onChange={(e) => handleInputChange('maintencaceName', e.target.value)}
                  />
                  <Input
                    label="Start Date"
                    type="date"
                    value={editingRequest.maintenanceRequestStartDate.split('T')[0]}
                    onChange={(e) => handleInputChange('maintenanceRequestStartDate', e.target.value)}
                  />
                  <Input
                    label="End Date"
                    type="date"
                    value={editingRequest.maintenanceRequestEndDate.split('T')[0]}
                    onChange={(e) => handleInputChange('maintenanceRequestEndDate', e.target.value)}
                  />
                  <Select
                    label="Status"
                    selectedKeys={[editingRequest.status]}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  >
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <Textarea
                    label="Description"
                    value={editingRequest.requests.$values[0]?.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={closeEditModal}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleEditSubmit}>
                Save Changes
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </DefaultManagerLayout>
  );
};

export default MaintenanceManagement;
