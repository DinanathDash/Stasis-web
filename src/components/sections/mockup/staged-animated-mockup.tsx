"use client";

import { useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { HandwrittenNote } from "@/components/ui/handwritten-note";
import { SCENE_NOTE_SWAP } from "@/lib/ease";
import { AnimatedMockupBody } from "./animated-mockup";
import { StageScaleProvider, useStageScale } from "./stage-context";
import { useScene } from "./scene-context";
import {
  LEGACY_W,
  LEGACY_H,
  LEGACY_SCALE,
  NOTE_ALT_LEFT,
  NOTE_ALT_TOP,
  SCENE_REVEAL_AT,
} from "./stage-geometry";

/**
 * Dinanath's interactive mockup, mounted on the scroll scene's design-unit
 * stage.
 *
 * The adaptation is one uniform scale and nothing else. His mockup and its
 * screens are authored in CSS px against a 1152 x 690.9 box, and 1454 / 1152
 * is exactly DU_PER_CSS_PX — so rendering that box at its natural size and
 * scaling it fills the stage precisely, reproducing his proportions rather
 * than reinterpreting them. His screen percentages land on the frame's
 * measured cutout to within half a design unit.
 *
 * A consequence worth knowing: the dock, the menu bar and every `text-[10px]`
 * inside those screens now scale with the scene, because they are inside the
 * transformed subtree. That is the intent — it is one object being zoomed.
 * Anything that should stay at reading size belongs in the scene's `aside`.
 */
export function StagedAnimatedMockup() {
  const rootRef = useRef<HTMLDivElement>(null);
  const noteAltRef = useRef<HTMLDivElement>(null);
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

      // Retire the note from above the frame, then bring a second one in
      // beside the popover. Two notes cross-fading rather than one sliding:
      // a slide drags the eye across the copy column on its way over.
      const note = rootRef.current.querySelector("[data-mockup-note]");
      if (note) {
        timeline.to(
          note,
          {
            opacity: 0,
            duration: SCENE_NOTE_SWAP.outDuration,
            ease: "power1.out",
          },
          SCENE_NOTE_SWAP.outAt,
        );
      }

      if (noteAltRef.current) {
        timeline.to(
          noteAltRef.current,
          {
            opacity: 1,
            duration: SCENE_NOTE_SWAP.inDuration,
            ease: "power1.out",
          },
          SCENE_NOTE_SWAP.inAt,
        );
      }

      // Open the popover unprompted once the mockup is settled and large, so
      // it is obvious what the second note is pointing at. A timeline callback
      // rather than a progress threshold read per frame, so it fires exactly
      // once per crossing and costs nothing in between.
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

      {/*
        The second note, beside the battery popover. Scene-only, so it lives
        here rather than in AnimatedMockupBody — the standalone mockup has no
        scroll to fade it in and would just show two notes at once.

        Starts at opacity 0 inline rather than via a class, so it is invisible
        on the server-rendered first paint and stays invisible in the degraded
        branch, where no timeline is ever built to reveal it.
      */}
      <div
        ref={noteAltRef}
        className="pointer-events-none absolute z-50 hidden w-max opacity-0 md:block"
        style={{ top: NOTE_ALT_TOP, left: NOTE_ALT_LEFT }}
      >
        <HandwrittenNote
          arrowPosition="left"
          side="none"
          arrowOffsetX={0}
          arrowOffsetY={12}
          // scaleX flips it to point left at the popover; scaleY turns the
          // arc from an "n" into a "u" so it sweeps under the gap rather than
          // over it. Together they compose to rotate(172deg).
          arrowClassName="[transform:rotate(-8deg)_scaleX(-1)_scaleY(-1)]"
          className="text-white opacity-90 rotate-[-6deg]"
        >
          psst.... its interactive!
        </HandwrittenNote>
      </div>
    </div>
  );
}
