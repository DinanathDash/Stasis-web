"use client";

import { useCallback, useLayoutEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import {
  STAGE_W,
  STAGE_H,
  STAGE_AR,
  STAGE_OPTICAL_DY,
  START_MAX_W,
  STAGE_GUTTER_X,
  STAGE_GUTTER_Y,
  SCENE_REST_TOP,
  MOBILE_MAX_W,
  MOBILE_LID_RIGHT_VW,
  LID_RIGHT,
  MOBILE_TOP,
  MOBILE_PIN_H,
  DU_PER_CSS_PX,
  computeMobilePlacement,
} from "./stage-geometry";

/**
 * Fits the fixed 1454x872 stage into the pinned viewport and publishes the live
 * scale.
 *
 * Two transform nodes, split by *write ownership* rather than rendering: GSAP
 * owns `.stageScroll`'s transform, React owns `.stageBase`'s. GSAP keeps its
 * own transform cache, so a second writer on the same node produces drift that
 * only reproduces on resize.
 *
 * There is no `transform-origin` anywhere: `.stageViewport` is a zero-size box
 * at the pin's centre, so every default `50% 50%` resolves to that one point.
 * Scale and x therefore stay independent, which is what lets the drift be timed
 * separately from the growth.
 */
export function useStageFit({
  pinRef,
  scrollRef,
  varsRef,
}: {
  pinRef: RefObject<HTMLDivElement | null>;
  scrollRef: RefObject<HTMLDivElement | null>;
  /**
   * Where the live custom properties are written, once per scrubbed frame.
   * Deliberately not the pin: a custom property invalidates style for the whole
   * subtree beneath it, and the pin is the ancestor of the entire mockup. Point
   * this at a small leaf (the scene uses the aside). Anything inside the stage
   * should read `useStageScale()` instead.
   */
  varsRef?: RefObject<HTMLElement | null>;
}) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const baseRef = useRef<HTMLDivElement | null>(null);
  const baseScaleRef = useRef(1);
  const totalScaleRef = useRef(1);
  /** Cached in `measure` so `sync` never reads layout. See below. */
  const pinWidthRef = useRef(0);
  /** The pin's height, for the scene's end-scale ceilings. */
  const pinHeightRef = useRef(0);
  /** GSAP transform-cache getter, bound once per scroll node. See `sync`. */
  const getPropRef = useRef<ReturnType<typeof gsap.getProperty> | null>(null);
  const getPropTargetRef = useRef<HTMLElement | null>(null);
  /** Offset from the pin's centre that puts the mockup at production height.
   *  The scene eases it away on the approach. 0 when degraded. */
  const restOffsetRef = useRef(0);

  /**
   * Publishes total scale (base x scroll) from one place, so the CSS property
   * and the JS ref can never disagree. Runs every scrubbed frame, so it must
   * not touch layout — the pin's width comes from `measure`'s cache, since
   * reading `clientWidth` right after GSAP's transform write would force a
   * reflow each frame.
   */
  const sync = useCallback(() => {
    const scrollEl = scrollRef.current;

    // The two-argument gsap.getProperty rebuilds its bound getter on every
    // access; hold it instead, rebuilding only if the node is swapped out.
    if (scrollEl && getPropTargetRef.current !== scrollEl) {
      getPropTargetRef.current = scrollEl;
      getPropRef.current = gsap.getProperty(scrollEl);
    }
    const getProp = scrollEl ? getPropRef.current : null;

    const k = getProp ? Number(getProp("scaleX")) || 1 : 1;
    const total = baseScaleRef.current * k;
    totalScaleRef.current = total;

    const vars = varsRef?.current;
    if (!vars) return;

    vars.style.setProperty("--stage-scale", String(total));

    // Live viewport x of the stage's right edge, so the aside can hug the
    // mockup in CSS: `left: calc(var(--stage-right) + 3rem)`.
    const x = getProp ? Number(getProp("x")) || 0 : 0;
    const right = pinWidthRef.current / 2 + x + (STAGE_W * total) / 2;
    vars.style.setProperty("--stage-right", `${right}px`);
  }, [scrollRef, varsRef]);

  const measure = useCallback(() => {
    const pin = pinRef.current;
    const base = baseRef.current;
    if (!pin || !base) return;

    // ResizeObserver rather than `vw` math: the height constraint binds on
    // short laptops, and `vw` includes the scrollbar gutter.
    const { width, height } = pin.getBoundingClientRect();
    pinWidthRef.current = width;
    pinHeightRef.current = height;

    let s: number;
    let top: number;
    let left = 0;

    if (width <= MOBILE_MAX_W) {
      // Phones get a fixed scale and a deliberate crop rather than a fit — see
      // computeMobilePlacement.
      const m = computeMobilePlacement(width, height);
      s = m.scale;
      top = m.top;
      left = m.left;
    } else {
      const availW = width - 2 * STAGE_GUTTER_X;
      const availH = height - 2 * STAGE_GUTTER_Y;
      s = Math.min(availW, availH * STAGE_AR, START_MAX_W) / STAGE_W;

      // Open at production height rather than centred; the scene eases this
      // away on the approach. Read the computed position rather than re-testing
      // the media query, so this cannot disagree with the CSS about whether the
      // scene is running.
      //
      // The optical nudge has to come back out here: `.stageBase` renders as
      // `scale(s) translateY(DY)`, so its top edge lands DY*s below where the
      // box centre alone would put it — ~31px at the default fit.
      const pinned = getComputedStyle(pin).position === "sticky";
      top = pinned
        ? SCENE_REST_TOP + (STAGE_H / 2 - STAGE_OPTICAL_DY) * s - height / 2
        : 0;
    }

    baseScaleRef.current = s;
    // Order is load-bearing: transform functions apply right-to-left, so the
    // optical nudge happens in already-scaled space and is correct at every
    // scale without ever being animated.
    base.style.transform = `scale(${s}) translateY(${STAGE_OPTICAL_DY}px)`;
    pin.style.setProperty("--stage-base-scale", String(s));

    restOffsetRef.current = top;
    pin.style.setProperty("--stage-rest-offset", `${top}px`);
    pin.style.setProperty("--stage-rest-left", `${left}px`);

    sync();
  }, [pinRef, sync]);

  useLayoutEffect(() => {
    const pin = pinRef.current;
    if (!pin) return;

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(pin);
    // GeistSans swaps metrics after load, which can move the pin.
    document.fonts?.ready.then(measure).catch(() => {});

    return () => ro.disconnect();
  }, [pinRef, measure]);

  return {
    viewportRef,
    baseRef,
    baseScaleRef,
    totalScaleRef,
    restOffsetRef,
    pinHeightRef,
    measure,
    sync,
  };
}

/** Markup for the two inner transform nodes. Kept together with the hook so
 *  the class contract and the measuring code can't drift apart. */
export function StageNodes({
  viewportRef,
  scrollRef,
  baseRef,
  viewportClassName,
  scrollClassName,
  children,
}: {
  viewportRef: RefObject<HTMLDivElement | null>;
  scrollRef: RefObject<HTMLDivElement | null>;
  baseRef: RefObject<HTMLDivElement | null>;
  viewportClassName?: string;
  scrollClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      ref={viewportRef}
      className={viewportClassName}
      suppressHydrationWarning
    >
      <div
        dangerouslySetInnerHTML={{
          __html: `<script>
            (function(){
              var w = window.innerWidth, h = window.innerHeight;
              var s, t = 0, l = 0;
              if (w <= ${MOBILE_MAX_W}) {
                s = ${START_MAX_W / STAGE_W};
                var lidArm = (${LID_RIGHT} * ${DU_PER_CSS_PX} - ${STAGE_W} / 2) * s;
                l = ${MOBILE_LID_RIGHT_VW} * w - lidArm - w / 2;
                t = ${MOBILE_TOP} + (${STAGE_H / 2 - STAGE_OPTICAL_DY}) * s - ${MOBILE_PIN_H} / 2;
              } else {
                s = Math.min(w - ${2 * STAGE_GUTTER_X}, (h - ${2 * STAGE_GUTTER_Y}) * ${STAGE_AR}, ${START_MAX_W}) / ${STAGE_W};
                var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                t = reduced ? 0 : ${SCENE_REST_TOP} + (${STAGE_H / 2 - STAGE_OPTICAL_DY}) * s - h / 2;
              }
              var pin = document.currentScript.parentElement.parentElement.parentElement;
              if (pin) {
                pin.style.setProperty('--stage-base-scale', s);
                pin.style.setProperty('--stage-rest-offset', t + 'px');
                pin.style.setProperty('--stage-rest-left', l + 'px');
              }
            })();
          </script>`,
        }}
      />
      <div ref={scrollRef} className={scrollClassName}>
        <div
          ref={baseRef}
          className="absolute"
          style={{
            width: STAGE_W,
            height: STAGE_H,
            left: -STAGE_W / 2,
            top: -STAGE_H / 2,
            transform: `scale(var(--stage-base-scale, ${START_MAX_W / STAGE_W})) translateY(${STAGE_OPTICAL_DY}px)`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
