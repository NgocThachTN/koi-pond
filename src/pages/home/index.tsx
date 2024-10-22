import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Link } from "@nextui-org/link";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { button as buttonStyles } from "@nextui-org/theme"; // trước khi dùng nhớ npm install --save-dev @iconify/react và npm install clsx tailwind-merge
import Slider from "react-slick"; //npm install --save-dev @types/react-slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import TeamSection from "@/components/TeamSection/TeamSection";
import Features3 from "@/components/features3/index";
import Process from "@/components/Process/process";
import Project from "@/components/project/project";
import { AuthProvider } from '@apis/authen';
import { useInView } from 'react-intersection-observer';
import Chatbot from '@/components/Chatbot/Chatbot';

export default function IndexPage() {
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

  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1, // Adjust this value to control when the animation triggers
  });

  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [processRef, processInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [projectRef, projectInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [teamRef, teamInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  useEffect(() => {
    if (featuresInView) controls.start("visible");
  }, [controls, featuresInView]);

  useEffect(() => {
    if (processInView) controls.start("visible");
  }, [controls, processInView]);

  useEffect(() => {
    if (projectInView) controls.start("visible");
  }, [controls, projectInView]);

  useEffect(() => {
    if (teamInView) controls.start("visible");
  }, [controls, teamInView]);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
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
              <motion.div
                className={subtitle({ class: "mt-4" })}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                Bring the beauty of nature into your living space.
              </motion.div>
            </div>

            <motion.div
              className="flex gap-3 justify-center md:justify-start mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <Link
                className={buttonStyles({
                  color: "primary",
                  radius: "full",
                  variant: "shadow",
                })}
                href="/pricing"
              >
                Our Services
              </Link>
              <Link
                className={buttonStyles({
                  variant: "bordered",
                  radius: "full",
                })}
                href="/login"
              >
                Contact Us
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      <motion.div
        ref={featuresRef}
        animate={controls}
        initial="hidden"
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 50 }
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Features3 />
      </motion.div>
      
      <motion.div
        ref={processRef}
        animate={controls}
        initial="hidden"
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 50 }
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Process />
      </motion.div>

      <motion.div
        ref={projectRef}
        animate={controls}
        initial="hidden"
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 50 }
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Project />
      </motion.div>

      <motion.div
        ref={teamRef}
        animate={controls}
        initial="hidden"
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 50 }
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <TeamSection />
      </motion.div>
      <Chatbot />
    </DefaultLayout>
  );
}
