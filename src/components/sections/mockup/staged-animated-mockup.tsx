"use client";

import { useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/scroll/gsap";
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
  SCENE_RESET_AT,
  MOBILE_MAX_W,
} from "./stage-geometry";

/**
 * The interactive mockup, mounted on the scroll scene's design-unit stage.
 *
 * The adaptation is one uniform scale and nothing else: the mockup is authored
 * in CSS px against a 1152 x 690.9 box, and 1454 / 1152 is exactly
 * DU_PER_CSS_PX, so rendering it at natural size and scaling that box fills the
 * stage precisely rather than reinterpreting its proportions.
 *
 * Consequence worth knowing: the dock, the menu bar and every `text-[10px]`
 * inside now scale with the scene. That is the intent — it is one object being
 * zoomed. Anything that should stay at reading size belongs in the `aside`.
 */
export function StagedAnimatedMockup() {
  const rootRef = useRef<HTMLDivElement>(null);
  const noteAltRef = useRef<HTMLDivElement>(null);
  const stageScale = useStageScale();
  const scene = useScene();
  const timeline = scene?.timeline ?? null;

  /** The scene owns the popover so it can both demonstrate it and take it
   *  back; MainScreen reports the reader's clicks up here, so a click and a
   *  scroll cue write the same state instead of competing for it. */
  const [batteryOpen, setBatteryOpen] = useState(false);

  /**
   * Republish the scale with the legacy factor folded in. Anything in here sits
   * under two transforms, and `getBoundingClientRect` reflects both — so a
   * consumer converting viewport px back to its own units needs the product,
   * not the stage's scale alone. Without this the Dock's magnification field
   * would be 1.26x too narrow. A getter, not a stored number, because the
   * underlying value changes every scrubbed frame.
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

      // Two notes cross-fading rather than one sliding: a slide drags the eye
      // across the copy column on its way over.
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

      // Open the popover once the mockup is settled and large, so it is
      // obvious what the second note points at, and take it back when the
      // reader returns to the hero. A `.call()` fires in both directions, so
      // each checks which way the scroll went. The pair is deliberately
      // asymmetric — open at 55%, close back at the top — so the popover stays
      // put through everything between, including a reader scrolling back and
      // forth to look at it. Closing also resets one shut by hand, which is
      // what makes the cue repeatable.
      const direction = scene?.direction;
      timeline.call(
        () => {
          if ((direction?.current ?? 1) > 0) setBatteryOpen(true);
        },
        undefined,
        SCENE_REVEAL_AT,
      );
      timeline.call(
        () => {
          if ((direction?.current ?? 1) < 0) setBatteryOpen(false);
        },
        undefined,
        SCENE_RESET_AT,
      );

      // Callbacks only fire on a crossing, and ScrollTrigger suppresses them
      // while it renders the timeline to the current scroll position on setup.
      // Land on the state that position implies, so a reload deep in the scene
      // doesn't sit with the popover shut until you scroll back past 55%.
      setBatteryOpen((scene?.progress.current ?? 0) >= SCENE_REVEAL_AT);
    },
    { dependencies: [timeline], scope: rootRef },
  );

  // Phones build no timeline, so the popover gets its own trigger: it opens as
  // the machine comes into view and closes on the way back up. That is the only
  // thing scrolling does down here — the composition itself never moves.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        `(max-width: ${MOBILE_MAX_W}px) and (prefers-reduced-motion: no-preference)`,
        () => {
          if (!rootRef.current) return;
          ScrollTrigger.create({
            trigger: rootRef.current,
            start: "top 70%",
            onEnter: () => setBatteryOpen(true),
            onLeaveBack: () => setBatteryOpen(false),
          });
        },
      );
      return () => mm.revert();
    },
    { scope: rootRef },
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
        <AnimatedMockupBody
          batteryOpen={batteryOpen}
          onBatteryOpenChange={setBatteryOpen}
        />
      </StageScaleProvider>

      {/* The second note, beside the popover. Opacity 0 inline rather than via
          a class, so it is invisible on the server-rendered first paint and
          stays so in the degraded branch, where no timeline reveals it. */}
      <div
        ref={noteAltRef}
        className="pointer-events-none absolute z-50 hidden w-max opacity-0 xl:block"
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
          className="opacity-90 rotate-[-6deg]"
        >
          psst.... its interactive!
        </HandwrittenNote>
      </div>
    </div>
  );
}
