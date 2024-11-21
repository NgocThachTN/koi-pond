import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Divider, Chip, Tooltip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer } from 'recharts';
import { getUserRequestsApi, UserRequest, getContractsApi, Contract } from '@/apis/user.api';

const StaffDashboard = () => {
  const [requests, setRequests] = useState<UserRequest[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const requestsData = await getUserRequestsApi('');
        const contractsData = await getContractsApi();

        // Sort requests from newest to oldest
        const sortedRequests = requestsData.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRequests(sortedRequests);
        setContracts(Array.isArray(contractsData.data.$values) ? contractsData.data.$values : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const pendingRequestsCount = requests.length;
  const totalContractsCount = contracts.length;
  const completedContractsCount = contracts.filter(contract => contract.status?.toLowerCase() === 'completed').length;

  // Prepare data for the chart
  const requestStatusCounts = {
    pending: pendingRequestsCount,
    processing: 0,
    complete: 0
  };

  const contractStatusCounts = {
    pending: 0,
    processing: 0,
    completed: 0
  };

  contracts.forEach(contract => {
    const status = contract.status?.toLowerCase();
    if (status && status in contractStatusCounts) {
      contractStatusCounts[status as keyof typeof contractStatusCounts]++;
    }
  });

  const chartData = [
    {
      name: 'Pending',
      requests: requestStatusCounts.pending,
      contracts: contractStatusCounts.pending,
    },
    {
      name: 'Processing',
      contracts: contractStatusCounts.processing,
    },
    {
      name: 'Completed',
      contracts: contractStatusCounts.completed,
    },
  ];

  const processingContracts = contracts
    .filter(contract => contract.status?.toLowerCase() === 'processing')
    .sort((a, b) => new Date(b.contractStartDate).getTime() - new Date(a.contractStartDate).getTime());

  const getCustomerName = (contract: Contract) => {
    return contract.requests.$values[0]?.users.$values[0]?.name || 'N/A';
  };

  const getRequestName = (contract: Contract) => {
    return contract.requests.$values[0]?.requestName || 'N/A';
  };

  const getFirstLine = (text: string | undefined) => {
    if (!text) return 'No description';
    return text.split('\n')[0] || 'No description';
  };

  const renderCell = (request: UserRequest, columnKey: React.Key) => {
    const user = request?.users?.$values?.[0] || {};
    const design = request?.designs?.$values?.[0];
    const sample = request?.samples?.$values?.[0];

    switch (columnKey) {
      case "user":
        return (
          <div>
            <div className="font-semibold">{user?.name || 'N/A'}</div>
            <div className="text-sm text-gray-500">{user?.email || 'N/A'}</div>
          </div>
        );
      case "requestName":
        return request?.requestName || 'N/A';
      case "description":
        const fullDescription = request?.description || 'No description';
        const firstLine = getFirstLine(request?.description);
        return (
          <Tooltip content={fullDescription}>
            <span className="truncate max-w-xs">{firstLine}</span>
          </Tooltip>
        );
      case "type":
        if (design) {
          return (
            <Chip color="primary" variant="flat">
              Design: {design.designName || 'Unnamed Design'}
            </Chip>
          );
        } else if (sample) {
          return (
            <Chip color="secondary" variant="flat">
              Sample: {sample.sampleName || 'Unnamed Sample'}
            </Chip>
          );
        } else {
          return "N/A";
        }
      default:
        return null;
    }
  };

  // Add this new function to filter requests
  const filterRequestsWithEmail = (requests: UserRequest[]) => {
    return requests.filter(request => {
      const user = request.users?.$values?.[0];
      return user && user.email && user.email.trim() !== '';
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Koi Pond Construction Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-primary/10">
          <CardBody className="flex flex-row items-center">
            <Icon icon="mdi:file-document-multiple" width={40} height={40} className="text-primary" />
            <div className="ml-4">
              <p className="text-small">Total Contracts</p>
              <p className="text-2xl font-bold">{totalContractsCount}</p>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-success/10">
          <CardBody className="flex flex-row items-center">
            <Icon icon="mdi:check-circle" width={40} height={40} className="text-success" />
            <div className="ml-4">
              <p className="text-small">Completed Contracts</p>
              <p className="text-2xl font-bold">{completedContractsCount}</p>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-warning/10">
          <CardBody className="flex flex-row items-center">
            <Icon icon="mdi:clipboard-text-clock" width={40} height={40} className="text-warning" />
            <div className="ml-4">
              <p className="text-small">Pending Requests</p>
              <p className="text-2xl font-bold">{pendingRequestsCount}</p>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-secondary/10">
          <CardBody className="flex flex-row items-center">
            <Icon icon="mdi:progress-wrench" width={40} height={40} className="text-secondary" />
            <div className="ml-4">
              <p className="text-small">Processing Contracts</p>
              <p className="text-2xl font-bold">{contractStatusCounts.processing}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>Contracts by Status</CardHeader>
          <Divider />
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip />
                <Legend />
                <Bar dataKey="contracts" fill="#82ca9d" name="Contracts" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>Processing Contracts</CardHeader>
          <Divider />
          <CardBody>
            <div className="space-y-4">
              {processingContracts.slice(0, 5).map((contract, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{getRequestName(contract)}</p>
                    <p className="text-small text-default-400">
                      {getCustomerName(contract)}
                    </p>
                  </div>
                  <div className="text-right">
                    <Chip color="warning" variant="flat">
                      {contract.status}
                    </Chip>
                    <p className="text-small text-default-400">
                      {new Date(contract.contractStartDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>Recent Requests</CardHeader>
        <Divider />
        <CardBody>
          <Table aria-label="Recent Requests Table">
            <TableHeader>
              <TableColumn>CUSTOMER</TableColumn>
              <TableColumn>REQUEST NAME</TableColumn>
              <TableColumn>DESCRIPTION</TableColumn>
              <TableColumn>TYPE</TableColumn>
            </TableHeader>
            <TableBody>
              {filterRequestsWithEmail(requests).slice(0, 5).map((request, index) => (
                <TableRow key={index}>
                  <TableCell>{renderCell(request, "user")}</TableCell>
                  <TableCell>{renderCell(request, "requestName")}</TableCell>
                  <TableCell>{renderCell(request, "description")}</TableCell>
                  <TableCell>{renderCell(request, "type")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default StaffDashboard;
