import React from 'react'
import { Card, CardBody } from "@nextui-org/react";
import { FaKiwiBird, FaWater, FaTools, FaLeaf } from 'react-icons/fa';

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => {
  if (!Icon) {
    console.error('Icon is undefined for:', title);
    return null;
  }
  
  return (
    <Card 
      className="max-w-[400px] transition-transform duration-200 ease-in-out hover:-translate-y-2"
      isPressable
      isHoverable
    >
      <CardBody className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <Icon className="text-default-500" size={24} />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <p>{description}</p>
      </CardBody>
    </Card>
  )
}

function index() {
  const features = [
    { icon: FaKiwiBird, title: "Diverse Koi Fish", description: "Our ponds feature a wide variety of Koi fish with diverse colors and patterns." },
    { icon: FaWater, title: "Advanced Filtration System", description: "We use modern water filtration technology to maintain the best living environment for the fish." },
    { icon: FaTools, title: "Professional Maintenance", description: "Our team of experts regularly inspects and maintains the fish ponds." },
    { icon: FaLeaf, title: "Natural Landscape", description: "We design fish ponds with natural landscapes, creating an ideal living environment for Koi fish." },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Our Services</h2>
      <div className="flex flex-wrap gap-4 justify-center">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  )
}

export default index
