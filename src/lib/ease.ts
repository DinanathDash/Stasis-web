export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
export const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;

/** CSS string form of EASE_OUT for inline style transitions. */
export const EASE_OUT_CSS = "cubic-bezier(0.16, 1, 0.3, 1)";

/** Press feedback on buttons and other tappable surfaces. */
export const SPRING_PRESS = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 0.6,
} as const;

/** Content swaps — label/icon slots trading places inside a control. */
export const SPRING_SWAP = {
  type: "spring",
  stiffness: 460,
  damping: 30,
  mass: 0.55,
} as const;

/** Overlay panel entrances — modals and sheets summoned by pointer. */
export const SPRING_PANEL = {
  type: "spring",
  stiffness: 420,
  damping: 40,
  mass: 0.5,
} as const;

/** Shared-layout glides — pills, indicators and panels morphing between positions. */
export const SPRING_LAYOUT = {
  type: "spring",
  stiffness: 360,
  damping: 32,
  mass: 0.6,
} as const;

/** Cursor-follow physics for decorative mouse tracking (magnetic, tilt, dock). */
export const SPRING_MOUSE = {
  stiffness: 200,
  damping: 15,
  mass: 0.3,
} as const;

/** Dragged handles and fills (sliders) — critically damped `useSpring` config,
 * so the value follows the pointer butterily and never rebounds off an end. */
export const SPRING_GLIDE = {
  stiffness: 700,
  damping: 50,
  mass: 0.5,
} as const;

// ---------------------------------------------------------------------------
// GSAP / Lenis scroll tokens.
//
// Everything above feeds framer-motion and uses cubic-bezier arrays. GSAP
// does not consume that form — passing it an array silently falls back to
// power1.out. The eases below are GSAP ease *strings*; keep the two families
// apart.
// ---------------------------------------------------------------------------

/**
 * ScrollTrigger scrub, deliberately low.
 *
 * Lenis already smooths the scroll *position*; scrub smooths the animation's
 * *pursuit* of that position. Stacking both aggressively compounds latency
 * and reads as mush rather than silk. 0.4–0.6 is where they complement.
 */
export const SCRUB_SCENE = 0.5;

/** Growth of the pinned mockup through the scene. */
export const SCENE_EASE_GROW = "power2.inOut";
/** Leftward drift, entering as a second beat after the growth starts. */
export const SCENE_EASE_DRIFT = "power3.out";
/** Where the drift joins the timeline, as a fraction of the pin. */
export const SCENE_DRIFT_OFFSET = 0.12;

/**
 * The mockup opens at its production height and eases to centred over the
 * first fifth of the pin, before the growth has gone far enough for the shift
 * to read as movement in its own right.
 */
export const SCENE_EASE_SETTLE = "power2.out";
export const SCENE_SETTLE_DURATION = 0.2;

/**
 * The "psst… it's interactive" note swaps position by cross-fade rather than
 * travelling. The gap between `out` ending and `in` starting is deliberate —
 * a beat with no note at all, so the second one reads as a new remark rather
 * than the first one having moved.
 */
export const SCENE_NOTE_SWAP = {
  outAt: 0.12,
  outDuration: 0.14,
  inAt: 0.34,
  inDuration: 0.18,
} as const;

export const LENIS_OPTIONS = {
  lerp: 0.1,
  smoothWheel: true,
  /** Native momentum on touch — smoothed touch scrolling is widely disliked. */
  syncTouch: false,
  /** Anchor handling is routed through `scrollToY` instead. */
  anchors: false,
  autoResize: true,
} as const;
