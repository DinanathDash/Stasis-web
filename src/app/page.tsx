import { Hero } from "@/components/sections/hero";
import { MockupScene } from "@/components/sections/mockup/mockup-scene";
import { StagedAnimatedMockup } from "@/components/sections/mockup/staged-animated-mockup";
import { SceneAside } from "@/components/sections/mockup/scene-aside";
import { Features } from "@/components/sections/features";
import { Cta } from "@/components/sections/cta";

// The scene is independent of which mockup it animates — swap `device`.
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start pb-24">
      <Hero />
      <MockupScene device={<StagedAnimatedMockup />} aside={<SceneAside />} />
      <Features />
      <Cta />
    </main>
  );
}
