import React from 'react'
import { Card } from "@nextui-org/react";
import { FaKiwiBird, FaWater, FaTools, FaLeaf } from 'react-icons/fa';

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => {
  if (!Icon) {
    console.error('Icon is undefined for:', title);
    return null;
  }
  
  return (
    <Card className="max-w-[400px] p-4">
      <div className="flex items-center gap-3 mb-2">
        <Icon className="text-default-500" size={24} />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p>{description}</p>
    </Card>
  )
}

function index() {
  const features = [
    { icon: FaKiwiBird, title: "Cá Koi Đa Dạng", description: "Hồ cá của chúng tôi có nhiều loại cá Koi với màu sắc và hoa văn đa dạng." },
    { icon: FaWater, title: "Hệ Thống Lọc Tiên Tiến", description: "Sử dụng công nghệ lọc nước hiện đại để duy trì môi trường sống tốt nhất cho cá." },
    { icon: FaTools, title: "Bảo Trì Chuyên Nghiệp", description: "Đội ngũ chuyên gia thường xuyên kiểm tra và bảo dưỡng hồ cá." },
    { icon: FaLeaf, title: "Cảnh Quan Tự Nhiên", description: "Thiết kế hồ cá với cảnh quan tự nhiên, tạo môi trường sống lý tưởng cho cá Koi." },
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
