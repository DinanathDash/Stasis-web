"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/scroll/gsap";
import {
  SCRUB_SCENE,
  SCENE_EASE_GROW,
  SCENE_EASE_DRIFT,
  SCENE_DRIFT_OFFSET,
} from "@/lib/ease";
import styles from "./mockup-scene.module.css";
import { StageNodes, useStageFit } from "./design-stage";
import { StageScaleProvider } from "./stage-context";
import { SceneProvider } from "./scene-context";
import { computeSceneTargets } from "./stage-geometry";

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
 * Pinning is CSS `position: sticky`; ScrollTrigger only supplies values. Using
 * its `pin: true` would inject a `div.pin-spacer` and reparent nodes behind
 * React's back (a reliable source of `removeChild` errors on Fast Refresh),
 * and would compute the scene's height after hydration instead of at first
 * paint.
 *
 * `device` is whatever sits on the stage — the scene does not care which
 * mockup it is animating. Anything rendered there is in design units and
 * scales with the scene; anything that should stay at reading size goes in
 * `aside`, which sits outside the transformed subtree.
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
  const progressRef = useRef(0);
  const liveRef = useRef(false);

  const [timeline, setTimeline] = useState<gsap.core.Timeline | null>(null);

  const { viewportRef, baseRef, baseScaleRef, totalScaleRef, measure, sync } =
    useStageFit({ pinRef, scrollRef });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // gsap.matchMedia (not the deprecated ScrollTrigger.matchMedia) reverts
      // every GSAP-authored inline style when the query stops matching, so a
      // desktop-to-mobile resize doesn't strand a stale transform on the stage.
      mm.add(
        `${SCENE_MQ} and (prefers-reduced-motion: no-preference)`,
        () => {
          const scrollEl = scrollRef.current;
          const sceneEl = sceneRef.current;
          const pinEl = pinRef.current;
          if (!scrollEl || !sceneEl || !pinEl) return;

          // Function-based values, re-evaluated on every refresh because both
          // targets depend on viewport width and the measured base scale.
          const targets = () =>
            computeSceneTargets(baseScaleRef.current, window.innerWidth);

          // Duration normalised to 1 so collaborators can place tweens at a
          // literal fraction of the pin. See scene-context.tsx.
          const tl = gsap.timeline({ defaults: { ease: "none", duration: 1 } });

          tl.fromTo(
            scrollEl,
            { scale: 1 },
            { scale: () => targets().k, ease: SCENE_EASE_GROW, force3D: true },
            0,
          ).fromTo(
            scrollEl,
            { x: 0 },
            { x: () => targets().x, ease: SCENE_EASE_DRIFT, force3D: true },
            // The drift enters as a second beat, after the growth has started.
            // Baking it into transform-origin instead would make this
            // retiming impossible.
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

          setTimeline(tl);
          return () => setTimeline(null);
        },
      );

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
      <div ref={pinRef} className={styles.pin} data-screen-live="false">
        <SceneProvider
          value={{ timeline, progress: progressRef, scale: totalScaleRef }}
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

          {aside ? <div className={styles.aside}>{aside}</div> : null}
        </SceneProvider>
      </div>
    </section>
  );
}
