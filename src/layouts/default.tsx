import { Link } from "@nextui-org/link";
import Head from "next/head";
import { SiteConfig } from "@/config/site";
import { Navbar } from "@/components/Navbar/navbar";
import Footer from "@/components/Footer/footer";
export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Head>
        <title>Koi Pond Construction</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Koi Pond Construction services" />
      </Head>
      <div className="relative flex flex-col h-screen">
        <Navbar />
        <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
          {children}
        </main>
        <footer className="w-full flex items-center justify-center py-3">
          <Link
            isExternal
            className="flex items-center gap-1 text-current"
            href="https://nextui-docs-v2.vercel.app?utm_source=next-pages-template"
            title="nextui.org homepage"
          >
            <span className="text-default-600">Powered by</span>
            <p className="text-primary">SWP391</p>
          </Link>

        </footer>
        <Footer/>
      </div>
    </>
  );
}
