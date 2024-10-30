import React from "react";
import {
  Card,
  CardBody,
  Button,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import {
  FaKiwiBird,
  FaWater,
  FaTools,
  FaLeaf,
  FaArrowRight,
} from "react-icons/fa";
import { motion } from "framer-motion";

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  detailedInfo,
  index,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  detailedInfo: {
    overview: string;
    benefits: string[];
    process: string[];
  };
  index: number;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <Card
          className="w-full md:max-w-[400px] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl h-full"
          isPressable
          isHoverable
        >
          <CardBody className="p-6 flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-full bg-secondary/20">
                <Icon className="text-secondary" size={28} />
              </div>
              <h3 className="text-xl font-bold">{title}</h3>
            </div>
            <Divider className="my-4" />
            <p className="text-default-500 text-base leading-relaxed flex-grow">
              {description}
            </p>
            <Button
              endContent={<FaArrowRight className="text-sm" />}
              color="secondary"
              variant="light"
              className="mt-4 self-start"
              onPress={onOpen}
            >
              Learn More
            </Button>
          </CardBody>
        </Card>
      </motion.div>

      <Modal
        size="2xl"
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex gap-3 items-center">
            <Icon className="text-secondary" size={24} />
            <span>{title}</span>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-semibold mb-2">Overview</h4>
                <p className="text-default-500">{detailedInfo.overview}</p>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-2">Key Benefits</h4>
                <ul className="list-disc list-inside space-y-2 text-default-500">
                  {detailedInfo.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-2">Our Process</h4>
                <ol className="list-decimal list-inside space-y-2 text-default-500">
                  {detailedInfo.process.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

function index() {
  const features = [
    {
      icon: FaKiwiBird,
      title: "Diverse Koi Collection",
      description:
        "Explore our extensive collection of premium Koi fish, featuring rare varieties and stunning color patterns. Each fish is carefully selected and certified for quality.",
      detailedInfo: {
        overview:
          "Our Koi collection represents the finest specimens from renowned Japanese breeders, featuring diverse varieties including Kohaku, Sanke, Showa, and many other premium breeds.",
        benefits: [
          "Access to rare and exclusive Koi varieties",
          "Health-certified fish with documented lineage",
          "Expert guidance on Koi selection based on your pond specifications",
          "Quarantine and acclimatization services included",
          "Post-purchase health monitoring and support",
        ],
        process: [
          "Initial consultation to understand your preferences and pond conditions",
          "Personalized selection from our premium Koi collection",
          "Health certification and documentation review",
          "Controlled quarantine period",
          "Professional transportation and introduction to your pond",
        ],
      },
    },
    {
      icon: FaWater,
      title: "Advanced Water Systems",
      description:
        "State-of-the-art filtration and monitoring systems ensure optimal water quality. Our technology maintains perfect pH levels and crystal-clear water conditions 24/7.",
      detailedInfo: {
        overview:
          "Our advanced water management systems combine cutting-edge technology with proven biological filtration methods to create the perfect environment for your Koi.",
        benefits: [
          "24/7 automated water quality monitoring",
          "Multi-stage filtration system",
          "Energy-efficient operation",
          "Remote monitoring capabilities",
          "Automated feeding systems integration",
        ],
        process: [
          "Site assessment and water quality analysis",
          "Custom filtration system design",
          "Professional installation with minimal disruption",
          "System calibration and testing",
          "Staff training and maintenance schedule setup",
        ],
      },
    },
    {
      icon: FaTools,
      title: "Expert Maintenance",
      description:
        "Our certified technicians provide comprehensive maintenance services, from routine care to emergency support. We ensure your pond ecosystem stays healthy year-round.",
      detailedInfo: {
        overview:
          "Our expert maintenance team is trained to handle all aspects of Koi pond care, from routine cleaning and feeding to emergency repairs and support.",
        benefits: [
          "Comprehensive maintenance services",
          "Emergency support and response",
          "Routine care and cleaning",
          "Feeding and nutrition management",
          "Health monitoring and disease prevention",
        ],
        process: [
          "Initial consultation to understand your specific needs",
          "Customized maintenance plan based on your pond's requirements",
          "Routine care and cleaning services",
          "Feeding and nutrition management",
          "Health monitoring and disease prevention",
        ],
      },
    },
    {
      icon: FaLeaf,
      title: "Natural Habitat Design",
      description:
        "Custom-designed landscapes that blend natural elements with modern aesthetics. We create sustainable environments that enhance both fish health and visual appeal.",
      detailedInfo: {
        overview:
          "Our natural habitat design team works closely with you to create a custom landscape that blends natural elements with modern aesthetics.",
        benefits: [
          "Customized landscape design",
          "Sustainable environment",
          "Enhanced fish health",
          "Visual appeal",
          "Environmental sustainability",
        ],
        process: [
          "Initial consultation to understand your specific needs",
          "Customized landscape design",
          "Sustainable environment",
          "Enhanced fish health",
          "Visual appeal",
          "Environmental sustainability",
        ],
      },
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-[#8B5CF6] mb-4"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Professional Koi Services
          </motion.h2>
          <motion.p 
            className="text-xl dark:text-white text-gray-800 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Discover our comprehensive range of professional services designed
            to create and maintain the perfect environment for your precious Koi
            collection.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default index;
