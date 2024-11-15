import React, { useEffect, useState, useCallback } from 'react';
import DefaultStaffLayout from '@/layouts/defaultstaff';
import { getMaintenanceRequestsApi, MaintenanceRequest, updateMaintenanceRequestByDesignApi, updateMaintenanceRequestBySampleApi } from '@/apis/user.api';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Spinner, User, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Textarea, Select, SelectItem, ScrollShadow } from "@nextui-org/react";
import { format, parseISO } from 'date-fns';
const MaintenanceManagement: React.FC = () => {
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<MaintenanceRequest | null>(null);
  const [progressDescriptionModalOpen, setProgressDescriptionModalOpen] = useState(false);
  const [chatMessagesMaintenanceProgressDescription, setChatMessagesMaintenanceProgressDescription] = useState<any[]>([]);
  const [newProgressMessage, setNewProgressMessage] = useState('');
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);

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

  const formatProgressUpdates = (description: string) => {
    if (!description) return [];

    const lines = description.split('\n');

    return lines.map((line, index) => {
      const dateMatch = line.match(/^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\] (.*?): (.*)/);
      if (dateMatch) {
        const [, timestamp, role, content] = dateMatch;
        const date = new Date(timestamp);
        const formattedDate = format(date, 'dd/MM/yyyy HH:mm:ss');
        return {
          id: index,
          sender: role,
          content: content,
          timestamp: formattedDate
        };
      }
      return null;
    }).filter(Boolean);
  };

  const handleMaintenanceProgressDescriptionUpdate = async () => {
    if (!editingRequest || !newProgressMessage.trim()) return;

    try {
      setIsUpdatingProgress(true);

      const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      const newUpdate = `[${currentDate}] Staff: ${newProgressMessage}`;
      const updatedProgressDescription = editingRequest.progressMaintenanceDescription
        ? `${editingRequest.progressMaintenanceDescription}\n${newUpdate}`
        : newUpdate;

      const updateFunction = editingRequest.requests.$values[0].designs
        ? updateMaintenanceRequestByDesignApi
        : updateMaintenanceRequestBySampleApi;



      // Update local states
      setEditingRequest(prev => ({
        ...prev!,
        progressMaintenanceDescription: updatedProgressDescription
      }));

      setChatMessagesMaintenanceProgressDescription(formatProgressUpdates(updatedProgressDescription));
      setNewProgressMessage(''); // Clear input

      // Update contracts list
      setMaintenanceRequests(prevMaintenanceRequests =>
        prevMaintenanceRequests.map(maintenanceRequest =>
          maintenanceRequest.maintenanceRequestId === editingRequest.maintenanceRequestId
            ? { ...maintenanceRequest, progressMaintenanceDescription: updatedProgressDescription }
            : maintenanceRequest
        )
      );

    } catch (error) {
      console.error("Error updating progress description:", error);
    } finally {
      setIsUpdatingProgress(false);
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

  const filteredMaintenanceRequests = maintenanceRequests.filter(request =>
    ["Completed", "Processing", "Cancelled"].includes(request.status)
  );

  const renderTableBody = useCallback(() => {
    console.log('Rendering table body, filteredMaintenanceRequests:', filteredMaintenanceRequests);
    return (
      <TableBody items={filteredMaintenanceRequests}>
        {(item) => (
          <TableRow key={item.maintenanceRequestId}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    );
  }, [filteredMaintenanceRequests]);

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
          <h1 className="text-2xl font-bold mb-4">Maintenance Contract Management</h1>
          <p className="text-red-500">{error}</p>
        </div>
      </DefaultStaffLayout>
    );
  }

  console.log('Maintenance Requests:', maintenanceRequests);

  return (
    <DefaultStaffLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Maintenance Contract Management</h1>
        {filteredMaintenanceRequests.length > 0 ? (
          <Table aria-label="Maintenance requests table">
            <TableHeader columns={columns}>
              {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            {renderTableBody()}
          </Table>
        ) : (
          <p>No maintenance requests found with status Completed, Processing, or Cancelled.</p>
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
                    onChange={(e) => {
                      // Kiểm tra nếu e.target.value là undefined hoặc null, 
                      // thì giữ nguyên giá trị status hiện tại
                      const newStatus = e.target.value || editingRequest.status;
                      handleInputChange('status', newStatus);
                    }}
                  >
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <div className="mb-4">
                    <Button
                      onPress={() => setProgressDescriptionModalOpen(true)}
                      variant="flat"
                      className="w-full"
                    >
                      View Progress Description
                    </Button>
                  </div>
                  <Input
                    label="Construction Progress" // New input for ConstructionProgress
                    value={editingRequest.progressMaintenance}
                    onChange={(e) => setEditingRequest({ ...editingRequest, progressMaintenance: e.target.value })}
                    className="mb-4"
                  />
                  <Select
                    label="Payment Status" // Updated to Select for restricted values
                    selectedKeys={[editingRequest.paymentStatus]}
                    onChange={(e) => setEditingRequest({ ...editingRequest, paymentStatus: e.target.value })}
                    className="mb-4"
                  >
                    <SelectItem key="paid" value="Paid" className="text-success">Paid</SelectItem>
                    <SelectItem key="not-paid" value="Not Paid" className="text-danger">Not Paid</SelectItem>
                  </Select>
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
        <Modal
          isOpen={progressDescriptionModalOpen}
          onClose={() => setProgressDescriptionModalOpen(false)}
          size="2xl"
        >
          <ModalContent>
            <ModalHeader>Current Progress</ModalHeader>
            <ModalBody>
              <div className="flex flex-col h-[500px]">
                {/* Chat history area */}
                <ScrollShadow className="flex-grow mb-4 bg-gray-100 rounded-lg p-4">
                  <div className="space-y-2">
                    {chatMessagesMaintenanceProgressDescription.map((message, index) => (
                      <div key={message.id} className="text-sm">
                        [{message.timestamp}] {message.sender}: {message.content}
                      </div>
                    ))}
                  </div>
                </ScrollShadow>

                {/* New message input area */}
                <div className="flex items-end gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={newProgressMessage}
                    onChange={(e) => setNewProgressMessage(e.target.value)}
                    className="flex-grow"
                    minRows={2}
                  />
                  <Button
                    color="primary"
                    isLoading={isUpdatingProgress}
                    onPress={handleMaintenanceProgressDescriptionUpdate}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={() => setProgressDescriptionModalOpen(false)}
              >
                Cancel
              </Button>

            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </DefaultStaffLayout>
  );
};

export default MaintenanceManagement;
