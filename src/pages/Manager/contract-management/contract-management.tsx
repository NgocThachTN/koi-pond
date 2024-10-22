import React, { useEffect, useState, useCallback } from 'react';
import DefaultManagerLayout from '@/layouts/defaultmanager';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  ChipProps,
  Tooltip,
  Pagination,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  Select,
  SelectItem,
  Avatar,
  ScrollShadow,
  Link,
  Card,
  CardBody
} from "@nextui-org/react";
import { SearchIcon, EyeIcon } from '@nextui-org/shared-icons';
import { getContractsApi, Contract, updateContractByRequestDesignApi, updateContractBySampleApi } from '@/apis/user.api';
import { sendOrderCompletionEmail } from '@/apis/email.api';
import { format, parseISO } from 'date-fns';
import { Divider } from "@nextui-org/react";

const ContractManagement: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newProgressUpdate, setNewProgressUpdate] = useState('');
  const [localDescription, setLocalDescription] = useState('');
  const [isPolling, setIsPolling] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [pollingInterval, setPollingInterval] = useState(5000); // Start with 5 seconds
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  useEffect(() => {
    fetchContracts();
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (editModalOpen) {
      intervalId = setInterval(fetchLatestUpdates, 5000); // Poll every 5 seconds
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [editModalOpen, editingContract]);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const response = await getContractsApi();
      const sortedContracts = response.data.$values.sort((a, b) =>
        new Date(b.contractStartDate).getTime() - new Date(a.contractStartDate).getTime()
      );
      setContracts(sortedContracts);
      setError(null);
    } catch (err) {
      setError("Failed to fetch contracts");
      console.error("Error fetching contracts:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCustomerName = (contract: Contract) => {
    return contract.requests.$values[0]?.users.$values[0]?.name || 'N/A';
  };

  const getCustomerEmail = (contract: Contract) => {
    return contract.requests.$values[0]?.users.$values[0]?.email || 'N/A';
  };

  const handleEditClick = (contract: Contract) => {
    setEditingContract(contract);
    setLocalDescription(contract.description || '');
    setChatMessages(formatProgressUpdates(contract.description || ''));
    setEditModalOpen(true);
    fetchLatestUpdates(contract);
  };

  const handleSendMessage = async () => {
    if (!editingContract || !newProgressUpdate.trim()) return;

    const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const newUpdate = `[${currentDate}] Manager: ${newProgressUpdate}`;
    const updatedDescription = localDescription
      ? `${localDescription}\n\n${newUpdate}`
      : newUpdate;

    try {
      const updateFunction = editingContract.requests.$values[0].designs ?
        updateContractByRequestDesignApi : updateContractBySampleApi;

      const updatedContract = await updateFunction({
        ...editingContract,
        contractId: Number(editingContract.contractId),
        description: updatedDescription,
        requests: [{
          ...editingContract.requests.$values[0],
          users: editingContract.requests.$values[0].users.$values,
          designs: editingContract.requests.$values[0].designs?.$values || [],
          samples: editingContract.requests.$values[0].samples?.$values || [],
        }]
      });

      console.log("Message sent and contract updated successfully:", updatedContract);
      
      // Update the local state
      setLocalDescription(updatedDescription);
      setNewProgressUpdate('');
      
      // Update the contract in the contracts list without fetching all contracts again
      setContracts(prevContracts => 
        prevContracts.map(contract => 
          contract.contractId === editingContract.contractId ? {...contract, description: updatedDescription} : contract
        )
      );
      
      // Update the editingContract state and chatMessages
      setEditingContract(prevContract => ({...prevContract!, description: updatedDescription}));
      setChatMessages(formatProgressUpdates(updatedDescription));

    } catch (err) {
      console.error("Error in handleSendMessage:", err);
      // You might want to show an error message to the user here
    }
  };

  const handleEditSubmit = async () => {
    if (!editingContract) return;

    try {
      const updateFunction = editingContract.requests.$values[0].designs ?
        updateContractByRequestDesignApi : updateContractBySampleApi;

      const updatedContract = await updateFunction({
        ...editingContract,
        contractId: Number(editingContract.contractId),
        description: localDescription,
        requests: [{
          ...editingContract.requests.$values[0],
          users: editingContract.requests.$values[0].users.$values,
          designs: editingContract.requests.$values[0].designs?.$values || [],
          samples: editingContract.requests.$values[0].samples?.$values || [],
        }]
      });

      console.log("Contract updated successfully:", updatedContract);

      // Kiểm tra trạng thái và gửi email
      if (editingContract.status === 'Completed') {
        console.log("Contract status is Completed, preparing to send email");

        const userEmail = editingContract.requests.$values[0].users.$values[0]?.email;
        const userName = editingContract.requests.$values[0].users.$values[0]?.name;
        
        console.log("User email:", userEmail);
        console.log("User name:", userName);

        if (userEmail && userName) {
          try {
            console.log("Attempting to send email");
            const emailResult = await sendOrderCompletionEmail({
              requestName: editingContract.requests.$values[0].requestName,
              contractName: editingContract.contractName,
              contractEndDate: editingContract.contractEndDate,
              userEmail: userEmail,
              userName: userName
            });
            console.log('Email sent successfully:', emailResult);
          } catch (emailError) {
            console.error("Error sending email:", emailError);
          }
        } else {
          console.warn('User email or name is missing');
        }
      } else {
        console.log("Contract status is not Completed, skipping email");
      }

      setEditModalOpen(false);
      await fetchContracts();
    } catch (err) {
      console.error("Error in handleEditSubmit:", err);
    }
  };

  const getStatusColor = (status: string | undefined): ChipProps["color"] => {
    if (!status) return "default";
    const lowerStatus = status.toLowerCase();
    switch (lowerStatus) {
      case 'pending':
        return "warning";
      case 'processing':
        return "primary";
      case 'completed':
        return "success";
      case 'cancelled':
        return "danger";
      default:
        return "default";
    }
  };
 //rút gọn url 
  const shortenUrl = (url: string, maxLength: number = 30) => {
    if (!url) return 'N/A';
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength - 3) + '...';
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

  const getLatestStatus = (description: string): string => {
    if (!description) return 'No updates';
    
    const lines = description.split('\n');
    let latestUpdate = '';
    let latestTimestamp = new Date(0); // Initialize with the earliest possible date

    for (const line of lines) {
      const match = line.match(/^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\] (.*)/);
      if (match) {
        const [, timestamp, update] = match;
        const date = parseISO(timestamp);
        if (date > latestTimestamp) {
          latestTimestamp = date;
          latestUpdate = update;
        }
      }
    }

    if (latestUpdate) {
      return `${format(latestTimestamp, 'dd/MM/yyyy HH:mm:ss')} - ${latestUpdate}`;
    }

    return 'No updates';
  };

  const truncateDescription = (contract: Contract, maxLength: number = 30): string => {
    const requestDescription = contract.requests.$values[0]?.description;
    if (!requestDescription) return 'No description';
    return requestDescription.length > maxLength ? `${requestDescription.slice(0, maxLength)}...` : requestDescription;
  };

  const filteredContracts = contracts.filter(contract => 
    getCustomerName(contract).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedContracts = filteredContracts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  console.log('Filtered Contracts:', filteredContracts);
  console.log('Paginated Contracts:', paginatedContracts);

  const formatMessageContent = (content: string) => {
    // Giữ nguyên các ký tự xuống dòng
    const firebaseStorageRegex = /https:\/\/firebasestorage\.googleapis\.com\/.*?\.pdf(\?[^\s]+)?/g;
    
    return content.replace(firebaseStorageRegex, (match) => {
      const fileName = decodeURIComponent(match.split('/').pop()?.split('?')[0] || 'contract.pdf');
      return `<a href="${match}" target="_blank" rel="noopener noreferrer">${fileName}</a>`;
    });
  };

  // Trong phần render của tin nhắn
  const MessageContent: React.FC<{ content: string }> = ({ content }) => {
    return (
      <p
        className="text-sm dark:text-white"
        dangerouslySetInnerHTML={{ __html: formatMessageContent(content) }}
      />
    );
  };

  const fetchLatestUpdates = useCallback(async (contract: Contract) => {
    if (!contract) return;
    
    try {
      const response = await getContractsApi();
      const updatedContract = response.data.$values.find(
        (c: Contract) => c.contractId === contract.contractId
      );
      
      if (updatedContract && updatedContract.description !== contract.description) {
        const formattedMessages = formatProgressUpdates(updatedContract.description);
        setChatMessages(formattedMessages);
        setEditingContract(prevContract => ({
          ...prevContract!,
          description: updatedContract.description
        }));
        setLocalDescription(updatedContract.description || '');
        // Reset polling interval if there are new messages
        setPollingInterval(5000);
      } else {
        // Increase polling interval if no new messages, up to 1 minute
        setPollingInterval(prev => Math.min(prev * 1.5, 60000));
      }
    } catch (err) {
      console.error("Error fetching latest updates:", err);
    }
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (editModalOpen && editingContract) {
      intervalId = setInterval(() => fetchLatestUpdates(editingContract), pollingInterval);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [editModalOpen, editingContract, pollingInterval, fetchLatestUpdates]);

  const handleViewDetails = (contract: Contract) => {
    setSelectedContract(contract);
    setDetailModalOpen(true);
  };

  const getRequestType = (contract: Contract) => {
    const request = contract.requests.$values[0];
    if (request.designs && request.designs.$values.length > 0) {
      return 'Design';
    } else if (request.samples && request.samples.$values.length > 0) {
      return 'Sample';
    }
    return 'Unknown';
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <DefaultManagerLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Contract Management</h1>
        
        {/* Search Input */}
        <div className="mb-4">
          <Input
            isClearable
            className="w-full max-w-[300px]"
            placeholder="Search by customer name..."
            startContent={<SearchIcon />}
            value={searchTerm}
            onClear={() => setSearchTerm('')}
            onValueChange={setSearchTerm}
          />
        </div>

        {paginatedContracts.length > 0 ? (
          <Table aria-label="Contracts table">
            <TableHeader>
              <TableColumn>Contract Name</TableColumn>
              <TableColumn>Customer Info</TableColumn>
              <TableColumn>Start Date</TableColumn>
              <TableColumn>End Date</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn>Description</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {paginatedContracts.map((contract, index) => (
                <TableRow key={index}>
                  <TableCell>{contract.contractName}</TableCell>
                  <TableCell>
                    <div>
                      <p>{getCustomerName(contract)}</p>
                      <p>{getCustomerEmail(contract)}</p>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(contract.contractStartDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(contract.contractEndDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip color={getStatusColor(contract.status)} variant="flat">
                      {contract.status || 'N/A'}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Tooltip content={contract.requests.$values[0]?.description || 'No description'}>
                      <span>{truncateDescription(contract)}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button onClick={() => handleEditClick(contract)}>Edit</Button>
                      <Button isIconOnly onClick={() => handleViewDetails(contract)}>
                        <EyeIcon />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div>No contracts found</div>
        )}

        <div className="flex justify-center mt-4">
          <Pagination
            total={Math.ceil(filteredContracts.length / itemsPerPage)}
            page={currentPage}
            onChange={setCurrentPage}
          />
        </div>

        <Modal 
          isOpen={editModalOpen} 
          onClose={() => setEditModalOpen(false)}
          size="5xl"
        >
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">Edit Contract</ModalHeader>
            <ModalBody>
              {editingContract && (
                <div className="grid grid-cols-3 gap-6">
                  {/* Left column: Contract details */}
                  <div className="col-span-1">
                    <h3 className="text-lg font-semibold mb-4">Contract Details</h3>
                    <Input
                      label="Contract Name"
                      value={editingContract.contractName}
                      onChange={(e) => setEditingContract({...editingContract, contractName: e.target.value})}
                      className="mb-4"
                    />
                    <Input
                      label="Start Date"
                      type="date"
                      value={format(new Date(editingContract.contractStartDate), 'yyyy-MM-dd')}
                      onChange={(e) => setEditingContract({...editingContract, contractStartDate: e.target.value})}
                      className="mb-4"
                    />
                    <Input
                      label="End Date"
                      type="date"
                      value={format(new Date(editingContract.contractEndDate), 'yyyy-MM-dd')}
                      onChange={(e) => setEditingContract({...editingContract, contractEndDate: e.target.value})}
                      className="mb-4"
                    />
                    <Select
                      label="Status"
                      selectedKeys={[editingContract.status]}
                      onChange={(e) => setEditingContract({...editingContract, status: e.target.value})}
                      className="mb-4"
                    >
                      <SelectItem key="Pending" value="Pending">Pending</SelectItem>
                      <SelectItem key="Processing" value="Processing">Processing</SelectItem>
                      <SelectItem key="Completed" value="Completed">Completed</SelectItem>
                      <SelectItem key="Cancelled" value="Cancelled">Cancelled</SelectItem>
                    </Select>
                  </div>
                  
                  {/* Right column: Progress updates, calling chat bubble */}
                  <div className="col-span-2 flex flex-col h-[600px] bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4 dark:text-white">Progress Updates</h3>
                    <ScrollShadow className="flex-grow mb-4">
                      <div className="space-y-4">
                        {chatMessages.map((message, index) => (
                          <div key={message.id} className={`flex ${message.sender === 'Manager' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex items-start gap-2 max-w-[80%] ${message.sender === 'Manager' ? 'flex-row-reverse' : ''}`}>
                              <Avatar
                                name={message.sender}
                                size="sm"
                                className={message.sender === 'Manager' ? 'bg-primary text-white' : 'bg-default-300 dark:bg-gray-600'}
                              />
                              <div className={`p-3 rounded-lg shadow ${
                                message.sender === 'Manager' 
                                  ? 'bg-primary text-white dark:bg-blue-600' 
                                  : 'bg-white text-black dark:bg-gray-700 dark:text-white'
                              } max-w-full overflow-hidden`}>
                                <p className="font-semibold text-sm">{message.sender}</p>
                                <MessageContent content={message.content} />
                                <p className="text-xs opacity-70 mt-1 dark:text-gray-300">{message.timestamp}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollShadow>
                    {/* {text modal chat} */}
                    <Divider className="my-4" />
                    <div className="flex items-end gap-2">
                      <Textarea
                        label="New Message"
                        placeholder="Type your message..."
                        value={newProgressUpdate}
                        onChange={(e) => setNewProgressUpdate(e.target.value)}
                        className="flex-grow dark:bg-gray-700 dark:text-white"
                      />
                      <Button color="primary" onPress={handleSendMessage}>
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleEditSubmit}>
                Save Changes
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Updated Modal for detailed view */}
        <Modal 
          isOpen={detailModalOpen} 
          onClose={() => setDetailModalOpen(false)}
          size="4xl"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Contract Details</ModalHeader>
                <ModalBody>
                  {selectedContract && (
                    <div className="grid grid-cols-3 gap-4">
                      <Card>
                        <CardBody>
                          <h3 className="text-lg font-semibold mb-2">Contract Information</h3>
                          <div className="space-y-2">
                            <p><strong>Contract Name:</strong> {selectedContract.contractName}</p>
                            <p><strong>Start Date:</strong> {format(new Date(selectedContract.contractStartDate), 'dd/MM/yyyy')}</p>
                            <p><strong>End Date:</strong> {format(new Date(selectedContract.contractEndDate), 'dd/MM/yyyy')}</p>
                            <p><strong>Status:</strong> <Chip color={getStatusColor(selectedContract.status)}>{selectedContract.status}</Chip></p>
                          </div>
                        </CardBody>
                      </Card>

                      <Card>
                        <CardBody>
                          <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
                          <div className="space-y-2">
                            <p><strong>Name:</strong> {getCustomerName(selectedContract)}</p>
                            <p><strong>Email:</strong> {selectedContract.requests.$values[0]?.users.$values[0]?.email || 'N/A'}</p>
                            <p><strong>Phone:</strong> {selectedContract.requests.$values[0]?.users.$values[0]?.phoneNumber || 'N/A'}</p>
                            <p><strong>Address:</strong> {selectedContract.requests.$values[0]?.users.$values[0]?.address || 'N/A'}</p>
                          </div>
                        </CardBody>
                      </Card>

                      <Card>
                        <CardBody>
                          <h3 className="text-lg font-semibold mb-2">Request Information</h3>
                          <div className="space-y-2">
                            <p><strong>Request Name:</strong> {selectedContract.requests.$values[0]?.requestName || 'N/A'}</p>
                            <p><strong>Request Type:</strong> {getRequestType(selectedContract)}</p>
                          </div>
                        </CardBody>
                      </Card>

                      <Card className="col-span-3">
                        <CardBody>
                          <h3 className="text-lg font-semibold mb-2">Description</h3>
                          <ScrollShadow className="h-[200px] max-w-[800px] mx-auto">
                            <p className="whitespace-pre-wrap text-sm">
                              {selectedContract.requests.$values[0]?.description || 'No description available.'}
                            </p>
                          </ScrollShadow>
                        </CardBody>
                      </Card>
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </DefaultManagerLayout>
  );
};

export default ContractManagement;
