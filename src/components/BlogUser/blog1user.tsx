import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/defaultuser";
import { Card, CardBody, CardHeader, Image, Divider } from "@nextui-org/react";
import Chatbot from '@/components/Chatbot/Chatbot';
export default function Blog1PageUser() {
  return (
    <DefaultLayout>
      <div className="max-w-[900px] mx-auto px-6">
        <h1 className={title({ color: "violet" })}>Mini Koi Pond</h1>
        <div className="gap-6 grid grid-cols-1">
          <Card>
            <CardBody className="p-0">
              <Image
                alt="Mini Koi Pond"
                className="object-cover"
                height={400}
                src="https://caycanhdaiphu.com/wp-content/uploads/2020/02/20-thiet-ke-ho-ca-koi-mini_1.png"
                width="100%"
              />
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <h3 className="text-2xl font-bold">About Mini Koi Ponds</h3>
            </CardHeader>
            <CardBody>
              <p>
                Mini koi ponds are a compact version of traditional koi ponds, designed to fit in smaller spaces.
                They offer a beautiful and tranquil addition to homes, featuring:
              </p>
              <ul className="list-disc list-inside my-2">
                <li>Smaller dimensions suitable for various locations</li>
                <li>Elegant design with modern materials</li>
                <li>Low maintenance requirements</li>
                <li>A perfect blend of aesthetics and functionality</li>
              </ul>
              <p>
                These miniature ponds are ideal for those who want to enjoy the beauty of koi fish without
                the need for a large outdoor space. They can be installed in various locations such as patios,
                balconies, or even indoors, adding a unique and calming element to your living space.
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
                <div className="col-span-2 relative h-1/2">
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
        </div>
      </div>
      <Chatbot />
    </DefaultLayout>
  );
}