"use client";

import { useEffect } from "react";

/**
 * Warms assets the page will need but cannot discover in time.
 *
 * The list is short because a preload here only helps under two conditions:
 *
 *  1. The URL must be the one the browser will actually request. Anything
 *     rendered through `next/image` is fetched from `/_next/image?url=…&w=…`,
 *     so warming its raw path caches a file nothing asks for again. (SVGs are
 *     the exception — `next/image` passes those through unchanged.)
 *  2. The asset must not already be in the rendered page. This runs in an
 *     effect, long after the browser started fetching everything the first
 *     paint referenced, including the CSS backgrounds.
 *
 * What is left is what mounts *later*: the download dialog.
 */
export function AssetPreloader() {
  useEffect(() => {
    const imagesToPreload = [
      // None of this exists in the DOM until the download button is clicked,
      // so without warming it the fetch begins on the click.
      "/dmg/dmg-background.webp",
      "/dmg/arrow-horizontal.svg",
      "/dmg/arrow-vertical.svg",
    ];

    imagesToPreload.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });

    // The feature videos set `preload="auto"` themselves, but sit far below the
    // fold; starting them here means they are ready on arrival.
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
