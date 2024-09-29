import React from 'react';
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";

const teamMembers = [
  {
    name: "Dương Gay",
    role: "Project Manager",
    image: "https://i.pravatar.cc/300?u=a042581f4e29026024d",
  },
  {
    name: "Ngọc Thạch",
    role: "Developer",
    image: "https://i.pravatar.cc/300?u=a042581f4e29026704d",
  },
  {
    name: "Anh Tuấn",
    role: "Designer",
    image: "https://i.pravatar.cc/300?u=a04258114e29026702d",
  },
  {
    name: "Anh Nguyên",
    role: "Marketing",
    image: "https://i.pravatar.cc/300?u=a048581f4e29026701d",
  },
];

function TeamSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Our Team</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {teamMembers.map((member, index) => (
          <Card key={index} className="max-w-[300px] mx-auto">
            <CardBody className="p-0 overflow-hidden">
              <Image
                src={member.image}
                alt={member.name}
                width={300}
                height={300}
                className="w-full h-[300px] object-cover object-center"
              />
            </CardBody>
            <CardFooter className="flex-col items-start">
              <p className="text-md font-bold">{member.name}</p>
              <p className="text-small text-default-500">{member.role}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default TeamSection;
