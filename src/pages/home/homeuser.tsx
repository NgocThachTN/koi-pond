import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Link } from "@nextui-org/link";
import { Image } from "@nextui-org/image";
import { button as buttonStyles } from "@nextui-org/theme";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/defaultuser";
import TeamSection from "@/components/TeamSection/TeamSection";
import Features3 from "@/components/features3/index";
import Process from "@/components/Process/process";
import Project from "@/components/project/project";
import { useInView } from 'react-intersection-observer';
import { TitleManager } from '@/components/TitleManager';
import Chatbot from '@/components/Chatbot/Chatbot';

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
      <TitleManager title="Koi Pond Construction | Home" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <DefaultLayout>
          <motion.section
            className="flex flex-col items-center justify-center gap-4 py-8 md:py-10"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-full flex flex-col md:flex-row items-center">
              <motion.div
                className="w-full md:w-2/3"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
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
              </motion.div>
              <motion.div
                className="w-full md:w-1/3 p-4 md:p-8"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="text-center md:text-left">
                  <motion.span
                    className={title()}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    Professional and high-class&nbsp;
                  </motion.span>
                  <motion.span
                    className={title({ color: "violet" })}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    Koi pond&nbsp;
                  </motion.span>
                  <br />
                  <motion.span
                    className={title()}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    design and construction.
                  </motion.span>
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
              </motion.div>
            </div>
          </motion.section>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Features3 />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Process />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Project />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <TeamSection />
          </motion.div>
        </DefaultLayout>
      </motion.div>
      <Chatbot />
    </>
  );
}
