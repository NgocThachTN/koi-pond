import React, { useEffect, useState, useMemo } from 'react';
import DefaultStaffLayout from '@/layouts/defaultstaff';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Tooltip, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Pagination, Input } from "@nextui-org/react";
import { SearchIcon } from '@nextui-org/shared-icons';
import { getUserRequestsApi, UserRequest, createContractByRequestDesignApi, createContractBySampleDesignApi } from '@/apis/user.api';

const DesignAndSample: React.FC = () => {
  const [requests, setRequests] = useState<UserRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<UserRequest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contractId, setContractId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getUserRequestsApi('');
        // Sắp xếp requests theo requestID giảm dần
        const sortedData = data.sort((a, b) => parseInt(b.$id) - parseInt(a.$id));
        setRequests(sortedData);
        setFilteredRequests(sortedData);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = requests.filter(request =>
      request.users.$values.some(user =>
        user.name.toLowerCase().includes(lowercasedFilter)
      )
    );
    // Không cần sắp xếp lại ở đây vì requests đã được sắp xếp
    setFilteredRequests(filtered);
    setCurrentPage(1);
  }, [searchTerm, requests]);

  const columns = [
    { name: "CUSTOMER", uid: "user" },
    { name: "REQUEST NAME", uid: "requestName" },
    { name: "DESCRIPTION", uid: "description" },
    { name: "TYPE", uid: "type" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const handleCreateContract = async (request: UserRequest) => {
    const contractData = {
      requests: [{
        users: request.users.$values,
        designs: request.designs.$values,
        samples: request.samples.$values,
        requestName: request.requestName,
        description: request.description,
      }],
      contractName: `Contract for ${request.requestName}`,
      contractStartDate: new Date().toISOString(),
      contractEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      status: "Processing",
      description: request.description, // Use the description from the request
    };

    try {
      let response;
      console.log('Attempting to create contract for:', request.requestName);
      if (request.designs.$values.length > 0) {
        console.log('Creating contract by request design');
        response = await createContractByRequestDesignApi(contractData);
      } else if (request.samples.$values.length > 0) {
        console.log('Creating contract by sample design');
        response = await createContractBySampleDesignApi(contractData);
      } else {
        throw new Error("Neither design nor sample found in the request");
      }

      console.log('API Response:', response);

      if (response.status === 201) {
        setContractId(response.data.$id);
        setIsModalOpen(true);
      } else {
        console.error('Unexpected response status:', response.status);
        alert(`Failed to create contract: ${response.data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating contract:', error);
      let errorMessage = 'An unknown error occurred while creating the contract.';

      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
        errorMessage = `Server error (${error.response.status}): ${error.response.data.message || 'Unknown server error'}`;
      } else if (error.request) {
        console.error('Error request:', error.request);
        errorMessage = 'No response received from the server. Please check your network connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(`Failed to create contract: ${errorMessage}`);
    }
  };

  const renderCell = (request: UserRequest, columnKey: React.Key) => {
    const user = request.users.$values[0] || {};
    const design = request.designs.$values[0];
    const sample = request.samples.$values[0];

    switch (columnKey) {
      case "user":
        return (
          <div>
            <div className="font-semibold">{user.name || 'N/A'}</div>
            <div className="text-sm text-gray-500">{user.email || 'N/A'}</div>
          </div>
        );
      case "requestName":
        return request.requestName || 'N/A';
      case "description":
        return (
          <Tooltip content={request.description || 'No description'}>
            <span className="truncate max-w-xs">{request.description || 'N/A'}</span>
          </Tooltip>
        );
      case "type":
        if (design) {
          return (
            <Chip color="primary" variant="flat">
              Design
            </Chip>
          );
        } else if (sample) {
          return (
            <Chip color="secondary" variant="flat">
              Sample
            </Chip>
          );
        } else {
          return "N/A";
        }
      case "actions":
        return (
          <Button color="primary" onClick={() => handleCreateContract(request)}>
            Create Contract
          </Button>
        );
      default:
        return null;
    }
  };

  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredRequests.slice(start, end);
  }, [currentPage, filteredRequests]);

  return (
    <DefaultStaffLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Design & Sample Management</h1>
        <div className="flex justify-between items-center mb-4">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by customer name..."
            startContent={<SearchIcon />}
            value={searchTerm}
            onClear={() => setSearchTerm("")}
            onValueChange={setSearchTerm}
          />
        </div>
        <Table aria-label="User Requests Table">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={paginatedRequests}>
            {(item) => (
              <TableRow key={item.$id}>
                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex justify-center mt-4">
          <Pagination
            total={Math.ceil(filteredRequests.length / itemsPerPage)}
            page={currentPage}
            onChange={setCurrentPage}
          />
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">Contract Created Successfully</ModalHeader>
            <ModalBody>
              <p>Your contract has been created successfully.</p>
              <p>Contract ID: {contractId}</p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={() => setIsModalOpen(false)}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </DefaultStaffLayout>
  );
};

export default DesignAndSample;
