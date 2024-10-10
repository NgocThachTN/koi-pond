import React, { useState, useEffect } from 'react';
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/defaultuser";
import { Input, Select, Textarea, Button, Card, CardBody, CardHeader, Divider, Avatar, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { FaLeaf, FaPhone, FaEnvelope, FaMapMarkerAlt, FaRuler, FaList, FaComments, FaCheckCircle } from 'react-icons/fa';
import { getUserInfoApi, sendSampleRequestApi, sendDesignRequestApi } from '@/apis/user.api';
import { toast } from 'react-toastify';

export default function DocsPageUser() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-8 py-12 md:py-16">
        <div className="text-center">
          <h1 className={title({ color: "violet" })}>Garden Design Services</h1>
          <p className="mt-4 text-lg text-violet-600">We turn your ideas into reality</p>
        </div>
        <QuotationForm />
      </section>
    </DefaultLayout>
  );
}

function QuotationForm() {
  const [selectedRequestType, setSelectedRequestType] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedSampleName, setSelectedSampleName] = useState("");
  const [selectedDesignName, setSelectedDesignName] = useState("");
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [description, setDescription] = useState("");
  const [designRequirements, setDesignRequirements] = useState("");
  const [size, setSize] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    setIsLoading(true);
    try {
      const response = await getUserInfoApi();
      if (response.data) {
        if (Array.isArray(response.data.$values)) {
          const loggedInUserEmail = localStorage.getItem('userEmail');
          const user = response.data.$values.find((u: any) => u.email === loggedInUserEmail);
          if (user) {
            setUserInfo({
              name: user.name || '',
              email: user.email || '',
              phoneNumber: user.phoneNumber || '',
              address: user.address || ''
            });
          }
        } else if (typeof response.data === 'object') {
          setUserInfo({
            name: response.data.name || '',
            email: response.data.email || '',
            phoneNumber: response.data.phoneNumber || '',
            address: response.data.address || ''
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const commonData = {
      user: {
        name: userInfo.name,
        phoneNumber: userInfo.phoneNumber,
        address: userInfo.address,
        userName: userInfo.name,
        email: userInfo.email,
      },
      requestName: selectedRequestType,
      description: description,
    };

    try {
      let response;
      if (selectedService === "sample") {
        const sampleData = {
          ...commonData,
          isSampleSelected: true,
          sample: {
            constructionTypeName: selectedRequestType,
            sampleName: selectedSampleName,
            sampleSize: size,
            samplePrice: 0,
            sampleImage: "",
          },
        };
        response = await sendSampleRequestApi(sampleData);
      } else if (selectedService === "design") {
        const designData = {
          ...commonData,
          isDesignSelected: true,
          design: {
            constructionTypeName: selectedRequestType,
            designName: selectedDesignName,
            designSize: size,
            designPrice: 0,
            designImage: "",
          },
          designRequirements: designRequirements,
        };
        response = await sendDesignRequestApi(designData);
      }

      if (response && response.status === 201) {
        setIsSuccessModalOpen(true);
        // Reset form fields
        setSelectedRequestType("");
        setSelectedService("");
        setSelectedSampleName("");
        setSelectedDesignName("");
        setDescription("");
        setDesignRequirements("");
        setSize("");
      } else {
        toast.error("Failed to submit request. Please try again.");
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  if (isLoading) {
    return <div>Loading user information...</div>;
  }

  return (
    <>
      <Card className="max-w-3xl w-full mx-auto shadow-2xl bg-white/10 backdrop-blur-md">
        <CardHeader className="flex gap-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white p-6">
          <Avatar icon={<FaLeaf size={24} />} className="bg-violet-800" />
          <div className="flex flex-col">
            <p className="text-2xl font-bold">Request a Quote</p>
            <p className="text-small text-white/60">Fill in the details and we'll get back to you</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="p-8">
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                variant="flat"
                isReadOnly
                value={userInfo.name}
                startContent={<FaLeaf className="text-violet-500" />}
              />
              <Input
                label="Email"
                type="email"
                variant="flat"
                isReadOnly
                value={userInfo.email}
                startContent={<FaEnvelope className="text-violet-500" />}
              />
              <Input
                label="Phone Number"
                variant="flat"
                isReadOnly
                value={userInfo.phoneNumber}
                startContent={<FaPhone className="text-violet-500" />}
              />
              <Input
                label="Address"
                variant="flat"
                isReadOnly
                value={userInfo.address}
                startContent={<FaMapMarkerAlt className="text-violet-500" />}
              />
            </div>
            
            <Select 
              label="Request Name"
              placeholder="Choose the type of Koi pond"
              variant="faded"
              startContent={<FaList className="text-violet-500" />}
              onChange={(e) => setSelectedRequestType(e.target.value)}
            >
              <SelectItem key="Landscape Design and Construction" value="Landscape Design and Construction">Landscape Design and Construction</SelectItem>
                <SelectItem key="Garden Design and Construction" value="Garden Design and Construction">Garden Design and Construction</SelectItem>
                <SelectItem key="Patio Design and Construction" value="Patio Design and Construction">Patio Design and Construction</SelectItem>
                <SelectItem key="Koi Pond Design and Construction" value="Koi Pond Design and Construction">Koi Pond Design and Construction</SelectItem>
                <SelectItem key="Vertical Garden Design and Construction" value="Vertical Garden Design and Construction">Vertical Garden Design and Construction</SelectItem>
                <SelectItem key="Other Services" value="other">Other Services</SelectItem>
            </Select>

            {selectedRequestType && (
              <Select 
                label="Type"
                placeholder="Choose the service you're interested in"
                variant="faded"
                startContent={<FaList className="text-violet-500" />}
                onChange={(e) => setSelectedService(e.target.value)}
              >
                <SelectItem key="sample" value="sample">Sample Projects</SelectItem>
                <SelectItem key="design" value="design">Custom Design</SelectItem>
              </Select>
            )}
            
            {selectedService === "sample" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select 
                  label="Sample Name"
                  placeholder="Choose the project type"
                  variant="faded"
                  startContent={<FaList className="text-violet-500" />}
                  onChange={(e) => setSelectedSampleName(e.target.value)}
                >
                  <SelectItem key="Traditional Koi Pond" value="Traditional Koi Pond">Traditional Koi Pond</SelectItem>
                  <SelectItem key="Modern Koi Pond" value="Modern Koi Pond">Modern Koi Pond</SelectItem>
                  <SelectItem key="Natural Koi Pond" value="Natural Koi Pond">Natural Koi Pond</SelectItem>
                  <SelectItem key="Indoor Koi Pond" value="Indoor Koi Pond">Indoor Koi Pond</SelectItem>
                </Select>

                <Select 
                  label="Sample Size"
                  placeholder="Choose the project size"
                  variant="faded"
                  startContent={<FaRuler className="text-violet-500" />}
                  onChange={(e) => setSize(e.target.value)}
                >
                  <SelectItem key="Small (up to 500 gallons)" value="Small (up to 500 gallons)">Small (up to 500 gallons)</SelectItem>
                  <SelectItem key="Medium (500-1500 gallons)" value="Medium (500-1500 gallons)">Medium (500-1500 gallons)</SelectItem>
                  <SelectItem key="Large (1500-5000 gallons)" value="Large (1500-5000 gallons)">Large (1500-5000 gallons)</SelectItem>
                  <SelectItem key="Extra Large (5000+ gallons)" value="Extra Large (5000+ gallons)">Extra Large (5000+ gallons)</SelectItem>
                </Select>
              </div>
            )}

            {selectedService === "design" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select 
                  label="Design Name"
                  placeholder="Choose the design type"
                  variant="faded"
                  startContent={<FaList className="text-violet-500" />}
                  onChange={(e) => setSelectedDesignName(e.target.value)}
                >
                  <SelectItem key="Traditional Koi Pond" value="Traditional Koi Pond">Traditional Koi Pond</SelectItem>
                  <SelectItem key="Modern Koi Pond" value="Modern Koi Pond">Modern Koi Pond</SelectItem>
                  <SelectItem key="Natural Koi Pond" value="Natural Koi Pond">Natural Koi Pond</SelectItem>
                  <SelectItem key="Zen-style Koi Pond" value="Zen-style Koi Pond">Zen-style Koi Pond</SelectItem>
                  <SelectItem key="Raised Koi Pond" value="Raised Koi Pond">Raised Koi Pond</SelectItem>
                </Select>

                <Select 
                  label="Design Size"
                  placeholder="Choose the design size"
                  variant="faded"
                  startContent={<FaRuler className="text-violet-500" />}
                  onChange={(e) => setSize(e.target.value)}
                >
                  <SelectItem key="Small (up to 500 gallons)" value="Small (up to 500 gallons)">Small (up to 500 gallons)</SelectItem>
                  <SelectItem key="Medium (500-1500 gallons)" value="Medium (500-1500 gallons)">Medium (500-1500 gallons)</SelectItem>
                  <SelectItem key="Large (1500-5000 gallons)" value="Large (1500-5000 gallons)">Large (1500-5000 gallons)</SelectItem>
                  <SelectItem key="Extra Large (5000+ gallons)" value="Extra Large (5000+ gallons)">Extra Large (5000+ gallons)</SelectItem>
                </Select>
              </div>
            )}

            <Textarea 
              label="Request Details"
              placeholder="Describe your requirements in detail"
              variant="faded"
              minRows={3}
              startContent={<FaComments className="text-violet-500 mt-2" />}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button 
              type="submit"
              color="secondary" 
              className="w-full text-lg font-semibold py-6 bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Submit Quote Request
            </Button>
          </form>
          <p className="text-sm text-violet-400 mt-6 text-center">*We typically respond within 24 business hours</p>
        </CardBody>
      </Card>

      <Modal 
        isOpen={isSuccessModalOpen} 
        onClose={() => setIsSuccessModalOpen(false)}
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Request Submitted Successfully</ModalHeader>
              <ModalBody>
                <div className="flex items-center gap-4">
                  <FaCheckCircle className="text-green-500 text-4xl" />
                  <p>Your quote request has been submitted successfully!</p>
                </div>
                <p className="text-sm text-gray-500 mt-2">We'll get back to you within 24 business hours.</p>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}