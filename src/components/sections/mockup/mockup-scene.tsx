"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/scroll/gsap";
import {
  SCRUB_SCENE,
  SCENE_EASE_GROW,
  SCENE_EASE_DRIFT,
  SCENE_DRIFT_OFFSET,
  SCENE_EASE_SETTLE,
} from "@/lib/ease";
import styles from "./mockup-scene.module.css";
import { StageNodes, useStageFit } from "./design-stage";
import { StageScaleProvider } from "./stage-context";
import { SceneProvider } from "./scene-context";
import { computeSceneTargets, SCENE_CENTER_BIAS } from "./stage-geometry";

/**
 * Mirrors the `max-width: 767px` degrade in mockup-scene.module.css.
 * If you change one, change the other.
 */
export const SCENE_MQ = "(min-width: 768px)";

/** Progress past which the screen is settled enough to accept pointer input. */
const SCREEN_LIVE_AT = 0.98;

/**
 * The pinned mockup scene: the MacBook grows and drifts left as you scroll,
 * clearing the right of the viewport for the `aside` slot.
 *
 * Pinning is CSS `position: sticky`; ScrollTrigger only supplies values. Its
 * own `pin: true` would inject a `div.pin-spacer` behind React's back and
 * compute the scene's height after hydration instead of at first paint.
 *
 * `device` is whatever sits on the stage and scales with the scene; anything
 * that should stay at reading size goes in `aside`, outside the transform.
 */
export function MockupScene({
  device,
  aside,
}: {
  device: React.ReactNode;
  aside?: React.ReactNode;
}) {
  const sceneRef = useRef<HTMLElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const asideRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(0);
  const directionRef = useRef(1);
  const liveRef = useRef(false);

  const [timeline, setTimeline] = useState<gsap.core.Timeline | null>(null);

  const {
    viewportRef,
    baseRef,
    baseScaleRef,
    totalScaleRef,
    restOffsetRef,
    pinHeightRef,
    measure,
    sync,
  } = useStageFit({ pinRef, scrollRef, varsRef: asideRef });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // matchMedia reverts every GSAP-authored inline style when the query
      // stops matching, so a resize to mobile strands no stale transform.
      mm.add(`${SCENE_MQ} and (prefers-reduced-motion: no-preference)`, () => {
        const scrollEl = scrollRef.current;
        const sceneEl = sceneRef.current;
        const pinEl = pinRef.current;
        if (!scrollEl || !sceneEl || !pinEl) return;

        // Function-based values, re-evaluated on every refresh: both targets
        // depend on the viewport, the measured base scale and the pin's height.
        const targets = () =>
          computeSceneTargets(
            baseScaleRef.current,
            window.innerWidth,
            pinHeightRef.current,
          );

        // Normalised to 1 so collaborators can place tweens at a literal
        // fraction of the pin (see scene-context.tsx). Every tween must end at
        // exactly 1: one placed at 0.12 with duration 1 would stretch the
        // timeline to 1.12 and silently rescale everyone else's placements.
        const tl = gsap.timeline({ defaults: { ease: "none", duration: 1 } });

        tl.fromTo(
          scrollEl,
          { scale: 1 },
          { scale: () => targets().k, ease: SCENE_EASE_GROW, force3D: false },
          0,
        ).fromTo(
          scrollEl,
          { x: 0 },
          {
            x: () => targets().x,
            duration: 1 - SCENE_DRIFT_OFFSET,
            ease: SCENE_EASE_DRIFT,
            force3D: false,
          },
          // A second beat, after the growth has started. Baking it into
          // transform-origin instead would make this retiming impossible.
          SCENE_DRIFT_OFFSET,
        );

        ScrollTrigger.create({
          trigger: sceneEl,
          start: "top top",
          // The point where the sticky box stops sticking — definitionally
          // the end of the pin, so it stays correct if --scene-scroll is
          // retuned in CSS without touching this file.
          end: "bottom bottom",
          scrub: SCRUB_SCENE,
          invalidateOnRefresh: true,
          animation: tl,
          onUpdate: (self) => {
            progressRef.current = self.progress;
            directionRef.current = self.direction;
            sync();

            const live = self.progress >= SCREEN_LIVE_AT;
            if (live !== liveRef.current) {
              liveRef.current = live;
              pinEl.dataset.screenLive = String(live);
            }
          },
          onToggle: (self) =>
            scrollEl.classList.toggle(styles.active, self.isActive),
        });

        // The vertical settle, on the APPROACH — deliberately not on the
        // timeline above. The stage opens at production height and has to end
        // up centred, which on a tall viewport is a couple of hundred pixels.
        // Run inside the pin, that travel is the only vertical motion on
        // screen and it points *down* while the reader scrolls down: the
        // mockup rises with the page, reverses, then stops. That reversal is
        // the bounce. Spent on the approach it hides inside motion already
        // happening — the pin box travels a full viewport up while the stage
        // drifts down within it, so the net never changes sign.
        //
        // `start: 0` is a raw number, so an absolute scroll position rather
        // than an element edge. "top bottom" would have a third of the settle
        // already applied at rest on a tall viewport, where the mockup is
        // on screen at the top of the page; from 0, scroll 0 is production
        // height by construction.
        ScrollTrigger.create({
          trigger: sceneEl,
          start: 0,
          end: "top top",
          scrub: SCRUB_SCENE,
          invalidateOnRefresh: true,
          animation: gsap.fromTo(
            scrollEl,
            { y: 0 },
            {
              // Cancels the rest offset the viewport's margin applies, landing
              // the stage centred and biased down to clear the header.
              y: () => SCENE_CENTER_BIAS - restOffsetRef.current,
              ease: SCENE_EASE_SETTLE,
              force3D: false,
            },
          ),
        });

        setTimeline(tl);
        return () => setTimeline(null);
      });

      // GeistSans swaps metrics after load, which moves the hero's height and
      // therefore where `start: "top top"` lands.
      document.fonts?.ready
        .then(() => {
          measure();
          ScrollTrigger.refresh();
        })
        .catch(() => {});

      return () => mm.revert();
    },
    { scope: sceneRef },
  );

  return (
    <section ref={sceneRef} className={styles.scene}>
      <div
        ref={pinRef}
        className={styles.pin}
        data-screen-live="false"
        suppressHydrationWarning
      >
        <SceneProvider
          value={{
            timeline,
            progress: progressRef,
            scale: totalScaleRef,
            direction: directionRef,
          }}
        >
          <StageScaleProvider scaleRef={totalScaleRef}>
            <StageNodes
              viewportRef={viewportRef}
              scrollRef={scrollRef}
              baseRef={baseRef}
              viewportClassName={styles.stageViewport}
              scrollClassName={styles.stageScroll}
            >
              {device}
            </StageNodes>
          </StageScaleProvider>

          {aside ? (
            <div ref={asideRef} className={styles.aside}>
              {aside}
            </div>
          ) : null}
        </SceneProvider>
      </div>
    </section>
  );
}
