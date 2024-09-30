

import DefaultLayout from "@/layouts/default";

import React from "react";
import {  Card, CardBody, CardHeader, CardFooter, Image, Button, Spacer } from "@nextui-org/react";


export default function Blog2Page() {
  return (
    <DefaultLayout>
      
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold">Hồ cá koi ngoài trời đẹp</h1>
          </CardHeader>
          <CardBody>
            <Image
              src="https://hocakoimiennam.vn/img_data/images/059131098791_HINH-10.png"
              alt="Hồ cá koi ngoài trời đẹp"
              className="w-full h-auto object-cover"
            />
            <Spacer y={4} />
            <p>
              Những hộ gia đình có sân vườn và khuôn viên rộng bên ngoài. Họ có đam mê và yêu thích các loại cá cảnh,
              như là loại cá koi thì việc xây dựng, thi công bể cá koi ngoài trời sẽ là một giải pháp giúp không gian ngoài
              thật đẹp và có giá trị về mặt hình ảnh hơn rất nhiều.
            </p>
            <Spacer y={4} />
            <p>
              Không gian ngoài sân vườn với sự kết hợp của nước, thủy sinh, cá koi...với nhiều màu sắc hòa trộn sẽ mang lại
              một không gian sống động cho sân vườn của bạn. Tính thẩm mỹ chính là một yếu tố giúp cho sân vườn của
              bạn đẹp hơn, mang tính thiên nhiên hơn.
            </p>
            <Spacer y={4} />
            <p>
              Một mẫu hồ cá có kích thước vừa phải lấp đầy những khoảng trống trong sân vườn của bạn, đó chính là
              những điểm ấn tượng mà khách hàng có thể nhìn thấy trong căn nhà của bạn. Sự kết hợp của cây cối, sân
              vườn, giả sơn, cùng với hồ cá koi sẽ tạo nên một không gian hoàn thiện về mặt nội dung và kết cấu.
            </p>
          </CardBody>
          
        </Card>
      
    </DefaultLayout>
  );
}