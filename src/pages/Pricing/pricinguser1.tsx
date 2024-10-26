import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Button, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Image, Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import { Tabs, Tab } from "@nextui-org/tabs";
import { CheckIcon } from '@heroicons/react/24/solid';
import { TitleManager } from '@/components/TitleManager';
export default function PricingUser1() {
  // Mảng chứa các URL hình ảnh cụ thể
  const imageUrls1 = [
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
      <TitleManager title="Koi Pond Construction | Sample Pricing" />
      <section className="flex flex-col items-center justify-center gap-8 py-12 md:py-16 px-4">
        <div className="text-center">
          <h1 className={title({ color: "violet" })}>Koi Pond Contruction Plans</h1>
          <h2 className={subtitle({ class: "mt-4" })}>
            Choose the perfect plan for your Koi pond
          </h2>
        </div>

        <Card className="w-full max-w-4xl">
          <CardBody>
            <Table
              aria-label="Pricing table"
              className="w-full"
              shadow="none"
              removeWrapper
            >
              <TableHeader>
                <TableColumn className="bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 text-lg font-semibold">Koi Pond size</TableColumn>
                <TableColumn className="bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 text-lg font-semibold text-center">Mini Koi Pond
                </TableColumn>
                <TableColumn className="bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 text-lg font-semibold text-center">Koi Pond Garden
                </TableColumn>
                <TableColumn className="bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 text-lg font-semibold text-center">Koi Pond Indoor
                </TableColumn>
              </TableHeader>
              <TableBody>
                {[
                  { size: "8-10m3", plan1: "10.000.000", plan2: "12.000.000", plan3: "15.500.000" },
                  { size: "10-20m3", plan1: "9.500.000", plan2: "11.000.000", plan3: "14.000.000" },
                  { size: "20-50m3", plan1: "8.500.000", plan2: "10.000.000", plan3: "12.500.000" },
                  { size: "50-100m3", plan1: "7.800.000", plan2: "9.000.000", plan3: "11.000.000" },
                  { size: "100m3 or more", plan1: "7.100.000", plan2: "8.000.000", plan3: "9.500.000" },
                ].map((row, index) => (
                  <TableRow key={index} className={index % 2 === 0 ? 'bg-purple-50/50 dark:bg-purple-900/20' : 'bg-white/50 dark:bg-purple-800/20'}>
                    <TableCell className="text-lg font-medium">{row.size}</TableCell>
                    <TableCell className="text-center text-lg">{row.plan1} VNĐ/m3</TableCell>
                    <TableCell className="text-center text-lg">{row.plan2} VNĐ/m3</TableCell>
                    <TableCell className="text-center text-lg">{row.plan3} VNĐ/m3</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        <Button color="secondary" variant="shadow" onClick={() => (window.location.href = "/docsuser")}>
          Apply now!
        </Button>

        <h2 className={title({ size: "sm", class: "mt-12 mb-4" })}>Mini Koi Pond</h2>
        <div className="grid grid-cols-3 gap-4">
          {imageUrls1.map((url, index) => (
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

        <h2 className={title({ size: "sm", class: "mt-12 mb-4" })}>Koi Pond Garden</h2>
        <div className="grid grid-cols-3 gap-4">
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

        <h2 className={title({ size: "sm", class: "mt-12 mb-4" })}>Koi Pond Indoor</h2>
        <div className="grid grid-cols-3 gap-4">
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
