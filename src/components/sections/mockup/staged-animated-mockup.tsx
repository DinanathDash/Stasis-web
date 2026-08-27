"use client";

import { useMemo } from "react";
import { AnimatedMockupBody } from "./animated-mockup";
import { StageScaleProvider, useStageScale } from "./stage-context";
import { LEGACY_W, LEGACY_H, LEGACY_SCALE } from "./stage-geometry";

/**
 * Dinanath's interactive mockup, mounted on the scroll scene's design-unit
 * stage.
 *
 * The adaptation is one uniform scale and nothing else. His mockup and its
 * three screens are authored in CSS px against a 1152 x 690.9 box, and
 * 1454 / 1152 is exactly DU_PER_CSS_PX — so rendering that box at its natural
 * size and scaling it fills the stage precisely, reproducing his proportions
 * rather than reinterpreting them. His screen percentages land on the frame's
 * measured cutout to within half a design unit.
 *
 * A consequence worth knowing: the dock, the menu bar and every `text-[10px]`
 * inside those screens now scale with the scene, because they are inside the
 * transformed subtree. That is the intent — it is one object being zoomed.
 * Anything that should stay at reading size belongs in the scene's `aside`.
 */
export function StagedAnimatedMockup() {
  const stageScale = useStageScale();

  /**
   * Republish the scale with the legacy factor folded in.
   *
   * Anything inside here sits under two transforms: the stage's, and this
   * component's. `getBoundingClientRect` reflects both, so a consumer
   * converting viewport px back into its own authoring units needs the
   * product, not the stage's scale alone. The Dock's magnification field is
   * the current consumer — without this it would be 1.26x too narrow.
   *
   * A getter rather than a stored number because the underlying value changes
   * every scrubbed frame; this stays live without anything having to keep it
   * in sync, and without re-rendering the subtree.
   */
  const composedScale = useMemo(
    () => ({
      get current() {
        return stageScale.current * LEGACY_SCALE;
      },
      set current(_next: number) {
        /* derived; the stage owns the underlying value */
      },
    }),
    [stageScale],
  );

  return (
    <div
      className="absolute left-0 top-0 origin-top-left select-none"
      style={{
        width: LEGACY_W,
        height: LEGACY_H,
        transform: `scale(${LEGACY_SCALE})`,
      }}
    >
      <StageScaleProvider scaleRef={composedScale}>
        <AnimatedMockupBody />
      </StageScaleProvider>
    </div>
  );
}
