"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/scroll/gsap";
import { useScene } from "./scene-context";

const ITEMS = [
  {
    title: "Live power flow",
    body: "Watch charge move between adapter, battery and system in real time.",
  },
  {
    title: "Charge limits that stick",
    body: "Cap charging at your threshold and hold it there, even through sleep.",
  },
  {
    title: "All from the menu bar",
    body: "No windows to manage — every control sits one click from the clock.",
  },
];

/**
 * Copy occupying the space the mockup clears as it drifts left. Placeholder
 * content: swap the strings, keep the wiring.
 *
 * Outside the stage's transform on purpose, so it stays at reading size while
 * the mockup scales beside it. It also keeps something visibly moving through
 * the whole pin, which matters because scrollbars are hidden globally — a long
 * pin with nothing changing in it reads as a stuck page.
 */
export function SceneAside() {
  const ref = useRef<HTMLDivElement>(null);
  const scene = useScene();
  const timeline = scene?.timeline ?? null;

  useGSAP(
    () => {
      if (!timeline || !ref.current) return;

      const items = gsap.utils.toArray<HTMLElement>(
        "[data-aside-item]",
        ref.current,
      );
      if (!items.length) return;

      // 34% to 68% of the pin, so the timeline's total duration stays 1.
      timeline.fromTo(
        items,
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.34,
          stagger: 0.08,
          ease: "power2.out",
        },
        0.34,
      );
    },
    { dependencies: [timeline], scope: ref },
  );

  return (
    <div ref={ref} className="flex flex-col gap-8">
      {ITEMS.map((item) => (
        <div key={item.title} data-aside-item>
          <h3 className="mb-1.5 text-lg font-medium tracking-tight lg:text-xl">
            {item.title}
          </h3>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground lg:text-base">
            {item.body}
          </p>
        </div>
      ))}
    </div>
  );
}
