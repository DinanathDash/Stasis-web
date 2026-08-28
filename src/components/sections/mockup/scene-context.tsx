"use client";

import { createContext, useContext, type RefObject } from "react";

export type SceneApi = {
  /**
   * The scene's scrubbed timeline, **normalised to a total duration of 1**, so
   * any descendant can place a tween at a literal fraction of the pin and
   * inherit the scrub for free:
   *
   *   timeline.fromTo(ref.current, { autoAlpha: 0 }, { autoAlpha: 1,
   *     duration: 0.3 }, 0.45);
   *
   * `null` until the scene mounts, and on mobile / reduced motion where no
   * timeline is built at all — always guard.
   */
  timeline: gsap.core.Timeline | null;
  /** Live progress through the pin, 0..1. Read at call time. */
  progress: RefObject<number>;
  /** Live total scale of the stage. Read at call time. */
  scale: RefObject<number>;
  /**
   * Which way the last scroll went: 1 down, -1 up. A `.call()` on the timeline
   * fires in both directions, so a cue that has to arm and disarm reads this to
   * tell the two crossings apart.
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
