import { Link } from "@nextui-org/link";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { button as buttonStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <span className={title()}>Thiết kế và Thi công&nbsp;</span>
          <span className={title({ color: "primary" })}>Hồ cá Koi&nbsp;</span>
          <br />
          <span className={title()}>
            chuyên nghiệp, đẳng cấp
          </span>
          <div className={subtitle({ class: "mt-4" })}>
            Mang vẻ đẹp của thiên nhiên vào không gian sống của bạn
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
            })}
            href="#services"
          >
            Dịch vụ của chúng tôi
          </Link>
          <Link
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href="#contact"
          >
            Liên hệ
          </Link>
        </div>

        <div className="max-w-[900px] gap-2 grid grid-cols-12 grid-rows-2 px-8">
          <Card className="col-span-12 sm:col-span-4 h-[300px]">
            <CardBody className="overflow-visible p-0">
              <Image
                shadow="sm"
                radius="lg"
                width="100%"
                alt="Hồ cá Koi"
                className="w-full object-cover h-[300px]"
                src="https://example.com/koi-pond-1.jpg"
              />
            </CardBody>
          </Card>
          <Card className="col-span-12 sm:col-span-4 h-[300px]">
            <CardBody className="overflow-visible p-0">
              <Image
                shadow="sm"
                radius="lg"
                width="100%"
                alt="Thiết kế hồ cá"
                className="w-full object-cover h-[300px]"
                src="https://example.com/koi-pond-2.jpg"
              />
            </CardBody>
          </Card>
          <Card className="col-span-12 sm:col-span-4 h-[300px]">
            <CardBody className="overflow-visible p-0">
              <Image
                shadow="sm"
                radius="lg"
                width="100%"
                alt="Thi công hồ cá"
                className="w-full object-cover h-[300px]"
                src="https://example.com/koi-pond-3.jpg"
              />
            </CardBody>
          </Card>
        </div>
      </section>
    </DefaultLayout>
  );
}
