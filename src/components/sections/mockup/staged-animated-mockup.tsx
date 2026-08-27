"use client";

import { useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { AnimatedMockupBody } from "./animated-mockup";
import { StageScaleProvider, useStageScale } from "./stage-context";
import { useScene } from "./scene-context";
import {
  LEGACY_W,
  LEGACY_H,
  LEGACY_SCALE,
  NOTE_END_DX,
  NOTE_END_DY,
  SCENE_REVEAL_AT,
} from "./stage-geometry";

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
  const rootRef = useRef<HTMLDivElement>(null);
  const stageScale = useStageScale();
  const scene = useScene();
  const timeline = scene?.timeline ?? null;

  const [revealBattery, setRevealBattery] = useState(false);

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

  useGSAP(
    () => {
      if (!timeline || !rootRef.current) return;

      // Relocate the note as the machine grows, so it reads as a label beside
      // the mockup rather than a caption stranded above it.
      const note = rootRef.current.querySelector("[data-mockup-note]");
      if (note) {
        timeline.fromTo(
          note,
          { x: 0, y: 0 },
          {
            x: NOTE_END_DX,
            y: NOTE_END_DY,
            duration: 0.5,
            ease: "power2.inOut",
          },
          0.15,
        );
      }

      // Open the popover unprompted once the mockup is settled and large, so
      // it is obvious what the note is pointing at. A timeline callback rather
      // than a progress threshold read per frame, so it fires exactly once per
      // crossing and costs nothing in between.
      timeline.call(() => setRevealBattery(true), undefined, SCENE_REVEAL_AT);
    },
    { dependencies: [timeline], scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      className="absolute left-0 top-0 origin-top-left select-none"
      style={{
        width: LEGACY_W,
        height: LEGACY_H,
        transform: `scale(${LEGACY_SCALE})`,
      }}
    >
      <StageScaleProvider scaleRef={composedScale}>
        <AnimatedMockupBody revealBattery={revealBattery} />
      </StageScaleProvider>
    </div>
  );
}
