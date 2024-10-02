import React from 'react'
import { Card, CardHeader, CardBody, Image, Button } from "@nextui-org/react"

function Project() {
  // Mảng chứa thông tin về các dự án
  const projects = [
    { id: 1, image: "https://zenus.vn/image/catalog/dich-vu/ho-ca-koi-bo-da-zenus-min.jpg", name: "Dự án 1" },
    { id: 2, image: "https://zenus.vn/image/catalog/dich-vu/thi-cong-ho-koi-zenus10.jpg", name: "Dự án 2" },
    { id: 3, image: "https://zenus.vn/image/catalog/tin-tuc/11.jpg", name: "Dự án 3" },
    { id: 4, image: "https://zenus.vn/image/catalog/tin-tuc/Goc-chuyen-gia/ho-a-koi-dep-min.jpg", name: "Dự án 4" },
    { id: 5, image: "https://i.pinimg.com/564x/75/fb/74/75fb74ac19f2265eb7bc14fcc4a9c74b.jpg", name: "Dự án 5" },
    { id: 6, image: "https://i.pinimg.com/564x/27/e6/ff/27e6ff56aebe6446dd99858ff64f5241.jpg", name: "Dự án 6" },
    { id: 7, image: "https://i.pinimg.com/564x/82/3b/a1/823ba18a245a562e4b272910a8f521de.jpg", name: "Dự án 7" },
    { id: 8, image: "https://i.pinimg.com/736x/d2/78/9b/d2789b6e2f77181ebcc45ef214e7ef27.jpg", name: "Dự án 8" },
  ]

  return (
    <Card className="w-full mb-2 space-y-2 mt-16">
      <CardHeader className="flex-col items-start px-4 pt-2 pb-0 space-y-2">
        <p className="text-tiny uppercase font-bold">OUR PROJECT</p>
        <h4 className="text-large font-bold">Dự án nổi bật</h4>
        
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <div className="grid grid-cols-4 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="relative">
              <Image
                alt={`Dự án ${project.name}`}
                className="object-cover rounded-xl w-full aspect-square"
                src={project.image}
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-lg font-bold">{project.name}</p>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}

export default Project
