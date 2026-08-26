import { Hero } from "@/components/sections/hero";
import { StaticMockup } from "@/components/sections/mockup/static-mockup";
import { Features } from "@/components/sections/features";
import { Cta } from "@/components/sections/cta";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between pb-24">
      <Hero />
      <StaticMockup />
      <Features />
      <Cta />
    </main>
  );
}
