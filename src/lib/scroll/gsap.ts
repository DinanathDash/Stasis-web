"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Single registration point for GSAP plugins.
 *
 * This has to happen at module scope rather than in an effect: child effects
 * run before parent effects in React, so a scene component would try to build
 * its ScrollTrigger before a provider's effect had a chance to register the
 * plugin. `registerPlugin` is idempotent and SSR-safe.
 *
 * Import from "gsap" / "gsap/ScrollTrigger" (ESM), never "gsap/dist/…" (UMD,
 * larger and worse for tree-shaking under Turbopack).
 */
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
