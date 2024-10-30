import React from 'react';
import {Card, CardBody, CardFooter, Image, Button, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter} from "@nextui-org/react";
import { FaMapMarkerAlt, FaClock, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";
import { useAuth } from '@apis/authen';
import { useNavigate } from 'react-router-dom';

function Project() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = React.useState(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [showLoginAlert, setShowLoginAlert] = React.useState(false);

  const projects = [
    {
      id: 1,
      title: "Garden Koi Pond",
      image: "https://zenus.vn/image/catalog/dich-vu/ho-ca-koi-bo-da-zenus-min.jpg",
      size: "120 m²",
      status: "Completed",
      description: "A luxurious Koi pond featuring natural rock formations and wooden bridges. This project combines traditional Japanese aesthetics with modern design elements.",
      features: [
        "Custom filtration system",
        "LED underwater lighting",
        "Wooden bridge walkway",
        "Natural rock landscaping",
        "Professional water plants"
      ],
      location: "Private Villa, District 2",
      duration: "3 months",
      completion: "January 2024"
    },
    {
      id: 2,
      title: "Mini Koi Pond",
      image: "https://zenus.vn/image/catalog/dich-vu/thi-cong-ho-koi-zenus10.jpg",
      size: "80 m²",
      status: "In Progress",
      description: "A contemporary minimalist Koi pond design that emphasizes clean lines and open spaces. Perfect for modern urban homes.",
      features: [
        "Automated feeding system",
        "Smart water monitoring",
        "Minimalist stone work",
        "Glass viewing panels",
        "Integrated seating area"
      ],
      location: "Modern Residence, District 7",
      duration: "2.5 months",
      completion: "Ongoing"
    },
    {
      id: 3,
      title: "Koi Pond Indoor",
      image: "https://zenus.vn/image/catalog/tin-tuc/11.jpg",
      size: "150 m²",
      status: "Completed",
      description: "An  Koi pond Indoor with traditional elements including stone lanterns and maple trees. Creates a peaceful zen atmosphere.",
      features: [
        "Traditional stone lanterns",
        "Japanese maple trees",
        "Bamboo water features",
        "Stone pathways",
        "Meditation area"
      ],
      location: "Japanese Restaurant, District 1",
      duration: "4 months",
      completion: "December 2023"
    },
    {
      id: 4,
      title: "Contemporary Garden Pond",
      image: "https://zenus.vn/image/catalog/tin-tuc/Goc-chuyen-gia/ho-a-koi-dep-min.jpg",
      size: "200 m²",
      status: "Completed",
      description: "A modern take on the traditional Koi pond, featuring contemporary design elements and state-of-the-art technology.",
      features: [
        "Advanced filtration system",
        "Mobile app monitoring",
        "Solar-powered lighting",
        "Floating deck",
        "Waterfall feature"
      ],
      location: "Corporate Park, District 4",
      duration: "3.5 months",
      completion: "November 2023"
    },
    {
      id: 5,
      title: "Natural Rock Formation",
      image: "https://i.pinimg.com/564x/27/e6/ff/27e6ff56aebe6446dd99858ff64f5241.jpg",
      size: "100 m²",
      status: "In Progress",
      description: "A naturalistic Koi pond design that seamlessly integrates with the surrounding landscape using natural rock formations.",
      features: [
        "Natural stone waterfall",
        "Native plants",
        "Bio-filtration system",
        "Shallow beach entry",
        "Hidden equipment housing"
      ],
      location: "Eco Resort, District 9",
      duration: "3 months",
      completion: "March 2024"
    },
    {
      id: 6,
      title: "Urban Rooftop Koi Pond",
      image: "https://i.pinimg.com/564x/82/3b/a1/823ba18a245a562e4b272910a8f521de.jpg",
      size: "90 m²",
      status: "Completed",
      description: "An innovative rooftop Koi pond design that combines modern aesthetics with urban living. Perfect for city dwellers.",
      features: [
        "Custom filtration system",
        "LED underwater lighting",
        "Floating deck",
        "Waterfall feature",
        "Solar-powered lighting"
      ],
      location: "Rooftop Terrace, District 10",
      duration: "2.5 months",
      completion: "October 2023"
    },
    // ... Add similar detailed information for other projects
  ];

  const handleOpen = (project) => {
    setSelectedProject(project);
    setIsOpen(true);
  };

  const handleButtonClick = (path: string) => {
    if (!isAuthenticated) {
      setShowLoginAlert(true);
    } else {
      navigate(path);
      setIsOpen(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-violet-700">
          Featured Projects
        </h1>
        <p className="text-lg text-default-600 max-w-2xl mx-auto">
          Explore our collection of stunning Koi pond designs and implementations
        </p>
      </div>
      <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card 
            key={project.id} 
            shadow="sm" 
            isPressable 
            className="hover:-translate-y-2 transition-transform"
            onPress={() => handleOpen(project)}
          >
            <CardBody className="overflow-visible p-0">
              <div className="relative">
                <Image
                  shadow="sm"
                  radius="lg"
                  width="100%"
                  alt={project.title}
                  className="w-full object-cover h-[200px]"
                  src={project.image}
                />
                <div className="absolute top-2 right-2">
                  <Chip
                    color={project.status === "Completed" ? "success" : "warning"}
                    variant="shadow"
                    size="sm"
                  >
                    {project.status}
                  </Chip>
                </div>
              </div>
            </CardBody>
            <CardFooter className="flex flex-col items-start text-small gap-2">
              <h4 className="font-bold text-large text-foreground">{project.title}</h4>
              <Chip
                variant="flat"
                size="sm"
              >
                {project.size}
              </Chip>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Modal 
        size="5xl" 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        className="!p-0"
      >
        {selectedProject && (
          <ModalContent>
            <ModalBody className="p-0">
              <div className="grid grid-cols-2">
                {/* Left side - Image */}
                <div className="relative h-full">
                  <Image
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                    classNames={{
                      wrapper: "h-full",
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <Chip
                      color={selectedProject.status === "Completed" ? "success" : "warning"}
                      size="sm"
                      className="opacity-90"
                    >
                      {selectedProject.status}
                    </Chip>
                  </div>
                </div>

                {/* Right side - Content */}
                <div className="p-8 overflow-y-auto max-h-[600px]">
                  <div className="space-y-6">
                    {/* Header */}
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        {selectedProject.title}
                      </h3>
                      <Chip size="sm" variant="flat">{selectedProject.size}</Chip>
                    </div>

                    {/* Project Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-violet-500" />
                        <span className="text-default-600">{selectedProject.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaClock className="text-violet-500" />
                        <span className="text-default-600">{selectedProject.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-violet-500" />
                        <span className="text-default-600">{selectedProject.completion}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-3">Project Description</h4>
                      <p className="text-default-600 leading-relaxed">
                        {selectedProject.description}
                      </p>
                    </div>

                    {/* Features */}
                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-3">Key Features</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedProject.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <FaCheckCircle className="text-violet-500 mt-1" />
                            <span className="text-default-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button 
                        color="secondary"
                        className="flex-1"
                        onClick={() => handleButtonClick('/docsuser')}
                      >
                        Request Quote
                      </Button>
                      <Button 
                        color="secondary"
                        variant="bordered"
                        className="flex-1"
                        onClick={() => handleButtonClick('/pricinguser')}
                      >
                        Pricing
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
          </ModalContent>
        )}
      </Modal>

      <Modal 
        size="sm" 
        isOpen={showLoginAlert} 
        onClose={() => setShowLoginAlert(false)}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Login Required</ModalHeader>
          <ModalBody>
            <p>Please login to access this feature.</p>
          </ModalBody>
          <ModalFooter>
            <Button 
              color="danger" 
              variant="light" 
              onPress={() => setShowLoginAlert(false)}
            >
              Cancel
            </Button>
            <Button 
              color="secondary"
              onPress={() => {
                setShowLoginAlert(false);
                setIsOpen(false);
                navigate('/login');
              }}
            >
              Login
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Project;
