import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/defaultuser";
import { Button, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/react";
import { TitleManager } from '@/components/TitleManager';
export default function PricingUser2() {
  const pricingData = [
    { size: "8-10m3", starter: "10.000.000", premium: "12.000.000", unlimited: "15.500.000" },
    { size: "10-20m3", starter: "9.500.000", premium: "11.000.000", unlimited: "14.000.000" },
    { size: "20-50m3", starter: "8.500.000", premium: "10.000.000", unlimited: "12.500.000" },
    { size: "50-100m3", starter: "7.800.000", premium: "9.000.000", unlimited: "11.000.000" },
    { size: "100m3 or more", starter: "7.100.000", premium: "8.000.000", unlimited: "9.500.000" },
  ];

  return (
    
    <DefaultLayout>
      <TitleManager title="Koi Pond Construction | Custom Design Pricing" />
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title({ color: "violet" })}>Pricing</h1>
        </div>
        <div className="w-full max-w-7xl mt-8">
          <Table 
            aria-label="Pricing table" 
            className="w-full" 
            shadow="none"
            removeWrapper
          >
            <TableHeader>
              <TableColumn className="bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 text-lg font-semibold">Koi Pond size</TableColumn>
              <TableColumn className="bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 text-lg font-semibold text-center">Mini Koi Pond</TableColumn>
              <TableColumn className="bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 text-lg font-semibold text-center">Koi Pond Garden</TableColumn>
              <TableColumn className="bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 text-lg font-semibold text-center">Koi Pond Indoor</TableColumn>
            </TableHeader>
            <TableBody>
              {pricingData.map((row, index) => (
                <TableRow key={index} className={index % 2 === 0 ? 'bg-purple-50/50 dark:bg-purple-900/20' : 'bg-white/50 dark:bg-purple-800/20'}>
                  <TableCell className="text-lg font-medium">{row.size}</TableCell>
                  <TableCell className="text-center text-lg">{row.starter} VNĐ/m3</TableCell>
                  <TableCell className="text-center text-lg">{row.premium} VNĐ/m3</TableCell>
                  <TableCell className="text-center text-lg">{row.unlimited} VNĐ/m3</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Button color="secondary" variant="flat" onPress={() => window.location.href = "/docsuser"}>
          Apply now!
        </Button>
      </section>
    </DefaultLayout>
  );
}

// ... existing PricingCard component (if still needed)