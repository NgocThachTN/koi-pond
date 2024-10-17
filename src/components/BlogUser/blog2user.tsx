import DefaultLayout from "@/layouts/defaultuser";

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

export default function Blog2PageUser() {
  return (
    <DefaultLayout>

      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Beautiful Koi Pond Gardens</h1>
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
            Households with spacious gardens and outdoor areas, who have a passion and love for ornamental fish
            such as koi, will find that building an outdoor koi pond is a solution that greatly enhances the beauty
            and visual value of their outdoor space.
          </p>
          <Spacer y={4} />
          <p>
            The outdoor garden space, combined with water, aquatic life, and koi fish in a blend of many colors,
            will bring a vibrant atmosphere to your garden. The aesthetic aspect is a key factor in making your
            garden more beautiful and more natural.
          </p>
          <Spacer y={4} />
          <p>
            A moderately sized fish pond that fills the empty spaces in your garden becomes an impressive feature
            that visitors can admire in your home. The combination of trees, garden, rockery, and koi pond will
            create a space that is complete in both content and structure.
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