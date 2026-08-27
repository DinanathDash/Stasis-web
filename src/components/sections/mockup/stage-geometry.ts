/**
 * Design-unit (DU) grid for the MacBook mockup.
 *
 * The stage is a fixed 1454x872 px box that is never resized — it is only ever
 * transformed. Every size inside it is authored once, in these units, and the
 * single CSS transform on the stage handles all responsiveness. That is what
 * keeps the mockup's internal proportions stable at any scale, and what lets
 * pointer events keep working (CSS transforms are hit-test aware).
 *
 * Rule for anything rendered inside the stage: no `sm:`/`md:` variants.
 * Breakpoint variants resolve against the *viewport*, but the stage is always
 * 1454 DU wide regardless of viewport, so a `md:` inside it is incoherent.
 */

/** 1454x872 is exactly 1/4 of public/mockup/mockup.png (5816x3491). */
export const STAGE_W = 1454;
export const STAGE_H = 872;
export const STAGE_AR = STAGE_W / STAGE_H; // 1.66743

/**
 * The screen cutout, measured from mockup.png's alpha channel rather than
 * eyeballed. The PNG has a real transparent hole here, carrying the bezel's
 * own corner radius — which is why the screen layer sits BEHIND the frame.
 */
export const SCREEN = { x: 144, y: 20, w: 1165, h: 753 } as const;

/** The notch is baked into the frame image (opaque, DU x667->790, y20->41).
 *  Do not draw a second one — it would be fully occluded. Exported so the
 *  menu bar knows which region to keep its items clear of. */
export const NOTCH = { x: 667, y: 20, w: 123, h: 21 } as const;

/**
 * The screen's centre sits 39.5 DU above the frame's centre. Applied once on
 * the base node as `scale(s) translateY(39.5px)` — transform functions apply
 * right-to-left, so the nudge lands in already-scaled space and stays correct
 * at every scale without ever being animated.
 */
export const STAGE_OPTICAL_DY = STAGE_H / 2 - (SCREEN.y + SCREEN.h / 2); // 39.5

/** Tailwind `max-w-6xl`, what the mockup renders at today. Capping the base
 *  fit here keeps the resting composition byte-identical to the old layout. */
export const START_MAX_W = 1152;

/** CSS px -> DU at the width the current design was tuned for. Every legacy
 *  `md:` value was multiplied by this to produce the DU values below. */
export const DU_PER_CSS_PX = STAGE_W / START_MAX_W; // 1.26215

/**
 * The percentage-based mockups (animated-mockup, interactive-mockup,
 * static-mockup) and their screen components are authored in CSS px against a
 * `max-w-6xl` box — exactly 1152 x 690.9.
 *
 * That box maps onto the stage with a single uniform scale, because
 * STAGE_W / LEGACY_W is DU_PER_CSS_PX by definition. So one of those mockups
 * can be mounted on the stage by rendering it at its natural size inside a
 * LEGACY_W x LEGACY_H box and scaling that box, rather than rewriting every
 * value inside it into design units.
 *
 * Their screen percentages land on SCREEN to within half a design unit:
 *   left 9.88% -> 143.6 (SCREEN.x 144), width 80.16% -> 1165.5 (SCREEN.w 1165)
 */
export const LEGACY_W = START_MAX_W; // 1152
export const LEGACY_H = STAGE_H / DU_PER_CSS_PX; // 690.9
export const LEGACY_SCALE = DU_PER_CSS_PX; // 1.26215

/** Breathing room between the stage and the pinned viewport's edges. */
export const STAGE_GUTTER_X = 32;
export const STAGE_GUTTER_Y = 40;

/**
 * Where the mockup's top edge sits at rest, measured from the top of the pin.
 *
 * 96px is the `mt-24` the percentage-based mockups carry, so the scene opens
 * at exactly the height the mockup has in production. Matching that is
 * viewport-dependent — a flow-positioned mockup sits a fixed distance below
 * the hero, whereas a pinned one centres in the viewport — so the scene holds
 * this position at rest and eases to centred as it pins. See
 * `restOffsetRef` in design-stage.tsx.
 */
export const SCENE_REST_TOP = 96;

/**
 * How far below the pin's centre the mockup settles once the scene takes
 * over. Absorbs the sticky header, whose own height flips between 64 and
 * ~80px when it collapses — chasing that with a sticky `top` would jump at
 * the moment it changes.
 */
export const SCENE_CENTER_BIAS = 24;

// ---------------------------------------------------------------------------
// Scene choreography — the two knobs that define the end composition.
// ---------------------------------------------------------------------------

/**
 * Rendered stage width as a fraction of viewport width, at full scroll.
 * This is the zoom control — raise it to push in harder, lower it to ease off.
 *
 * It only controls size. The right edge is pinned by SCENE_END_RIGHT_VW, so
 * changing this moves the left edge alone and the copy slot keeps its width.
 *
 * Landmarks: at 1.0 the mockup ends exactly as wide as the viewport; above
 * ~1.15 it starts to crop the menu bar and dock vertically. The current 0.775
 * bleeds ~16% off the left and clears the top and bottom entirely.
 */
export const SCENE_END_WIDTH_VW = 0.775;
/** Where the stage's right edge lands, as a fraction of viewport width.
 *  Everything to the right of this is the free slot for copy. */
export const SCENE_END_RIGHT_VW = 0.62;

/**
 * The lid's right edge, in legacy px, measured from mockup.png's alpha across
 * the vertical band the note occupies. The base flares wider than this — out
 * to the full 1152 — but only lower down, past the note.
 */
export const LID_RIGHT = 1052;

/**
 * Where the second "psst… it's interactive" note sits — the one that fades in
 * beside the battery popover once the mockup has zoomed.
 *
 * The note does not travel between the two spots. Sliding it dragged the eye
 * across the copy column; a cross-fade lets it simply be somewhere else.
 *
 * Anchored from the LEFT, not the right: the arrow tip is the edge that has
 * to clear the machine, and a right-anchored note pushes its own width back
 * over the lid as the text grows.
 *
 * In the note's own coordinate space — CSS px inside the 1152-wide legacy
 * box, not design units. Multiply by LEGACY_SCALE for DU.
 */
export const NOTE_ALT_LEFT = LID_RIGHT + 16;
export const NOTE_ALT_TOP = 22;

/** Where on the timeline the battery popover reveals itself, as a fraction of
 *  the pin — late enough that the mockup has settled and grown. */
export const SCENE_REVEAL_AT = 0.55;

/**
 * Resolve the scroll-driven targets. `k` multiplies the base scale (so the
 * timeline runs 1 -> k), `x` is in real screen px because `translate(x)
 * scale(k)` translates in the parent's coordinate space.
 *
 * The bleed is deliberately asymmetric: the mockup runs off the left while
 * stopping hard before the right, which is what keeps the copy slot clear
 * while the machine still reads as larger than the frame it is in.
 */
export function computeSceneTargets(baseScale: number, vw: number) {
  const endScale = (SCENE_END_WIDTH_VW * vw) / STAGE_W;
  return {
    k: baseScale > 0 ? endScale / baseScale : 1,
    x: (SCENE_END_RIGHT_VW - SCENE_END_WIDTH_VW / 2 - 0.5) * vw,
  };
}

// ---------------------------------------------------------------------------
// Component tokens, in DU.
// ---------------------------------------------------------------------------

/** macOS menu bar. 24 DU against 11.5 DU text preserves the 47% ratio the
 *  old `h-[3.2%]` + `text-[9px]` pairing produced. */
export const MENU_BAR = {
  H: 24,
  PAD_X: 25,
  TEXT: 11.5,
  GAP_LEFT: 20,
  GAP_RIGHT: 10,
  GAP_TIGHT: 7.5,
  ICON_SM: 10, // battery
  ICON_MD: 12.5, // apple logo
  ICON_LG: 15, // wifi, search, control centre
} as const;

/**
 * Dock. Derived from the old fixed-px dock (h-60, icons 40->64, range 150)
 * scaled by 1.15 so icons land at ~46 DU — which is both what the reference
 * screenshot measures and what real macOS works out to (a 56pt icon on a
 * 1512pt screen maps to ~43 DU on this 1165 DU screen).
 *
 * MAG_RANGE is in DU, so the pointer distance must be converted from viewport
 * px into DU before it is compared against it. See dock.tsx.
 */
export const DOCK = {
  H: 70,
  ICON_BASE: 46,
  ICON_MAX: 74,
  MAG_RANGE: 175,
  GAP: 9,
  PAD_X: 14,
  PAD_Y: 9,
  RADIUS: 18,
  ICON_RADIUS: 11.5,
  SEP_W: 2.3,
  SEP_H: 46,
  SEP_MX: 4.6,
  BOTTOM: 20,
  TOOLTIP_OFFSET: 44,
  TOOLTIP_TEXT: 14,
} as const;

/** Screen-local rects for the Stasis UI layers, measured off
 *  static-screen.png. Not rendered yet — seeds for the next phase, when the
 *  settings window and menu-bar popover become their own StageLayers. */
export const STASIS_LAYERS = {
  settingsWindow: { x: 285, y: 136, w: 595, h: 437 },
  menuPopover: { x: 923, y: 24, w: 233, h: 323 },
} as const;
