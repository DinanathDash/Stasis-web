"use client";

import { createContext, useContext, useRef, type RefObject } from "react";

/**
 * The live TOTAL scale of the stage (base fit x scroll scale).
 *
 * A context holding a *ref*, not a number, and that is the point: the value
 * changes every animation frame during scrub, so a plain context value would
 * re-render every consumer at ~120fps. The ref's identity never changes.
 * Consumers read `.current` inside their handlers, at call time.
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

/** A ref to the stage's live total scale, or a stable `1` outside a stage.
 *  Read `.current` at call time — never as a render input. */
export function useStageScale(): RefObject<number> {
  const fallback = useRef(1);
  return useContext(StageScaleContext) ?? fallback;
}
