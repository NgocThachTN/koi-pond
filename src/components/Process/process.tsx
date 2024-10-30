import React from 'react';
import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import { motion } from "framer-motion";
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const processSteps = [
  {
    number: "1",
    title: "Project Brief and Quotation",
    description: "Includes: Design brief & moodboard - Estimated timeline - Design quotation & contract"
  },
  {
    number: "2",
    title: "Concept Design Documentation",
    description: "Includes: 2D & 3D visualizations - Specifications - Simulation models"
  },
  {
    number: "3",
    title: "Basic to Detailed Design Documentation",
    description: "Includes basic design documentation and detailed construction documentation"
  },
  {
    number: "4",
    title: "Construction Quotation",
    description: "Includes: BOQ, Cost estimation, Budget according to state standards... Quotation and contract"
  },
  {
    number: "5",
    title: "Construction Management",
    description: "Organize construction or manage, coordinate, and supervise the project"
  },
  {
    number: "6",
    title: "Acceptance, Handover, and Maintenance",
    description: "Project acceptance, handover, warranty, maintenance, and as-built documentation"
  }
]

function Process() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-b from-background to-background/40">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-12"
      >
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-violet-700">
            Our Project Process
          </h2>
          <p className="text-lg text-default-600 max-w-2xl mx-auto">
            A systematic approach to bring your dream project to life
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {processSteps.map((step) => (
            <motion.div key={step.number} variants={itemVariants}>
              <Card 
                className="h-full border-none bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-all duration-300"
                shadow="sm"
                isPressable
              >
                <CardHeader className="flex gap-4 pb-2 pt-6 px-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-violet-500 to-violet-600 text-white font-bold text-xl">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground flex-1">
                    {step.title}
                  </h3>
                </CardHeader>
                <Divider className="opacity-50"/>
                <CardBody className="px-6 py-4 flex-1">
                  <div className="space-y-3">
                    {step.description.split(' - ').map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircleIcon className="w-5 h-5 text-violet-500 flex-shrink-0 mt-1" />
                        <p className="text-default-500 leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Process;
