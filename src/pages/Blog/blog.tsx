import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Card, CardHeader, CardBody, CardFooter, Image, Link, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { TitleManager } from '@/components/TitleManager';
import Chatbot from '@/components/Chatbot/Chatbot';

const posts = [

  { name: "Mini Koi Pond", href: "/blog/blog1 ", src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcuzvYzDSx5ofrVNoq2WwOQtOq5KEdE9NRwg&s" },
  { name: "Koi Pond Garden", href: "/blog/blog2", src: "https://hocakoimiennam.vn/img_data/images/059131098791_HINH-10.png" },
  { name: "Koi Pond Indoor", href: "/blog/blog3", src: "https://hocakoimiennam.vn/img_data/images/ho%203.jpg" },

];

const container = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

export default function BlogPage() {
  return (
    <DefaultLayout>
      <TitleManager title="Koi Pond Construction | Blog" />
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block max-w-lg text-center justify-center"
        >
          <h1 className={title()}>Blog</h1>
        </motion.div>
        <motion.div 
          variants={container}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto mt-8"
        >
          {posts.map((post) => (
            <motion.div key={post.name} variants={item}>
              <Card key={post.name} className="max-w-md">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                  <h4 className="font-bold text-large">{post.name}</h4>
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                  <Image
                    alt="Card background"
                    className="object-cover rounded-xl"
                    src={post.src}
                    width="100%"
                    height={200}
                    style={{ objectFit: 'cover' }}
                  />
                </CardBody>
                <CardFooter>
                  <Link href={post.href}>
                    <Button>More</Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>  
          ))}
        </motion.div>
      </section>
      <Chatbot />
    </DefaultLayout>
  );
}
