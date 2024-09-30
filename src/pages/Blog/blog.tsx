import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Card, CardHeader, CardBody, CardFooter, Image, Link, Button } from "@nextui-org/react";

const posts = [

  { name: "Hồ cá Koi mini", href: "/blog/blog1 ", src:"https://hocakoimiennam.vn/img_data/images/z2169011697963_dd0004574f97dd1f64b254e10e41c53a.jpg" },
  { name: "Hồ cá Koi ngoài trời", href: "/blog/blog2", src:"https://hocakoimiennam.vn/img_data/images/059131098791_HINH-10.png" },
  { name: "Hồ cá Koi trong nhà", href: "/blog/blog3", src:"https://hocakoimiennam.vn/img_data/images/ho%203.jpg" },
 
];

export default function BlogPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Blog</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto mt-8">
          {posts.map((post) => (
            <Card key={post.name} className="max-w-md">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <h4 className="font-bold text-large">{post.name}</h4>
                
              </CardHeader>
              <CardBody className="overflow-visible py-2">
                <Image
                  alt="Card background"
                  className="object-cover rounded-xl"
                  src={post.src}
                  width={300}
                />
              </CardBody>
              <CardFooter>
                <Link href={post.href}>
                  <Button>Xem bài viết</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </DefaultLayout>
  );
}
