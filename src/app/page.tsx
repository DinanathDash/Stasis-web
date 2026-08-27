import { Hero } from "@/components/sections/hero";
import { MockupScene } from "@/components/sections/mockup/mockup-scene";
import { SceneAside } from "@/components/sections/mockup/scene-aside";
import { Features } from "@/components/sections/features";
import { Cta } from "@/components/sections/cta";

// Several mockup treatments live side by side while we compare them —
// animated-mockup, interactive-mockup and static-mockup are all still in
// src/components/sections/mockup/. Swap the import here to try another.
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start pb-24">
      <Hero />
      <MockupScene aside={<SceneAside />} />
      <Features />
      <Cta />
    </main>
  );
}
