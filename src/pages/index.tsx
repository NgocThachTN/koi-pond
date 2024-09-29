import { Link } from "@nextui-org/link";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { button as buttonStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import TeamSection from "@/components/TeamSection/TeamSection";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="w-full flex flex-col md:flex-row items-center">
          <div className="w-full md:w-2/3">
            <Image
              shadow="sm"
              radius="lg"
              width="100%"
              alt="Hồ cá Koi"
              className="w-full object-cover h-[500px]"
              src="https://ran.com.vn/wp-content/uploads/2022/09/5-loi-can-tranh-khi-xay-ho-ca-koi-1024x624.jpg"
            />
          </div>
          <div className="w-full md:w-1/3 p-4 md:p-8">
            <div className="text-center md:text-left">
              <span className={title()}>Thiết kế và Thi công&nbsp;</span>
              <span className={title({ color: "violet" })}>Hồ cá Koi&nbsp;</span>
              <br />
              <span className={title()}>
                chuyên nghiệp, đẳng cấp
              </span>
              <div className={subtitle({ class: "mt-4" })}>
                Mang vẻ đẹp của thiên nhiên vào không gian sống của bạn
              </div>
            </div>

            <div className="flex gap-3 justify-center md:justify-start mt-6">
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
          </div>
        </div>
      </section>

      {/* Thêm TeamSection vào đây */}
      <TeamSection />
    </DefaultLayout>
    
  );
}
