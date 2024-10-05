import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/defaultuser";
import { CheckIcon } from "@heroicons/react/24/solid";
import { Button, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Image, Card, CardHeader, Divider, CardBody } from "@nextui-org/react";

export default function PricingPage() {
  // Mảng chứa các URL hình ảnh cụ thể
  const imageUrls = [
    "https://sanvuonadong.vn/wp-content/uploads/2020/07/ho-ca-koi-trong-nha-dep-01-san-vuon-a-dong.jpg",
    "https://sanvuonadong.vn/wp-content/uploads/2020/10/ho-ca-koi-mini-bang-kinh-04-san-vuon-a-dong.jpg",
    "https://sanvuonadong.vn/wp-content/uploads/2020/10/thiet-ke-ho-ca-koi-mini-truoc-nha-03-san-vuon-a-dong.jpg",
    "https://sanvuonadong.vn/wp-content/uploads/2020/10/thiet-ke-ho-ca-koi-mini-truoc-nha-07-san-vuon-a-dong.jpg",
    "https://sanvuonadong.vn/wp-content/uploads/2020/10/ho-ca-koi-mini-trong-nha-04-san-vuon-a-dong.jpg",
    "https://sanvuonadong.vn/wp-content/uploads/2020/10/ho-ca-koi-mini-san-vuon-03-san-vuon-a-dong.jpg",
    "https://sanvuonadong.vn/wp-content/uploads/2020/10/ho-ca-koi-mini-san-vuon-12-san-vuon-a-dong.jpg",
    "https://sanvuonadong.vn/wp-content/uploads/2020/10/ho-ca-koi-mini-don-gian-02-san-vuon-a-dong.jpg",
    "https://sanvuonadong.vn/wp-content/uploads/2020/10/ho-ca-koi-mini-don-gian-04-san-vuon-a-dong.jpg",
  ];

  const imageUrls2 = [
    "https://sanvuonadong.vn/wp-content/uploads/2020/07/ho-ca-koi-trong-nha-dep-01-san-vuon-a-dong.jpg",
    "https://sanvuonadong.vn/wp-content/uploads/2020/10/ho-ca-koi-mini-bang-kinh-04-san-vuon-a-dong.jpg",
    "https://sanvuonadong.vn/wp-content/uploads/2020/10/thiet-ke-ho-ca-koi-mini-truoc-nha-03-san-vuon-a-dong.jpg",
    "https://sanvuonadong.vn/wp-content/uploads/2020/10/thiet-ke-ho-ca-koi-mini-truoc-nha-07-san-vuon-a-dong.jpg",
    "https://sanvuonadong.vn/wp-content/uploads/2020/10/ho-ca-koi-mini-trong-nha-04-san-vuon-a-dong.jpg",
    "https://sanvuonadong.vn/wp-content/uploads/2020/10/ho-ca-koi-mini-san-vuon-03-san-vuon-a-dong.jpg",
    "https://sanvuonadong.vn/wp-content/uploads/2020/10/ho-ca-koi-mini-san-vuon-12-san-vuon-a-dong.jpg",
    "https://sanvuonadong.vn/wp-content/uploads/2020/10/ho-ca-koi-mini-don-gian-02-san-vuon-a-dong.jpg",
    "https://sanvuonadong.vn/wp-content/uploads/2020/10/ho-ca-koi-mini-don-gian-04-san-vuon-a-dong.jpg",
  ];

  const imageUrls3 = [
    "https://sanvuonadong.vn/wp-content/uploads/2020/07/ho-ca-koi-trong-nha-dep-01-san-vuon-a-dong.jpg",
    "https://sanvuonadong.vn/wp-content/uploads/2020/10/ho-ca-koi-mini-bang-kinh-04-san-vuon-a-dong.jpg",
    "https://sanvuonadong.vn/wp-content/uploads/2020/10/thiet-ke-ho-ca-koi-mini-truoc-nha-03-san-vuon-a-dong.jpg",
    "https://sanvuonadong.vn/wp-content/uploads/2020/10/thiet-ke-ho-ca-koi-mini-truoc-nha-07-san-vuon-a-dong.jpg",
    "https://sanvuonadong.vn/wp-content/uploads/2020/10/ho-ca-koi-mini-trong-nha-04-san-vuon-a-dong.jpg",
    "https://sanvuonadong.vn/wp-content/uploads/2020/10/ho-ca-koi-mini-san-vuon-03-san-vuon-a-dong.jpg",
    "https://sanvuonadong.vn/wp-content/uploads/2020/10/ho-ca-koi-mini-san-vuon-12-san-vuon-a-dong.jpg",
    "https://sanvuonadong.vn/wp-content/uploads/2020/10/ho-ca-koi-mini-don-gian-02-san-vuon-a-dong.jpg",
    "https://sanvuonadong.vn/wp-content/uploads/2020/10/ho-ca-koi-mini-don-gian-04-san-vuon-a-dong.jpg",
  ];

  return (
    <DefaultLayout>
      <section className="relative flex flex-col items-center justify-center gap-4 py-8 md:py-10 min-h-screen">
        {/* Background image with blur effect */}
        <div
          className="absolute inset-0 z-0 opacity-50"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1557683311-eac922347aa1?q=80&w=2029&auto=format&fit=crop')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(8px)',
            transform: 'scale(1.1)', // This ensures full coverage even with blur
          }}
        ></div>

        {/* Content with increased z-index */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-4 bg-background/60 p-8 rounded-lg w-full max-w-7xl">
          <div className="inline-block max-w-lg text-center justify-center">
            <h1 className={title()}>Pricing</h1>
          </div>
          <div className="mt-8 w-full overflow-x-auto">
            <Table aria-label="Pricing table" className="w-full">
              <TableHeader>
                <TableColumn className="bg-purple-400 text-purple-900 text-lg font-semibold">Product size</TableColumn>
                <TableColumn className="bg-purple-400 text-purple-900 text-lg font-semibold text-center">STARTER</TableColumn>
                <TableColumn className="bg-purple-400 text-purple-900 text-lg font-semibold text-center">PREMIUM</TableColumn>
                <TableColumn className="bg-purple-400 text-purple-900 text-lg font-semibold text-center">UNLIMITED</TableColumn>
              </TableHeader>
              <TableBody>
                {[{ size: "8-10m3", starter: "10.000.000", premium: "12.000.000", unlimited: "15.500.000" },
                { size: "10-20m3", starter: "9.500.000", premium: "11.000.000", unlimited: "14.000.000" },
                { size: "20-50m3", starter: "8.500.000", premium: "10.000.000", unlimited: "12.500.000" },
                { size: "50-100m3", starter: "7.800.000", premium: "9.000.000", unlimited: "11.000.000" },
                { size: "100m3 or more", starter: "7.100.000", premium: "8.000.000", unlimited: "9.500.000" },
                ].map((row, index) => (
                 <TableRow key={index} className={`${index % 2 === 0 ? 'bg-purple-50 dark:bg-purple-900' : 'bg-white dark:bg-purple-800'} text-gray-900 dark:text-white`}>
                    <TableCell className="text-lg">{row.size}</TableCell>
                    <TableCell className="text-center text-lg font-medium">{row.starter} VNĐ/m3</TableCell>
                    <TableCell className="text-center text-lg font-medium">{row.premium} VNĐ/m3</TableCell>
                    <TableCell className="text-center text-lg font-medium">{row.unlimited} VNĐ/m3</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button color="secondary" variant="light" onClick={() => (window.location.href = "/docsuser")}>
            Apply now !
          </Button>

          {/* Title for the image grid */}
          <h2 className="mt-8 text-2xl font-bold text-center">Mini Koi Pond</h2>

          {/* 3x3 image layout with specific images */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative w-full pb-[66.67%] overflow-hidden rounded-lg">
                <Image
                  src={url}
                  alt={`Image ${index + 1}`}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Title for the image grid */}
          <h2 className="mt-8 text-2xl font-bold text-center">Koi Pond Garden</h2>

          {/* 3x3 image layout with specific images */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            {imageUrls2.map((url, index) => (
              <div key={index} className="aspect-square overflow-hidden rounded-lg">
                <Image
                  src={url}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover"
                  height={360}
                  width={360}
                />
              </div>
            ))}
          </div>

          {/* Title for the image grid */}
          <h2 className="mt-8 text-2xl font-bold text-center">Koi Pond Indoor</h2>

          {/* 3x3 image layout with specific images */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            {imageUrls3.map((url, index) => (
              <div key={index} className="aspect-square overflow-hidden rounded-lg">
                <Image
                  src={url}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover"
                  height={360}
                  width={360}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}

function PricingCard({ title, features, highlighted = false }: {
  title: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <Card
      className={`w-72 ${highlighted ? 'shadow-lg border-2 border-primary' : ''}`}
      radius="lg"
      shadow="sm"
    >
      <CardHeader className="flex flex-col items-center pb-0 pt-6">
        <h2 className="text-xl font-bold">{title}</h2>
      </CardHeader>
      <Divider className="my-4" />
      <CardBody className="px-6">
        <ul className="mb-6 space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <CheckIcon className="w-4 h-4 mr-2 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}