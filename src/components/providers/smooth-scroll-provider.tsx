"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "@/lib/scroll/gsap";
import { getLenis, setLenis } from "@/lib/scroll/lenis-instance";
import { LENIS_OPTIONS } from "@/lib/ease";

/**
 * Site-wide smooth scroll, driven off GSAP's ticker so Lenis and ScrollTrigger
 * share one clock.
 *
 * Returns a bare fragment on purpose: rendering no DOM node guarantees this can
 * never become a `transform` / `filter` / `contain` ancestor of what it wraps,
 * any of which would create a containing block for `position: fixed` and break
 * ScrollProgress and the sticky header. `children` arrives as a prop, so the
 * server-rendered tree passes straight through this client boundary.
 */
export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    const start = () => {
      if (lenis || reduceMotion.matches) return;

      // autoRaf off explicitly: its own loop alongside gsap.ticker would
      // advance Lenis twice per frame.
      lenis = new Lenis({ ...LENIS_OPTIONS, autoRaf: false });
      setLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);

      // gsap.ticker reports seconds; lenis.raf wants milliseconds. Getting
      // this wrong presents as frozen scrolling.
      tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);

      // Without this GSAP clamps large frame deltas after a tab switch and
      // desyncs from Lenis.
      gsap.ticker.lagSmoothing(0);

      ScrollTrigger.refresh();
    };

    const stop = () => {
      if (!lenis) return;
      lenis.off("scroll", ScrollTrigger.update);
      if (tick) gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33); // restore GSAP's default
      lenis.destroy();
      lenis = null;
      tick = null;
      setLenis(null);
    };

    const onPreferenceChange = () => (reduceMotion.matches ? stop() : start());

    start();
    reduceMotion.addEventListener("change", onPreferenceChange);

    // Cleanup has to be exact: StrictMode mounts this twice in dev, and a
    // leaked instance shows up as double-speed scrolling in dev only.
    return () => {
      reduceMotion.removeEventListener("change", onPreferenceChange);
      stop();
    };
  }, []);

  // Next resets scroll on soft navigation, which Lenis does not observe — its
  // internal position stays stale and the next wheel event teleports.
  // Delaying this by one tick ensures Next.js has finished DOM mutations and
  // its own scroll restoration logic, allowing Lenis to reliably scroll to top.
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      getLenis()?.scrollTo(0, { immediate: true });
      ScrollTrigger.refresh();
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  return <>{children}</>;
}
