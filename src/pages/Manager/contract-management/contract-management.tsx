import React, { useEffect, useState } from 'react';
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
  SelectItem
} from "@nextui-org/react";
import { SearchIcon } from '@nextui-org/shared-icons';
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

  useEffect(() => {
    fetchContracts();
  }, []);

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

  const handleEditClick = (contract: Contract) => {
    setEditingContract(contract);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editingContract) return;

    try {
      const updateFunction = editingContract.requests.$values[0].designs ?
        updateContractByRequestDesignApi : updateContractBySampleApi;

      const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      let updatedDescription = editingContract.description;

      if (newProgressUpdate.trim()) {
        const newUpdate = `[${currentDate}] ${newProgressUpdate}`;
        updatedDescription = updatedDescription
          ? `${updatedDescription}\n\n${newUpdate}`
          : newUpdate;
      }

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

      setNewProgressUpdate(''); // Clear the new progress update field
      setEditModalOpen(false);
      await fetchContracts();
    } catch (err) {
      console.error("Error in handleEditSubmit:", err);
    }
  };

  const getStatusColor = (status: string): ChipProps["color"] => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const filteredContracts = contracts.filter(contract => 
    getCustomerName(contract).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedContracts = filteredContracts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatProgressUpdates = (description: string) => {
    if (!description) return 'No progress updates yet.';
    
    const lines = description.split('\n');
    
    return lines.map((line, index) => {
      const dateMatch = line.match(/^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\]/);
      if (dateMatch) {
        const date = new Date(dateMatch[1]);
        const formattedDate = format(date, 'dd/MM/yyyy HH:mm:ss');
        const content = line.substring(dateMatch[0].length).trim();
        return (
          <div key={index} className="mb-2">
            <span className="font-semibold">[{formattedDate}]</span> {content}
          </div>
        );
      }
      return <div key={index} className="mb-2">{line}</div>;
    });
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

  const truncateDescription = (description: string, maxLength: number = 30): string => {
    const latestStatus = getLatestStatus(description);
    return latestStatus.length > maxLength ? `${latestStatus.slice(0, maxLength)}...` : latestStatus;
  };

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

        <Table aria-label="Contracts table">
          <TableHeader>
            <TableColumn>Contract Name</TableColumn>
            <TableColumn>Customer Name</TableColumn>
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
                <TableCell>{getCustomerName(contract)}</TableCell>
                <TableCell>{new Date(contract.contractStartDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(contract.contractEndDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip color={getStatusColor(contract.status)} variant="flat">
                    {contract.status}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Tooltip content={contract.description}>
                    <span>{truncateDescription(contract.description)}</span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleEditClick(contract)}>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

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
          size="3xl"
        >
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">Edit Contract</ModalHeader>
            <ModalBody>
              {editingContract && (
                <div className="grid grid-cols-2 gap-4">
                  {/* Left column: Contract details */}
                  <div>
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
                  
                  {/* Right column: Progress updates */}
                  <div>
                    <div className="mb-4">
                      <h3 className="text-sm font-medium mb-2">Current Progress</h3>
                      <div className="border p-2 rounded-md h-40 overflow-y-auto bg-gray-100 text-sm">
                        {formatProgressUpdates(editingContract.description)}
                      </div>
                    </div>
                    <Textarea
                      label="New Progress Update"
                      placeholder="Enter new progress update..."
                      value={newProgressUpdate}
                      onChange={(e) => setNewProgressUpdate(e.target.value)}
                      className="mb-4"
                    />
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
      </div>
    </DefaultManagerLayout>
  );
};

export default ContractManagement;
