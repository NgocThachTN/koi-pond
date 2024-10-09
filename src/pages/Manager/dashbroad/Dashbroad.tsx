import React from "react";
import { Card, CardBody, CardHeader, Divider, Progress, Spacer } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', completed: 4, inProgress: 3, pending: 2 },
  { month: 'Feb', completed: 3, inProgress: 4, pending: 1 },
  { month: 'Mar', completed: 5, inProgress: 2, pending: 3 },
  { month: 'Apr', completed: 6, inProgress: 3, pending: 2 },
  { month: 'May', completed: 4, inProgress: 5, pending: 1 },
  { month: 'Jun', completed: 7, inProgress: 4, pending: 2 },
];

const Dashboard = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Koi Pond Construction Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-primary/10">
          <CardBody className="flex flex-row items-center">
            <Icon icon="mdi:fish" width={40} height={40} className="text-primary" />
            <div className="ml-4">
              <p className="text-small">Total Koi Ponds</p>
              <p className="text-2xl font-bold">1,234</p>
            </div>
          </CardBody>
        </Card>
        
        <Card className="bg-success/10">
          <CardBody className="flex flex-row items-center">
            <Icon icon="mdi:account-group" width={40} height={40} className="text-success" />
            <div className="ml-4">
              <p className="text-small">Total Customers</p>
              <p className="text-2xl font-bold">567</p>
            </div>
          </CardBody>
        </Card>
        
        <Card className="bg-warning/10">
          <CardBody className="flex flex-row items-center">
            <Icon icon="mdi:clipboard-text-clock" width={40} height={40} className="text-warning" />
            <div className="ml-4">
              <p className="text-small">Pending Orders</p>
              <p className="text-2xl font-bold">89</p>
            </div>
          </CardBody>
        </Card>
        
        <Card className="bg-secondary/10">
          <CardBody className="flex flex-row items-center">
            <Icon icon="mdi:cash" width={40} height={40} className="text-secondary" />
            <div className="ml-4">
              <p className="text-small">Revenue (This Month)</p>
              <p className="text-2xl font-bold">$123,456</p>
            </div>
          </CardBody>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>Construction Orders Overview</CardHeader>
          <Divider />
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" stackId="a" fill="#4ade80" />
                <Bar dataKey="inProgress" stackId="a" fill="#facc15" />
                <Bar dataKey="pending" stackId="a" fill="#f87171" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
        
        <Card>
          <CardHeader>Customer Satisfaction</CardHeader>
          <Divider />
          <CardBody>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Very Satisfied</span>
                  <span>75%</span>
                </div>
                <Progress color="success" value={75} />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Satisfied</span>
                  <span>20%</span>
                </div>
                <Progress color="primary" value={20} />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Neutral</span>
                  <span>4%</span>
                </div>
                <Progress color="warning" value={4} />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Unsatisfied</span>
                  <span>1%</span>
                </div>
                <Progress color="danger" value={1} />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      
      <Card>
        <CardHeader>Recent Koi Pond Construction Projects</CardHeader>
        <Divider />
        <CardBody>
          <div className="space-y-4">
            {[
              { customer: "John Doe", size: "Large", status: "Completed", date: "2023-06-15" },
              { customer: "Jane Smith", size: "Medium", status: "In Progress", date: "2023-06-10" },
              { customer: "Bob Johnson", size: "Small", status: "Pending", date: "2023-06-05" },
            ].map((project, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{project.customer}</p>
                  <p className="text-small text-default-400">{project.size} Koi Pond</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    project.status === "Completed" ? "text-success" :
                    project.status === "In Progress" ? "text-warning" :
                    "text-danger"
                  }`}>{project.status}</p>
                  <p className="text-small text-default-400">{project.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Dashboard;