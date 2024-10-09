import { Link } from "@nextui-org/link";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { button as buttonStyles } from "@nextui-org/theme"; // trước khi dùng nhớ npm install --save-dev @iconify/react và npm install clsx tailwind-merge
import Slider from "react-slick"; //npm install --save-dev @types/react-slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/defaultuser";
import TeamSection from "@/components/TeamSection/TeamSection";
import Features3 from "@/components/features3/index";
import Process from "@/components/Process/process";
import Project from "@/components/project/project";
export default function UserPage() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const images = [
    "https://ran.com.vn/wp-content/uploads/2022/09/5-loi-can-tranh-khi-xay-ho-ca-koi-1024x624.jpg",
    "https://images.pexels.com/photos/2131846/pexels-photo-2131846.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/2131828/pexels-photo-2131828.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/2067508/pexels-photo-2067508.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/27817439/pexels-photo-27817439/free-photo-of-golden-fish.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  ];

  return (
    <>
      <DefaultLayout>
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <div className="w-full flex flex-col md:flex-row items-center">
            <div className="w-full md:w-2/3">
              <Slider {...settings}>
                {images.map((image, index) => (
                  <div key={index}>
                    <Image
                      shadow="sm"
                      radius="lg"
                      width="100%"
                      alt={`Hồ cá Koi ${index + 1}`}
                      className="w-full object-cover h-[500px]"
                      src={image}
                    />
                  </div>
                ))}
              </Slider>
            </div>
            <div className="w-full md:w-1/3 p-4 md:p-8">
              <div className="text-center md:text-left">
                <span className={title()}>
                  Professional and high-class&nbsp;
                </span>
                <span className={title({ color: "violet" })}>
                  Koi pond&nbsp;
                </span>
                <br />
                <span className={title()}>design and construction.</span>
                <div className={subtitle({ class: "mt-4" })}>
                  Bring the beauty of nature into your living space.
                </div>
              </div>

              <div className="flex gap-3 justify-center md:justify-start mt-6 ">
                <Link
                  className={buttonStyles({
                    color: "secondary",
                    radius: "full",
                    variant: "shadow",
                  })}
                  href="/pricinguser"
                >
                  Our Services
                </Link>
                <Link
                  className={buttonStyles({
                    color: "secondary",
                    variant: "bordered",
                    radius: "full",
                  })}
                  href="#contact"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>
        {/* Thêm Teamsection vào đây */}
        <Features3 />
        <Process />
        <Project />
        <TeamSection /> {/* Em để TeamSection trên cái components á. */}
      </DefaultLayout>
    </>
  );
}
