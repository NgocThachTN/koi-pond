import React, { useEffect, useState } from 'react';
import DefaultStaffLayout from '@/layouts/defaultstaff';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Tooltip, Pagination } from "@nextui-org/react";
import { getContractsApi, Contract } from '@/apis/user.api';

const ContractManagement: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const response = await getContractsApi();
      setContracts(response.data.$values);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const paginatedContracts = contracts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DefaultStaffLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Contract Management</h1>
        <Table aria-label="Contracts table">
          <TableHeader>
            <TableColumn>Contract Name</TableColumn>
            <TableColumn>Customer Name</TableColumn>
            <TableColumn>Start Date</TableColumn>
            <TableColumn>End Date</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Description</TableColumn>
          </TableHeader>
          <TableBody>
            {paginatedContracts.map((contract, index) => (
              <TableRow key={index}>
                <TableCell>{contract.contractName}</TableCell>
                <TableCell>{getCustomerName(contract)}</TableCell>
                <TableCell>{new Date(contract.contractStartDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(contract.contractEndDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip color={contract.status === "Active" ? "success" : "warning"} variant="flat">
                    {contract.status}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Tooltip content={contract.description}>
                    <span className="truncate max-w-xs">{contract.description}</span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-center mt-4">
          <Pagination
            total={Math.ceil(contracts.length / itemsPerPage)}
            page={currentPage}
            onChange={setCurrentPage}
          />
        </div>
      </div>
    </DefaultStaffLayout>
  );
};

export default ContractManagement;