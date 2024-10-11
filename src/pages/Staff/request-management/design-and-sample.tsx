import React, { useEffect, useState } from 'react';
import DefaultManagerLayout from '@/layouts/defaultmanager';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Tooltip, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Pagination } from "@nextui-org/react";
import { getUserRequestsApi, UserRequest, createContractByRequestDesignApi, createContractBySampleDesignApi } from '@/apis/user.api';

const DesignAndSampleStaff: React.FC = () => {
  const [requests, setRequests] = useState<UserRequest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contractId, setContractId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getUserRequestsApi('');
        setRequests(data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, []);

  const columns = [
    { name: "CUSTOMER", uid: "user" },
    { name: "REQUEST NAME", uid: "requestName" },
    { name: "DESCRIPTION", uid: "description" },
    { name: "TYPE", uid: "type" }, // New combined column
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
      if (request.designs.$values.length > 0) {
        response = await createContractByRequestDesignApi(contractData);
      } else if (request.samples.$values.length > 0) {
        response = await createContractBySampleDesignApi(contractData);
      } else {
        throw new Error("Neither design nor sample found in the request");
      }

      if (response.status === 201) {
        setContractId(response.data.$id);
        setIsModalOpen(true);
        // You might want to refresh the requests list or update the UI here
      } else {
        alert(`Failed to create contract: ${response.data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating contract:', error);
      alert('An error occurred while creating the contract');
    }
  };

  const renderCell = (request: UserRequest, columnKey: React.Key) => {
    const user = request.users.$values[0];
    const design = request.designs.$values[0];
    const sample = request.samples.$values[0];

    switch (columnKey) {
      case "user":
        return (
          <div>
            <div className="font-semibold">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        );
      case "requestName":
        return request.requestName;
      case "description":
        return (
          <Tooltip content={request.description}>
            <span className="truncate max-w-xs">{request.description}</span>
          </Tooltip>
        );
      case "type":
        if (design) {
          return <Chip color="primary" variant="flat">Design</Chip>;
        } else if (sample) {
          return <Chip color="secondary" variant="flat">Sample</Chip>;
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

  const paginatedRequests = requests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DefaultManagerLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Design & Sample Management</h1>
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
            total={Math.ceil(requests.length / itemsPerPage)}
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
    </DefaultManagerLayout>
  );
};

export default DesignAndSampleStaff;