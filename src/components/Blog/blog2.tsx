

import DefaultLayout from "@/layouts/default";

import React from "react";
import { Card, CardBody, CardHeader, CardFooter, Image, Button, Spacer } from "@nextui-org/react";


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
        <CardBody>
          <div className="grid grid-cols-2 gap-4 h-[600px]">
            <div className="col-span-1 relative h-1/2">
              <Image
                src="https://cakoihoangphi.com/wp-content/uploads/2022/12/051220224.jpg"
                alt="Koi pond image 1"
                className="object-cover"
                height={230}
                width={398.5}
              />
            </div>
            <div className="col-span-1 relative h-1/2">
              <Image
                src="https://sanvuonadong.vn/wp-content/uploads/2020/10/ho-ca-koi-mini-bang-kinh-02-san-vuon-a-dong.jpg"
                alt="Koi pond image 2"
                className="object-cover"
                height={230}
                width={398.5}

              />
            </div>
            <div className="col-span-1 relative h-1/2">
              <Image
                src="https://shopheo.com/wp-content/uploads/2022/12/be-ca-koi-mini-dat-chuan.jpg"
                alt="Koi pond image 3"
                className="object-cover"
                height={600}
                width={828}

              />
            </div>
          </div>
        </CardBody>

      </Card>

    </DefaultLayout>
  );
}