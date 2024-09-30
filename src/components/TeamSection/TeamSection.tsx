import React from 'react';
import { Card, CardBody, CardFooter, Image, Link } from "@nextui-org/react";
import { FaEnvelope, FaFacebookF, FaGithub } from 'react-icons/fa';

const teamMembers = [
  {
    name: "Phan Khánh Dương",
    role: "Project Manager-BE Developer",
    image: "/path/to/alex-smith-image.jpg",
    email: "https://twitter.com/alexsmith",
    facebook: "https://linkedin.com/in/alexsmith",
    github: "https://github.com/alexsmith",
  },
  {
    name: "Nguyễn Bảo Tuấn",
    role: "BE Developer",
    image: "/path/to/alex-smith-image.jpg",
    email: "https://twitter.com/alexsmith",
    linkedin: "https://linkedin.com/in/alexsmith",
    github: "https://github.com/alexsmith",
  },
  {
    name: "Trường Nguyễn Ngọc Thạch",
    role: "FE Developer",
    image: "/path/to/alex-smith-image.jpg",
    email: "https://twitter.com/alexsmith",
    facebook: "https://linkedin.com/in/alexsmith",
    github: "https://github.com/alexsmith",
  },
  {
    name: "Đỗ Vũ Khôi Nguyên",
    role: "FE Developer",
    image: "/path/to/alex-smith-image.jpg",
    email: "nguyendvkse170168@fpt.edu.vn",
    facebook: "https://www.facebook.com/dvkn.a9",
    github: "https://github.com/nguyen2103",
  },
  // Add other team members here...
];

function TeamSection() {
  return (
    <div className="max-w-full px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-4xl font-bold text-center mb-12 text-orange-500">Meet Our Team</h2>
      <div className="flex justify-center">
        <div className="flex space-x-4">
          {teamMembers.map((member, index) => (
            <Card key={index} className="bg-white shadow-md w-[200px]">
              <CardBody className="p-0 overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  className="w-full h-[200px] object-cover object-center"
                />
              </CardBody>
              <CardFooter className="flex-col items-center text-center p-3">
                <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{member.role}</p>
                <div className="flex space-x-2">
                <Link href={member.email} target="_blank" className="text-gray-400 hover:text-red-500">
                <FaEnvelope size={16} />
                  </Link>
                  <Link href={member.facebook} target="_blank" className="text-gray-400 hover:text-blue-600">
                    <FaFacebookF size={16} />
                  </Link>
                  <Link href={member.github} target="_blank" className="text-gray-400 hover:text-gray-700">
                    <FaGithub size={16} />
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TeamSection;
