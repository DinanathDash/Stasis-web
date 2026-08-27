"use client";

import { createContext, useContext, useRef, type RefObject } from "react";

/**
 * The live TOTAL scale of the stage (base fit x scroll scale).
 *
 * This is a context holding a *ref*, not a number, and that is the whole
 * point: the value changes on every animation frame during scrub. A plain
 * context holding a number would re-render every consumer at ~120fps. The
 * ref's identity never changes, so React never re-renders — consumers read
 * `scaleRef.current` inside their event handlers, at call time.
 *
 * Reading `getComputedStyle(el).getPropertyValue("--stage-scale")` instead
 * would be a forced style read on every pointermove. This avoids both.
 *
 * For anything styled in CSS rather than read in JS, use the `--stage-scale`
 * custom property, which is written from the same place.
 */
const StageScaleContext = createContext<RefObject<number> | null>(null);

export function StageScaleProvider({
  scaleRef,
  children,
}: {
  scaleRef: RefObject<number>;
  children: React.ReactNode;
}) {
  return (
    <StageScaleContext.Provider value={scaleRef}>
      {children}
    </StageScaleContext.Provider>
  );
}

/**
 * Returns a ref to the stage's live total scale, or a stable `1` when used
 * outside a stage. Read `.current` at call time — never as a render input.
 */
export function useStageScale(): RefObject<number> {
  const fallback = useRef(1);
  return useContext(StageScaleContext) ?? fallback;
}
