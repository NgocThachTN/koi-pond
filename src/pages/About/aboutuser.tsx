import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/defaultuser";
import TeamSection from "@/components/TeamSection/TeamSection";
import Head from "next/head";

export default function AboutPageUser() {
  return (
    <>
      <Head>
        <title>About - Koi Pond Construction</title>
      </Head>
      <DefaultLayout>
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <div className="inline-block max-w-lg text-center justify-center">
            <h1 className={title()}>About</h1>
            <TeamSection />
          </div>
        </section>
      </DefaultLayout>
    </>
  );
}