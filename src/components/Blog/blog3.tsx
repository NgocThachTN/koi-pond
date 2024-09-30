import React from "react";
import { NextUIProvider, Card, CardBody, CardHeader, Image, Divider, Button } from "@nextui-org/react";
import DefaultLayout from "@/layouts/default";

export default function Blog3PageUser() {
  return (
    <NextUIProvider>
      <DefaultLayout>
        <Card className="max-w-[800px] mx-auto my-8">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-md">Hồ cá Koi trong nhà là gì?</p>
            </div>
          </CardHeader>
          <Divider/>
          <CardBody>
            <Image
              alt="Hồ cá Koi trong nhà"
              className="object-cover rounded-xl mb-4"
              src="https://canhquanhoanggia.com/sites/default/files/5Hocakoi/69.jpg"
              width={800}
            />
            <p className="text-sm mb-4">
              Cá Koi là một loài cá cảnh cao cấp, được xem như "quốc ngư" của xứ sở mặt trời mọc. Loài cá này có nguồn
              gốc từ cá chép nhưng được thuần chủng hóa thành loài cá cảnh nuôi trong nhà với nhiều màu sắc bắt mắt,
              có ý nghĩa phong thủy tượng trưng cho sự may mắn, thịnh vượng.
            </p>
            <p className="text-sm mb-4">
              Hồ cá Koi trong nhà là loại hồ cá được xây dựng trong khuôn viên nhà ở, có diện tích nhỏ hơn so với hồ cá
              ngoài trời nhưng lại đòi hỏi yêu cầu kỹ thuật cao hơn. Phải đảm bảo sự chuyên nghiệp từ việc chống thấm, hệ
              thống nước thải, hệ thống lọc nước... sao cho không ảnh hưởng đến kết cấu của ngôi nhà. Thi công hồ cá Koi
              trong nhà thường nằm tại các vị trí có ánh sáng mặt trời rọi vào nhằm gần cửa sổ, phòng khách, dưới cầu
              thang để giúp cá sinh trưởng tốt và không bị nhiễm bệnh.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Image
                alt="Hồ cá Koi 1"
                className="object-cover w-full h-full"
                src="https://agsevent.vn/wp-content/uploads/2023/02/ho-ca-koi-mini-trong-nha-2.jpg"
              />
              <Image
                alt="Hồ cá Koi 2"
                className="object-cover w-full h-full"
                src="https://sanvuonphutaidat.vn/upload/images/ho-ca-koi-trong-nha-quan-8-3.jpg"
              />
              <Image
                alt="Hồ cá Koi 3"
                className="object-cover w-full h-full"
                src="https://vuonhoa.vn/uploads/data/1098/files/news/Ho-ca-koi/1-ho-ca-koi-nhat-ban-dep-7.jpg"
              />
              <Image
                alt="Hồ cá Koi 4"
                className="object-cover w-full h-full"
                src="https://kientaocanhquan.com/upload/Thiet-ke-ho-ca-koi-trong-nha.jpg"
              />
            </div>
          </CardBody>
        </Card>
      </DefaultLayout>
    </NextUIProvider>
  );
}