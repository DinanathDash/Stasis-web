"use client";

import { createContext, useContext, type RefObject } from "react";

export type SceneApi = {
  /**
   * The scene's scrubbed timeline, **normalised to a total duration of 1**.
   *
   * That normalisation is the extensibility seam: any descendant can place a
   * tween at a literal fraction of the pin and inherit the scrub for free.
   *
   *   const { timeline } = useScene();
   *   useGSAP(() => {
   *     if (!timeline) return;
   *     timeline.fromTo(ref.current,
   *       { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.45);
   *   }, { dependencies: [timeline], scope: ref });
   *
   * `null` until the scene has mounted, and on mobile / reduced motion where
   * no timeline is built at all — always guard.
   */
  timeline: gsap.core.Timeline | null;
  /** Live scroll progress through the pin, 0..1. Read at call time. */
  progress: RefObject<number>;
  /** Live total scale of the stage. Read at call time. */
  scale: RefObject<number>;
  /**
   * Which way the last scroll went: 1 down, -1 up.
   *
   * The companion to `timeline`. A `.call()` on the timeline fires whenever
   * the playhead crosses it, in either direction — which is what you want for
   * a cue that has to arm and disarm, but leaves the callback unable to tell
   * the two crossings apart on its own. Read this inside it.
   *
   * Written from the trigger's own `onUpdate`, which runs on the scroll event
   * itself, ahead of the scrub tween that eventually renders the timeline —
   * so by the time a callback fires, this already reflects the scroll that
   * caused it.
   */
  direction: RefObject<number>;
};

const SceneContext = createContext<SceneApi | null>(null);

export function SceneProvider({
  value,
  children,
}: {
  value: SceneApi;
  children: React.ReactNode;
}) {
  return (
    <SceneContext.Provider value={value}>{children}</SceneContext.Provider>
  );
}

export function useScene(): SceneApi | null {
  return useContext(SceneContext);
}
