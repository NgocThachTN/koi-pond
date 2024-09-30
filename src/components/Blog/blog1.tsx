import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Card, CardBody, CardHeader, Image, Divider } from "@nextui-org/react";

export default function Blog1Page() {
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
            <Divider />
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
          </Card>
        </div>
      </div>
    </DefaultLayout>
  );
}