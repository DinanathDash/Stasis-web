"use client";

import { useEffect } from "react";

/**
 * Warms assets that the page will need but has no way to discover in time.
 *
 * The list is deliberately short, because a preload here only helps under two
 * conditions, and most assets meet neither:
 *
 *  1. **The URL has to be the one the browser will actually request.** Anything
 *     rendered through `next/image` is fetched from `/_next/image?url=…&w=…`,
 *     so warming its raw path caches a file that is never asked for again. The
 *     mockup frame, the wallpaper, the DMG icons and the feature stills all go
 *     that route; this used to fetch ~6.8MB of them on every page load for
 *     nothing. `next/image` has its own answer for that anyway —
 *     `loading="eager" fetchPriority="high"`, which the frame already sets.
 *     (SVGs are the exception: `next/image` passes them through at their
 *     original path, so warming those does work.)
 *
 *  2. **The asset must not already be in the rendered page.** This runs in an
 *     effect, after hydration, by which point the browser has long since
 *     started fetching everything the first paint referenced — including the
 *     CSS backgrounds. Preloading those is a duplicate request, not a head
 *     start.
 *
 * What is left is the assets that mount *later*: the download dialog, which
 * does not exist until the button is clicked, and one hover state.
 */
export function AssetPreloader() {
  useEffect(() => {
    const imagesToPreload = [
      // The download dialog — none of this is in the DOM until the button is
      // clicked, so without warming it the fetch begins on the click.
      "/dmg/dmg-background.webp",
      "/dmg/arrow-horizontal.svg",
      "/dmg/arrow-vertical.svg",

      // Swapped in on hover over the mockup's Apple button.
      "/mockup/apple-lock.svg",
    ];

    imagesToPreload.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });

    // Played by the startup screen. That screen is not currently in the boot
    // sequence — see animated-mockup.tsx — but it is cheap to keep warm for
    // when it is.
    const audio = new window.Audio();
    audio.src = "/mockup/macos-startup-sound.mp3";
    audio.preload = "auto";

    // The feature videos set `preload="auto"` on their own elements, but those
    // sit far below the fold; starting them here means they are ready by the
    // time the reader scrolls down.
    const videosToPreload = [
      "/features/spotlight.mov",
      "/features/power-flow.mov",
      "/features/notch-hud.mp4",
    ];

    videosToPreload.forEach((src) => {
      const video = document.createElement("video");
      video.src = src;
      video.preload = "auto";
    });
  }, []);

  return null;
}
