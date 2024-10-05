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
              <p className="text-md">What is Koi Pond Indoor?</p>
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
              Koi fish is a high-end ornamental fish species, considered the "national fish" of the Land of the Rising Sun. 
              This species originates from carp but has been domesticated into an indoor ornamental fish with many eye-catching colors,
               having feng shui significance symbolizing luck and prosperity.
            </p>
            <p className="text-sm mb-4">
              An indoor Koi pond is a type of fish pond built within residential premises, smaller
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Image
                alt="Hồ cá Koi 1"
                className="object-cover w-full h-full"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0puaqzOaJX0dzGgqOcP8wILg_jbiv_vHIzQ&s"
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