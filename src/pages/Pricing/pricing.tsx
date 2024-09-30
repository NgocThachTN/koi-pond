import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
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
        <div className="relative z-10 flex flex-col items-center justify-center gap-4 bg-background/60 p-8 rounded-lg">
          <div className="inline-block max-w-lg text-center justify-center">
            <h1 className={title()}>Pricing</h1>
          </div>
          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <PricingCard
              title="STARTER"

              features={[
                "Hồ từ 8-10m3: Giá 10.000.000 VNĐ/m3",
                "Hồ từ 10-20m3: Giá 9.500.000 VNĐ/m3",
                "Hồ từ 20-50m3: Giá 8.500.000 VNĐ/m3",
                "Hồ từ 50-100m3: Giá 7.800.000 VNĐ/m3",
                "Hồ từ 100m3: Giá 7.100.000 VNĐ/m3"
              ]}
            />

            <PricingCard
              title="PREMIUM"

              features={[
                "Hồ từ 8-10m3: Giá 12.000.000 VNĐ/m3",
                "Hồ từ 10-20m3: Giá 11.000.000 VNĐ/m3",
                "Hồ từ 20-50m3: Giá 10.000.000 VNĐ/m3",
                "Hồ từ 50-100m3: Giá 9.000.000 VNĐ/m3",
                "Hồ từ 100m3: Giá 8.000.000 VNĐ/m3"
              ]}

            />

            <PricingCard
              title="UNLIMITED"

              features={[
                "Hồ từ 8-10m3: Giá 15.500.000 VNĐ/m3",
                "Hồ từ 10-20m3: Giá 14.000.000 VNĐ/m3",
                "Hồ từ 20-50m3: Giá 12.500.000 VNĐ/m3",
                "Hồ từ 50-100m3: Giá 11.000.000 VNĐ/m3",
                "Hồ từ 100m3: Giá 9.500.000 VNĐ/m3",
              ]}
            />
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
