import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Button, Card, CardBody, CardHeader, Divider, } from "@nextui-org/react";
import { CheckIcon } from "@heroicons/react/24/solid";




export default function PricingPage() {


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
            <table className="w-full bg-white rounded-lg overflow-hidden shadow-lg">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-lg font-semibold">Kích thước hồ</th>
                  <th className="px-6 py-4 text-center text-lg font-semibold">STARTER</th>
                  <th className="px-6 py-4 text-center text-lg font-semibold">PREMIUM</th>
                  <th className="px-6 py-4 text-center text-lg font-semibold">UNLIMITED</th>
                </tr>
              </thead>
              <tbody>
                {[{ size: "8-10m3", starter: "10.000.000", premium: "12.000.000", unlimited: "15.500.000" },
                { size: "10-20m3", starter: "9.500.000", premium: "11.000.000", unlimited: "14.000.000" },
                { size: "20-50m3", starter: "8.500.000", premium: "10.000.000", unlimited: "12.500.000" },
                { size: "50-100m3", starter: "7.800.000", premium: "9.000.000", unlimited: "11.000.000" },
                { size: "100m3 trở lên", starter: "7.100.000", premium: "8.000.000", unlimited: "9.500.000" },
                ].map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-6 py-4 border-t text-lg">{row.size}</td>
                    <td className="px-6 py-4 border-t text-center text-lg font-medium">{row.starter} VNĐ/m3</td>
                    <td className="px-6 py-4 border-t text-center text-lg font-medium">{row.premium} VNĐ/m3</td>
                    <td className="px-6 py-4 border-t text-center text-lg font-medium">{row.unlimited} VNĐ/m3</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button color="primary" onClick={() => (window.location.href = "/login")}>
            Apply now !
          </Button>
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
