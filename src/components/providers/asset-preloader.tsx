"use client";

import { useEffect } from "react";

export function AssetPreloader() {
  useEffect(() => {
    // Preload heavy assets for the application so they are ready instantly
    const imagesToPreload = [
      // Mockup and screens
      "/mockup/mockup.png",
      "/mockup/macos-bg.png",
      "/mockup/static-screen.png",
      "/mockup/apple-lock.svg",
      "/mockup/battery.svg",
      "/mockup/wifi.svg",
      "/mockup/control-centre.svg",

      // Dock Icons
      "/icons/Finder.svg",
      "/icons/Notes.svg",
      "/icons/Safari.svg",
      "/icons/Stasis.svg",
      "/icons/Messages.svg",
      "/icons/Photos.svg",
      "/icons/Calendar.svg",

      // DMG Installer UI
      "/dmg/dmg-background.png",
      "/dmg/app-icon.png",
      "/dmg/mac-drive.png",
      "/dmg/arrow-horizontal.svg",
      "/dmg/arrow-vertical.svg",

      // Layout / Marketing / Features
      "/background.png",
      "/cutting-mat.png",
      "/cta.png",
      "/features/magsafe.jpg",
      "/features/energy.png",
    ];

    imagesToPreload.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });

    const audioToPreload = [
      "/mockup/macos-startup-sound.mp3",
      "/sounds/click.mp3", // generic click if used
    ];

    audioToPreload.forEach((src) => {
      const audio = new window.Audio();
      audio.src = src;
      audio.preload = "auto";
    });

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
