

import DefaultLayout from "@/layouts/default";

import React from "react";
import { Card, CardBody, CardHeader, CardFooter, Image, Button, Spacer } from "@nextui-org/react";
const images = [
  {
    src: "https://sanvuonadong.vn/wp-content/uploads/2020/07/ho-ca-koi-san-vuon-dep-02-san-vuon-a-dong.jpg",
    alt: "Koi pond image 1"
  },
  {
    src: "https://sanvuonadong.vn/wp-content/uploads/2020/10/mau-ho-ca-koi-goc-san-vuon-01-san-vuon-a-dong.jpg",
    alt: "Koi pond image 2"
  },
  {
    src: "https://congtrinhthicong.com/wp-content/uploads/2021/02/Mau-ho-ca-koi-san-vuon-dep-3.jpg",
    alt: "Koi pond image 3"
  },
  {
    src: "https://gspace.vn/web/media/images/2022/07/02/g2-rs650.jpg",
    alt: "Koi pond image 4"
  }
];

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
            width={1145}
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
        <div className="grid grid-cols-2 grid-rows-2 gap-2 aspect-[4/3]">
  <div className="row-span-2 col-span-1">
    <Image
      src={images[0].src}
      alt={images[0].alt}
      className="object-cover w-full h-full"
      width={600}
      height={800}
    />
  </div>
  <div className="col-span-1">
    <Image
      src={images[1].src}
      alt={images[1].alt}
      className="object-cover w-full h-full"
      width={600}
      height={400}
    />
  </div>
  <div className="col-span-1 grid grid-cols-2 gap-2">
    <Image
      src={images[2].src}
      alt={images[2].alt}
      className="object-cover w-full h-full"
      width={300}
      height={340}
    />
    <Image
      src={images[3].src}
      alt={images[3].alt}
      className="object-cover w-full h-full"
      width={300}
      height={340}
    />
  </div>
</div>
        </CardBody>

      </Card>

    </DefaultLayout>
  );
}