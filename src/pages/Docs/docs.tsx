import React from 'react';
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Input, Select, Textarea, Button, Card, CardBody, SelectItem } from "@nextui-org/react";

export default function DocsPage() {
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
    <Card className="max-w-2xl w-full mx-auto shadow-lg">
      <CardBody className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-violet-600">Request a Quote</h2>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Full Name" placeholder="Enter your full name" variant="bordered" />
            <Input label="Email" placeholder="example@email.com" type="email" variant="bordered" />
            <Input label="Phone Number" placeholder="1234567890" variant="bordered" />
            <Input label="Address" placeholder="Enter your address" variant="bordered" />
          </div>
          <Input label="Garden Area (m2)" placeholder="e.g., 100" variant="bordered" />
          <Select 
            label="Select Service" 
            placeholder="Choose the service you're interested in"
            variant="bordered"
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
            variant="bordered"
            minRows={3}
          />
          <Button color="secondary" className="w-full text-lg font-semibold py-6 bg-violet-600 text-white hover:bg-violet-700">
            Submit Quote Request
          </Button>
        </form>
        <p className="text-sm text-violet-500 mt-4 text-center">*We typically respond within 24 business hours</p>
      </CardBody>
    </Card>
  );
}
