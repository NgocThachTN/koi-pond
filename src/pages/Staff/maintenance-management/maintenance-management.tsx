import React, { useEffect, useState, useCallback } from 'react';
import DefaultStaffLayout from '@/layouts/defaultstaff';
import { getMaintenanceRequestsApi, MaintenanceRequest, updateMaintenanceRequestByDesignApi, updateMaintenanceRequestBySampleApi } from '@/apis/user.api';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Spinner, User, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Textarea, Select, SelectItem, ScrollShadow } from "@nextui-org/react";
import { format, parseISO } from 'date-fns';
import { storage } from '@/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Image } from "@nextui-org/react";

interface MessageContent {
  text?: string;
  imageUrl?: string;
}

interface ChatMessage {
  id: number;
  timestamp: string;
  sender: string;
  content: MessageContent;
}

const MessageContent: React.FC<{ content: MessageContent }> = React.memo(({ content }) => {
  return (
    <div className="space-y-2">
      {content.text && (
        <div className="whitespace-pre-wrap text-sm">{content.text}</div>
      )}
      {content.imageUrl && (
        <div className="mt-2">
          <Image
            src={content.imageUrl}
            alt="Progress Image"
            className="max-w-md rounded-lg shadow-lg"
            style={{ maxHeight: '300px', objectFit: 'contain' }}
          />
        </div>
      )}
    </div>
  );
});

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
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const timestamp = new Date().getTime();
      const fileName = `maintenance-progress/${timestamp}_${file.name}`;
      const storageRef = ref(storage, fileName);

      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setTempImageUrl(downloadURL);
      e.target.value = '';
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleMaintenanceProgressDescriptionUpdate = async () => {
    if (!editingRequest || (!newProgressMessage.trim() && !tempImageUrl)) return;

    try {
      setIsUpdatingProgress(true);

      const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      const messageData: MessageContent = {};

      if (newProgressMessage.trim()) {
        messageData.text = newProgressMessage.trim();
      }
      if (tempImageUrl) {
        messageData.imageUrl = tempImageUrl;
      }

      const messageContent = JSON.stringify(messageData);
      const newUpdate = `[${currentDate}] Staff: ${messageContent}`;
      const updatedProgressDescription = editingRequest.progressMaintenanceDescription
        ? `${editingRequest.progressMaintenanceDescription}\n${newUpdate}`
        : newUpdate;

      const updateFunction = editingRequest.requests.$values[0].designs
        ? updateMaintenanceRequestByDesignApi
        : updateMaintenanceRequestBySampleApi;

      const updatedRequest = {
        ...editingRequest,
        progressMaintenanceDescription: updatedProgressDescription
      };

      await updateFunction(updatedRequest);

      setEditingRequest(updatedRequest);
      setChatMessagesMaintenanceProgressDescription(formatProgressUpdates(updatedProgressDescription));
      setNewProgressMessage('');
      setTempImageUrl(null);

      setMaintenanceRequests(prev =>
        prev.map(request =>
          request.maintenanceRequestId === editingRequest.maintenanceRequestId
            ? updatedRequest
            : request
        )
      );

    } catch (error) {
      console.error("Error updating progress description:", error);
    } finally {
      setIsUpdatingProgress(false);
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

  const formatProgressUpdates = (description: string): ChatMessage[] => {
    if (!description) return [];

    console.log('Raw description:', description);

    return description.split('\n').filter(Boolean).map((line, index) => {
      const match = line.match(/^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\] (.*?): (.*)/);
      if (!match) return null;

      const [, timestamp, sender, contentStr] = match;
      let content: MessageContent;

      try {
        content = JSON.parse(contentStr);
        console.log('Successfully parsed content:', content);
      } catch (error) {
        console.log('Parsing failed, using as text:', contentStr);
        content = { text: contentStr };
      }

      return {
        id: index,
        timestamp: format(new Date(timestamp), 'dd/MM/yyyy HH:mm:ss'),
        sender,
        content
      };
    }).filter((item): item is ChatMessage => item !== null);
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

      if (response.status === 200) {
        await fetchMaintenanceRequests();
        closeEditModal();
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

  const handleViewProgressDescription = () => {
    if (editingRequest) {
      console.log('Current editing request:', editingRequest);
      const messages = formatProgressUpdates(editingRequest.progressMaintenanceDescription || '');
      console.log('Formatted messages:', messages);
      setChatMessagesMaintenanceProgressDescription(messages);
      setProgressDescriptionModalOpen(true);
    }
  };

  useEffect(() => {
    if (editingRequest && progressDescriptionModalOpen) {
      console.log('Loading messages for request:', editingRequest.maintenanceRequestId);
      const messages = formatProgressUpdates(editingRequest.progressMaintenanceDescription || '');
      setChatMessagesMaintenanceProgressDescription(messages);
    }
  }, [editingRequest?.maintenanceRequestId, progressDescriptionModalOpen]);

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
                      onPress={handleViewProgressDescription}
                      variant="flat"
                      className="w-full"
                    >
                      View Progress Description
                    </Button>
                  </div>
                  <Input
                    label="Construction Progress"
                    value={editingRequest.progressMaintenance}
                    onChange={(e) => setEditingRequest({ ...editingRequest, progressMaintenance: e.target.value })}
                    className="mb-4"
                  />
                  <Select
                    label="Payment Status"
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
          onOpenChange={(open) => {
            if (open && editingRequest) {
              const messages = formatProgressUpdates(editingRequest.progressMaintenanceDescription || '');
              setChatMessagesMaintenanceProgressDescription(messages);
            }
            setProgressDescriptionModalOpen(open);
          }}
        >
          <ModalContent>
            <ModalHeader>Current Progress</ModalHeader>
            <ModalBody>
              <div className="flex flex-col h-[500px]">
                <ScrollShadow className="flex-grow mb-4 bg-gray-100 rounded-lg p-4">
                  <div className="space-y-4">
                    {chatMessagesMaintenanceProgressDescription.map((message) => (
                      <div key={message.id} className="text-sm">
                        <div className="font-medium mb-1 text-gray-700">
                          [{message.timestamp}] {message.sender}:
                        </div>
                        <div className="pl-4">
                          <MessageContent content={message.content} />
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollShadow>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className={`cursor-pointer px-4 py-2 rounded-md ${isUploading
                          ? 'bg-gray-300 dark:bg-gray-600'
                          : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
                        }`}
                    >
                      {isUploading ? 'Uploading...' : 'Select Image'}
                    </label>
                  </div>

                  {tempImageUrl && (
                    <div className="relative">
                      <Image
                        src={tempImageUrl}
                        alt="Selected Image"
                        className="max-h-32 object-contain rounded-lg"
                      />
                      <Button
                        isIconOnly
                        size="sm"
                        className="absolute top-1 right-1"
                        color="danger"
                        variant="flat"
                        onPress={() => setTempImageUrl(null)}
                      >
                        ✕
                      </Button>
                    </div>
                  )}

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
                      disabled={!newProgressMessage.trim() && !tempImageUrl}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={() => setProgressDescriptionModalOpen(false)}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </DefaultStaffLayout>
  );
};

export default MaintenanceManagement;
