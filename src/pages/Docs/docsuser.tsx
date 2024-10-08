import React from 'react';
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/defaultuser";
import { Input, Select, Textarea, Button, Card, CardBody, CardHeader, Divider, Avatar, SelectItem, Chip } from "@nextui-org/react";
import { FaLeaf, FaPhone, FaEnvelope, FaMapMarkerAlt, FaRuler, FaList, FaComments } from 'react-icons/fa';

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
  return (
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
        <form className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              variant="faded"
              startContent={<FaLeaf className="text-violet-500" />}
            />
            <Input
              label="Email"
              placeholder="example@email.com"
              type="email"
              variant="faded"
              startContent={<FaEnvelope className="text-violet-500" />}
            />
            <Input
              label="Phone Number"
              placeholder="1234567890"
              variant="faded"
              startContent={<FaPhone className="text-violet-500" />}
            />
            <Input
              label="Address"
              placeholder="Enter your address"
              variant="faded"
              startContent={<FaMapMarkerAlt className="text-violet-500" />}
            />
          </div>
          <Input
            label="Garden Area (m²)"
            placeholder="e.g., 100"
            variant="faded"
            startContent={<FaRuler className="text-violet-500" />}
            endContent={<Chip size="sm" variant="flat" color="secondary">m²</Chip>}
          />
          <Select 
            label="Select Service"
            placeholder="Choose the service you're interested in"
            variant="faded"
            startContent={<FaList className="text-violet-500" />}
          >
            <SelectItem key="landscape" value="landscape">Landscape Design and Construction</SelectItem>
            <SelectItem key="garden" value="garden">Garden Design and Construction</SelectItem>
            <SelectItem key="patio" value="patio">Patio Design and Construction</SelectItem>
            <SelectItem key="koi-pond" value="koi-pond">Koi Pond Design and Construction</SelectItem>
            <SelectItem key="vertical-garden" value="vertical-garden">Vertical Garden Design and Construction</SelectItem>
            <SelectItem key="other" value="other">Other Services</SelectItem>
          </Select>
          <Textarea 
            label="Request Details"
            placeholder="Describe your requirements in detail"
            variant="faded"
            minRows={3}
            startContent={<FaComments className="text-violet-500 mt-2" />}
          />
          <Button 
            color="secondary" 
            className="w-full text-lg font-semibold py-6 bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Submit Quote Request
          </Button>
        </form>
        <p className="text-sm text-violet-400 mt-6 text-center">*We typically respond within 24 business hours</p>
      </CardBody>
    </Card>
  );
}
