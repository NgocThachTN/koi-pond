import React from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>Total Users</CardHeader>
          <CardBody>
            <p className="text-2xl font-bold">1,234</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Active Contracts</CardHeader>
          <CardBody>
            <p className="text-2xl font-bold">567</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Pending Requests</CardHeader>
          <CardBody>
            <p className="text-2xl font-bold">89</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;