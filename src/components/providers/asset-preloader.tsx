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
      "/background.webp",
      "/cta.webp",
      "/cutting-mat.webp",
      "/dmg/app-icon.png",
      "/dmg/arrow-horizontal.svg",
      "/dmg/arrow-vertical.svg",
      "/dmg/dmg-background.webp",
      "/dmg/mac-drive.png",
      "/features/energy.png",
      "/features/magsafe.jpg",
      "/icons/App Store.svg",
      "/icons/Finder.svg",
      "/icons/Music.svg",
      "/icons/Notes.svg",
      "/icons/Photos.svg",
      "/icons/Safari.svg",
      "/icons/Stasis.webp",
      "/mockup/battery.svg",
      "/mockup/control-centre.svg",
      "/mockup/macos-bg.avif",
      "/mockup/mockup.png",
      "/mockup/power-sankey.svg",
      "/mockup/wifi.svg",
    ];

    imagesToPreload.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });

    const videosToPreload = [
      "/features/notch-hud.mp4",
      "/features/power-flow.mov",
      "/features/spotlight.mov",
    ];

    videosToPreload.forEach((src) => {
      const video = document.createElement("video");
      video.src = src;
      video.preload = "auto";
    });
  }, []);

  return null;
}
