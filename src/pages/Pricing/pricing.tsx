import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Card, CardBody, CardHeader, Button, Divider } from "@nextui-org/react";
import { CheckIcon } from '@heroicons/react/24/solid';

export default function PricingPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Pricing</h1>
        </div>
        <div className="flex flex-wrap justify-center gap-8 mt-8">
          <PricingCard
            title="STARTER"
            price="$10.99"
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
            price="$30.99"
            features={[
              "Hồ từ 8-10m3: Giá 12.000.000 VNĐ/m3",
              "Hồ từ 10-20m3: Giá 11.000.000 VNĐ/m3",
              "Hồ từ 20-50m3: Giá 10.000.000 VNĐ/m3",
              "Hồ từ 50-100m3: Giá 9.000.000 VNĐ/m3",
              "Hồ từ 100m3: Giá 8.000.000 VNĐ/m3"
            ]}
            highlighted={true}
          />

          <PricingCard
            title="UNLIMITED"
            price="$49.99"
            features={[
              "Hồ từ 8-10m3: Giá 15.500.000 VNĐ/m3",
              "Hồ từ 10-20m3: Giá 14.000.000 VNĐ/m3",
              "Hồ từ 20-50m3: Giá 12.500.000 VNĐ/m3",
              "Hồ từ 50-100m3: Giá 11.000.000 VNĐ/m3",
              "Hồ từ 100m3: Giá 9.500.000 VNĐ/m3",
            ]}
          />
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
