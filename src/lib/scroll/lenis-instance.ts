import type Lenis from "lenis";

/**
 * The single Lenis instance for the document, and the one entry point for
 * programmatic scrolling.
 *
 * A module singleton rather than context, deliberately: the call sites are
 * scattered leaf client components across two routes, and there is exactly one
 * Lenis per document, so threading a provider down to each of them would be
 * churn for no gain.
 *
 * Every `window.scrollTo({ behavior: "smooth" })` in the app must go through
 * `scrollToY` instead. Native smooth scrolling and Lenis both try to drive
 * scroll position and will fight each other.
 */
let instance: Lenis | null = null;

export function setLenis(next: Lenis | null) {
  instance = next;
}

export function getLenis() {
  return instance;
}

type ScrollOptions = {
  /** Offset in px applied to the target, e.g. -100 to clear a sticky header. */
  offset?: number;
  /** Jump instantly instead of animating. */
  immediate?: boolean;
};

/**
 * Scrolls to a y position or an element. Falls back to the native API when
 * Lenis is absent — reduced motion, before hydration, or after teardown.
 */
export function scrollToY(
  target: number | HTMLElement,
  { offset = 0, immediate = false }: ScrollOptions = {},
) {
  const lenis = getLenis();

  if (lenis) {
    lenis.scrollTo(target, {
      offset,
      immediate,
      duration: immediate ? 0 : 1.1,
    });
    return;
  }

  const top =
    typeof target === "number"
      ? target + offset
      : target.getBoundingClientRect().top + window.scrollY + offset;

  window.scrollTo({ top, behavior: immediate ? "auto" : "smooth" });
}
