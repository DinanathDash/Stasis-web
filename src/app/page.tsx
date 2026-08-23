import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { Mockup } from "@/components/sections/mockup";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between pb-24">
      <Header />
      <Hero />
      <Mockup />
    </main>
  );
}
