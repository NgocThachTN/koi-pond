import React, { useEffect, useState } from 'react';
import DefaultManagerLayout from '@/layouts/defaultmanager';
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
      // Sắp xếp contracts theo ngày bắt đầu mới nhất
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const paginatedContracts = contracts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DefaultManagerLayout>
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
                <TableCell>
                  {(() => {
                    const startDate = new Date(contract.contractStartDate);
                    const endDate = new Date(startDate.setMonth(startDate.getMonth() + 3));
                    return endDate.toLocaleDateString();
                  })()}
                </TableCell>
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
    </DefaultManagerLayout>
  );
};

export default ContractManagement;
