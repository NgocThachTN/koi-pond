import React, { useEffect, useState } from 'react';
import DefaultStaffLayout from '@/layouts/defaultstaff';
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

const ContractManagement: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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
    console.log("handleEditSubmit started");
    if (!editingContract) {
      console.log("No editing contract found");
      return;
    }

    console.log("Starting contract update process");

    try {
      const updateFunction = editingContract.requests.$values[0].designs ?
        updateContractByRequestDesignApi : updateContractBySampleApi;

      console.log("Update function selected:", updateFunction.name);

      const updatedContract = await updateFunction({
        ...editingContract,
        contractId: Number(editingContract.contractId),
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
      console.log("Modal closed");

      await fetchContracts();
      console.log("Contracts refreshed");
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

  return (
    <DefaultStaffLayout>
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
                    <span className="truncate max-w-xs">{contract.description}</span>
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

        <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)}>
          <ModalContent>
            <ModalHeader>Edit Contract</ModalHeader>
            <ModalBody>
              {editingContract && (
                <>
                  <Input
                    label="Contract Name"
                    value={editingContract.contractName}
                    onChange={(e) => setEditingContract({ ...editingContract, contractName: e.target.value })}
                  />
                  <Input
                    label="Start Date"
                    type="date"
                    value={new Date(editingContract.contractStartDate).toISOString().split('T')[0]}
                    onChange={(e) => setEditingContract({ ...editingContract, contractStartDate: e.target.value })}
                  />
                  <Input
                    label="End Date"
                    type="date"
                    value={new Date(editingContract.contractEndDate).toISOString().split('T')[0]}
                    onChange={(e) => setEditingContract({ ...editingContract, contractEndDate: e.target.value })}
                  />
                  <Select
                    label="Status"
                    selectedKeys={[editingContract.status]}
                    onChange={(e) => {
                      console.log("Status changed to:", e.target.value);
                      setEditingContract({ ...editingContract, status: e.target.value });
                    }}
                  >
                    <SelectItem key="Pending" value="Pending">Pending</SelectItem>
                    <SelectItem key="Processing" value="Processing">Processing</SelectItem>
                    <SelectItem key="Completed" value="Completed">Completed</SelectItem>
                    <SelectItem key="Cancelled" value="Cancelled">Cancelled</SelectItem>
                  </Select>
                  <Textarea
                    label="Description"
                    value={editingContract.description}
                    onChange={(e) => setEditingContract({ ...editingContract, description: e.target.value })}
                  />
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={handleEditSubmit}>Save Changes</Button>
              <Button color="danger" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </DefaultStaffLayout>
  );
};

export default ContractManagement;
