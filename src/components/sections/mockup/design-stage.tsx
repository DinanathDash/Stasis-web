"use client";

import { useCallback, useLayoutEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import {
  STAGE_W,
  STAGE_H,
  STAGE_AR,
  STAGE_OPTICAL_DY,
  START_MAX_W,
  STAGE_GUTTER_X,
  STAGE_GUTTER_Y,
} from "./stage-geometry";

/**
 * Fits the fixed 1454x872 stage into the pinned viewport and keeps the live
 * scale published for anything that needs it.
 *
 * Two transform nodes, and the split is about *write ownership*, not
 * rendering (browsers collapse nested transforms into one matrix anyway):
 *
 *   .stageScroll  <- GSAP owns `transform`. Nothing else may write it.
 *   .stageBase    <- React owns `transform`. Rewritten on resize only.
 *
 * GSAP maintains its own transform cache on any element it tweens. If React
 * also wrote to that node when the base fit changed, the two would silently
 * fight and produce drift that only reproduces on window resize.
 *
 * Note there is no `transform-origin` anywhere. `.stageViewport` is a
 * zero-size box at the centre of the pin, so every default `50% 50%` origin
 * in the chain resolves to that same single point, and `.stageBase`'s
 * half-size offset centres it there. Scale and x therefore stay independent
 * degrees of freedom, which is what lets the drift be timed separately from
 * the growth.
 */
export function useStageFit({
  pinRef,
  scrollRef,
}: {
  pinRef: RefObject<HTMLDivElement | null>;
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const baseRef = useRef<HTMLDivElement | null>(null);
  const baseScaleRef = useRef(1);
  const totalScaleRef = useRef(1);
  /** Cached in `measure` so `sync` never reads layout. See below. */
  const pinWidthRef = useRef(0);

  /**
   * Publishes total scale (base x scroll) to both consumers from one place,
   * so the CSS custom property and the JS ref can never disagree.
   *
   * Runs on every scrubbed frame, so it must not touch layout. Everything here
   * is either a GSAP transform-cache read or a style write; the pin's width
   * comes from `measure`'s cache rather than `clientWidth`, which would force
   * a reflow each frame by reading right after GSAP's transform write.
   */
  const sync = useCallback(() => {
    const pin = pinRef.current;
    const scrollEl = scrollRef.current;
    if (!pin) return;

    const k = scrollEl ? Number(gsap.getProperty(scrollEl, "scaleX")) || 1 : 1;
    const total = baseScaleRef.current * k;
    totalScaleRef.current = total;

    pin.style.setProperty("--stage-scale", String(total));

    // Live viewport x of the stage's right edge, so the aside can hug the
    // mockup in pure CSS: `left: calc(var(--stage-right) + 3rem)`.
    const x = scrollEl ? Number(gsap.getProperty(scrollEl, "x")) || 0 : 0;
    const right = pinWidthRef.current / 2 + x + (STAGE_W * total) / 2;
    pin.style.setProperty("--stage-right", `${right}px`);
  }, [pinRef, scrollRef]);

  const measure = useCallback(() => {
    const pin = pinRef.current;
    const base = baseRef.current;
    if (!pin || !base) return;

    // ResizeObserver rather than `vw` math: the height constraint binds on
    // short laptops, and `vw` includes the scrollbar gutter.
    const { width, height } = pin.getBoundingClientRect();
    pinWidthRef.current = width;
    const availW = width - 2 * STAGE_GUTTER_X;
    const availH = height - 2 * STAGE_GUTTER_Y;
    const s = Math.min(availW, availH * STAGE_AR, START_MAX_W) / STAGE_W;

    baseScaleRef.current = s;
    // Order is load-bearing: transform functions apply right-to-left, so the
    // optical nudge happens in already-scaled space and is correct at every
    // scale without ever being animated.
    base.style.transform = `scale(${s}) translateY(${STAGE_OPTICAL_DY}px)`;
    pin.style.setProperty("--stage-base-scale", String(s));
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

  return { viewportRef, baseRef, baseScaleRef, totalScaleRef, measure, sync };
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
    <div ref={viewportRef} className={viewportClassName}>
      <div ref={scrollRef} className={scrollClassName}>
        <div
          ref={baseRef}
          className="absolute"
          style={{
            width: STAGE_W,
            height: STAGE_H,
            left: -STAGE_W / 2,
            top: -STAGE_H / 2,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * An object on the stage, positioned in design units.
 *
 * Every element of the mockup — the screen, the menu bar, the dock, and later
 * the Stasis settings window and popover — is one of these. Adding a new
 * object means adding a `<StageLayer>` with integer DU coordinates; it
 * inherits the stage's transform for free and needs no responsive rules.
 */
export function StageLayer({
  x,
  y,
  w,
  h,
  z = 0,
  clip = false,
  radius,
  className,
  style,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  z?: number;
  clip?: boolean;
  radius?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn("absolute", clip && "overflow-hidden", className)}
      style={{
        left: x,
        top: y,
        width: w,
        height: h,
        zIndex: z,
        borderRadius: radius,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
