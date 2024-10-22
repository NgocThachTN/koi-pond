import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import TeamSection from "@/components/TeamSection/TeamSection";
import Head from "next/head";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Divider } from "@nextui-org/divider";
import { Button } from "@nextui-org/button";
import { CheckIcon } from '@heroicons/react/24/solid';
import { TitleManager } from '@/components/TitleManager';
import Chatbot from '@/components/Chatbot/Chatbot';
export default function AboutPage() {
  const reasons = [
    {
      title: "Unparalleled Expertise",
      description: "With over 20 years of experience, our master craftsmen bring unmatched skill to every project.",
    },
    {
      title: "Innovative Designs",
      description: "We blend traditional techniques with cutting-edge technology to create unique, stunning Koi ponds.",
    },
    {
      title: "Eco-Friendly Approach",
      description: "Our sustainable practices ensure your Koi pond is not only beautiful but also environmentally responsible.",
    },
    {
      title: "Comprehensive Service",
      description: "From initial design to ongoing maintenance, we provide end-to-end solutions for your Koi pond needs.",
    },
    {
      title: "Quality Assurance",
      description: "We use only premium materials and state-of-the-art filtration systems for long-lasting quality.",
    },
    {
      title: "Client-Centric Focus",
      description: "Your vision is our priority. We work closely with you to bring your dream Koi pond to life.",
    },
  ];

  return (
    <>
      <DefaultLayout>
        <TitleManager title="Koi Pond Construction | About" />
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <div className="text-center max-w-3xl">
            <h1 className={title({ color: "violet" })}>Crafting Aquatic Masterpieces</h1>
            <h2 className={subtitle({ class: "mt-4" })}>
              Elevating Outdoor Spaces with Exquisite Koi Pond Design and Construction
            </h2>
          </div>

          <Card className="max-w-[1000px] w-full">
            <CardBody className="flex flex-col md:flex-row gap-6 p-0">
              <Image
                alt="Koi Pond Showcase"
                className="object-cover w-full md:w-1/2 h-[300px] md:h-auto"
                src="https://images.unsplash.com/photo-1595569099048-7f7a5f4c8f2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              />
              <div className="p-6 flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-4">Our Legacy of Excellence</h3>
                <p className="text-lg">
                  For over two decades, our Koi Pond Construction has been at the forefront of aquascaping innovation. 
                  Our team of master craftsmen and aquatic experts blend artistry with cutting-edge technology to create 
                  living, breathing ecosystems that captivate and inspire.
                </p>
              </div>
            </CardBody>
          </Card>

          <Divider className="my-8" />

          <div className="max-w-[1000px] w-full">
            <h3 className={title({ size: "sm", className: "text-center mb-12" })}>Why Choose Us</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {reasons.map((reason, index) => (
                <Card key={index} className="p-4">
                  <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <h4 className="text-lg font-bold flex items-center gap-2">
                      <CheckIcon className="w-5 h-5 text-success" />
                      {reason.title}
                    </h4>
                  </CardHeader>
                  <CardBody className="overflow-visible py-2">
                    <p className="text-default-500">{reason.description}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>

          <Divider className="my-8" />

          <div className="w-full max-w-[1000px]">
            <h3 className={title({ size: "sm", className: "text-center mb-8" })}>Meet Our Team</h3>
            <TeamSection />
          </div>
        </section>
        <Chatbot />
      </DefaultLayout>
    </>
  );
}