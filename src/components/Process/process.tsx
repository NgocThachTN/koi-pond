import React from 'react'
import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react"

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
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center mb-10">
        Project Process
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {processSteps.map((step) => (
          <Card 
            key={step.number} 
            className="max-w-[400px] transition-transform duration-300 hover:scale-105 hover:-translate-y-2"
          >
            <CardHeader className="flex gap-3">
              <div className="flex flex-col">
                <p className="text-md text-warning">{step.number}</p>
                <p className="text-md">{step.title}</p>
              </div>
            </CardHeader>
            <Divider/>
            <CardBody>
              <p>{step.description}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Process
