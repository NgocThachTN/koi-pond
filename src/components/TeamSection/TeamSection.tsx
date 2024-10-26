import React from 'react';
import { Card, CardBody, CardFooter, Image, Link } from "@nextui-org/react";
import { FaEnvelope, FaFacebookF, FaGithub } from 'react-icons/fa';

const teamMembers = [
  {
    name: "Phan Khánh Dương",
    role: "Project Manager - BE Developer",
    image: "Images/khanhduong.PNG",
    email: "",
    facebook: "https://www.facebook.com/be.ta.5030927",
    github: "https://github.com/ReshTheDragon",
  },
  {
    name: "Nguyễn Mạnh Bảo Tuấn",
    role: "BE Developer",
    image: "Images/baotuan.jpg",
    email: "",
    facebook: "https://www.facebook.com/nguyen.baotuan.758",
    github: "https://github.com/baotuannguyen16",
  },
  {
    name: "Trường Nguyễn Ngọc Thạch",
    role: "FE Developer",
    image: "Images/ngocthach.png",
    email: "thachtnnse180664@fpt.edu.vn",
    facebook: "https://www.facebook.com/ngocthach.hannsoki",
    github: "https://github.com/NgocThachTN",
  },
  {
    name: "Đỗ Vũ Khôi Nguyên",
    role: "FE Developer",
    image: "",
    facebook: "https://www.facebook.com/dvkn.a9",
    github: "https://github.com/nguyen2103",
  },
  // Add other team members here...
];

function TeamSection() {
  return (
    <div className="max-w-full px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-4xl font-bold text-center mb-12 text-violet-600 dark:text-violet-60">Meet Our Team</h2>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <Card key={index} className="bg-white dark:bg-gray-800 shadow-md w-full max-w-[200px] mx-auto">
              <CardBody className="p-0 overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  className="w-full h-[200px] object-cover object-center"
                />
              </CardBody>
              <CardFooter className="flex-col items-center text-center p-3">
                <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-gray-200">{member.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{member.role}</p>
                <div className="flex space-x-2">
                  <Link href={member.email} target="_blank" className="text-gray-400 hover:text-violet-500 dark:text-gray-500 dark:hover:text-violet-400">
                    <FaEnvelope size={16} />
                  </Link>
                  <Link href={member.facebook} target="_blank" className="text-gray-400 hover:text-violet-600 dark:text-gray-500 dark:hover:text-violet-400">
                    <FaFacebookF size={16} />
                  </Link>
                  <Link href={member.github} target="_blank" className="text-gray-400 hover:text-violet-700 dark:text-gray-500 dark:hover:text-violet-400">
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
