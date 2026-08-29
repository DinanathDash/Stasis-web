/**
 * Design-unit (DU) grid for the MacBook mockup. The stage is a fixed 1454x872
 * box, never resized, only transformed — which keeps its proportions stable at
 * any scale and lets pointer events keep working, since CSS transforms are
 * hit-test aware.
 *
 * Nothing inside the stage may use `sm:`/`md:`: those resolve against the
 * viewport, but the stage is 1454 DU wide whatever the viewport is.
 */

/** Exactly 1/4 of public/mockup/mockup.png (5816x3491). */
export const STAGE_W = 1454;
export const STAGE_H = 872;
export const STAGE_AR = STAGE_W / STAGE_H;

/** The screen cutout, measured from mockup.png's alpha. The PNG has a real
 *  transparent hole carrying the bezel's radius, so the screen sits *behind*
 *  the frame. */
export const SCREEN = { x: 144, y: 20, w: 1165, h: 753 } as const;

/** The screen's centre sits 39.5 DU above the frame's. Applied on the base node
 *  as `scale(s) translateY(39.5px)` — transforms apply right-to-left, so the
 *  nudge lands in already-scaled space and needs no animating. */
export const STAGE_OPTICAL_DY = STAGE_H / 2 - (SCREEN.y + SCREEN.h / 2);

/** Tailwind `max-w-6xl`. Capping the base fit keeps the resting composition
 *  identical to the pre-scene layout. */
export const START_MAX_W = 1152;

/** The mockup is authored in CSS px against a 1152 x 690.9 box, and 1454 / 1152
 *  is DU_PER_CSS_PX by definition — so it maps onto the stage with one uniform
 *  scale instead of every value inside being rewritten. Its screen percentages
 *  land on SCREEN to within half a DU. */
export const DU_PER_CSS_PX = STAGE_W / START_MAX_W;
export const LEGACY_W = START_MAX_W;
export const LEGACY_H = STAGE_H / DU_PER_CSS_PX;
export const LEGACY_SCALE = DU_PER_CSS_PX;

/** Breathing room between the stage and the pinned viewport's edges. */
export const STAGE_GUTTER_X = 32;
export const STAGE_GUTTER_Y = 40;

/** The mockup's top edge at rest, from the top of the pin — the `mt-24` it
 *  carries in production. */
export const SCENE_REST_TOP = 96;

/** How far below the pin's centre it settles. Absorbs the sticky header, whose
 *  own height flips between 64 and ~80px when it collapses. */
export const SCENE_CENTER_BIAS = 24;

/**
 * The zoom control: stage width as a fraction of viewport width at full scroll.
 * Size only — the right edge is pinned by SCENE_END_RIGHT_VW, so this moves the
 * left edge alone and the copy slot keeps its width.
 *
 * The base fit is capped at 1152px while this is relative to the viewport, so
 * they cross over near 1486px wide: below that the scene pans more than it
 * zooms, above it the zoom grows with the display.
 */
export const SCENE_END_WIDTH_VW = 0.775;
/** Where the stage's right edge lands. Everything right of this is the aside. */
export const SCENE_END_RIGHT_VW = 0.62;

/** The lid's right edge in legacy px, measured from mockup.png's alpha across
 *  the band the note occupies — the base flares wider, but only lower down. */
export const LID_RIGHT = 1052;

/** Where the second "psst… it's interactive" note sits, in legacy px. Anchored
 *  from the LEFT, because the arrow tip is the edge that has to clear the
 *  machine and a right-anchored note pushes its width back over the lid. */
export const NOTE_ALT_LEFT = LID_RIGHT + 16;
export const NOTE_ALT_TOP = 22;

/** Crossing REVEAL downward opens the battery popover; crossing RESET upward
 *  closes it and clears whatever the reader did by hand. RESET sits just off
 *  zero because a callback on the timeline's own boundary is ambiguous. */
export const SCENE_REVEAL_AT = 0.55;
export const SCENE_RESET_AT = 0.04;

/** How far the frame's `drop-shadow(0 20px 50px)` reaches below the machine, in
 *  legacy px. Not the textbook 3 sigma (95px) — browsers approximate a Gaussian
 *  with three box blurs, whose support is wider. Measured back from where ink
 *  actually survives on screen: ~113px, rounded up for headroom. */
const SHADOW_REACH = 125;

/** Must match `overflow-clip-margin` on `.pin` in mockup-scene.module.css. The
 *  shadow is allowed to paint this far past the pin's edge; the fit below uses
 *  it as budget, so the two numbers have to agree. */
export const SCENE_CLIP_MARGIN = 256;

/** Distances from the stage's effective centre down to the machine's bottom
 *  edge, and to the far end of its shadow, per unit of scale. */
const ARM_TO_MACHINE = STAGE_H / 2 + STAGE_OPTICAL_DY;
const ARM_TO_SHADOW = ARM_TO_MACHINE + SHADOW_REACH * LEGACY_SCALE;

/**
 * `k` multiplies the base scale (the timeline runs 1 -> k); `x` is in real
 * screen px, since `translate(x) scale(k)` translates in the parent's space.
 * The bleed is asymmetric on purpose — off the left, stopping hard before the
 * right — which keeps the copy slot clear while the machine still reads as
 * larger than the frame it is in.
 *
 * The end scale is capped by the pin's HEIGHT as well as its width. Width alone
 * ignores the viewport's aspect ratio, and on anything wide and short the
 * composition outgrew the pin: at 1920x970 the machine's base was cropped and
 * its shadow was sliced at the clip edge, and on an ultrawide the machine lost
 * 230px. Two ceilings, both measured from the centre downward, which is the
 * binding side because the scene biases the composition down:
 *
 *   - the machine itself must fit inside the pin, so it is never cropped;
 *   - its shadow must fall inside the pin plus the clip margin, so it always
 *     fades out rather than ending on an edge.
 *
 * The top needs no ceiling: its arm is shorter and its room is larger by twice
 * the centre bias, so it can never bind first.
 */
export function computeSceneTargets(
  baseScale: number,
  vw: number,
  pinH: number,
) {
  const byWidth = (SCENE_END_WIDTH_VW * vw) / STAGE_W;
  const room = pinH / 2 - SCENE_CENTER_BIAS;
  const endScale =
    pinH > 0
      ? Math.min(
          byWidth,
          room / ARM_TO_MACHINE,
          (room + SCENE_CLIP_MARGIN) / ARM_TO_SHADOW,
        )
      : byWidth;

  return {
    k: baseScale > 0 ? endScale / baseScale : 1,
    // Derived from the scale that actually won, so the right edge stays pinned
    // at SCENE_END_RIGHT_VW even when a height ceiling has shrunk the stage.
    x: SCENE_END_RIGHT_VW * vw - vw / 2 - (STAGE_W * endScale) / 2,
  };
}

/** Screen-local rects for the Stasis UI, measured off the old
 *  static-screen.png (in git history). Not rendered yet — the seed for the
 *  settings window and menu-bar popover. */
export const STASIS_LAYERS = {
  settingsWindow: { x: 285, y: 136, w: 595, h: 437 },
  menuPopover: { x: 923, y: 24, w: 233, h: 323 },
} as const;
