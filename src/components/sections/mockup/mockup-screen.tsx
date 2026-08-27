"use client";

import { ProtectedImage } from "@/components/ui/protected-image";
import { Dock, DockIcon, DockSeparator } from "@/components/ui/dock";
import { StageLayer } from "./design-stage";
import { MenuBar } from "./menu-bar";
import { SCREEN, MENU_BAR, DOCK } from "./stage-geometry";

/**
 * The MacBook as a stage object: the screen composite, then the frame on top.
 *
 * Layering is deliberate — the screen sits at z=0, BEHIND the frame image at
 * z=10. mockup.png has a real transparent cutout carrying the bezel's own
 * corner radius, so the frame masks the screen for free. (The notch is baked
 * into the frame too; do not draw one here.)
 *
 * The screen is built as stacked layers so each can be upgraded from raster
 * to live DOM independently. Currently:
 *
 *   z=0   wallpaper           raster
 *   z=10  <MenuBar/>          live DOM
 *   z=20  Stasis settings     -- not yet built, see STASIS_LAYERS
 *   z=25  Stasis popover      -- not yet built, see STASIS_LAYERS
 *   z=30  <Dock/>             live DOM
 */
export function MockupScreen() {
  return (
    <>
      <StageLayer
        x={SCREEN.x}
        y={SCREEN.y}
        w={SCREEN.w}
        h={SCREEN.h}
        z={0}
        clip
        radius={14}
        className="bg-[#1b1030]"
      >
        {/* Wallpaper */}
        <ProtectedImage
          src="/mockup/macos-bg.avif"
          alt=""
          fill
          sizes="(max-width: 767px) 100vw, 90vw"
          className="object-cover"
        />

        {/* Menu bar */}
        <div
          className="absolute inset-x-0 top-0 z-10"
          style={{ height: MENU_BAR.H }}
        >
          <MenuBar />
        </div>

        {/* Dock */}
        <div
          className="pointer-events-none absolute inset-x-0 z-30 flex justify-center"
          style={{ bottom: DOCK.BOTTOM }}
        >
          <Dock className="pointer-events-auto">
            <DockIcon icon="/icons/Finder.svg" tooltip="Finder" />
            <DockIcon icon="/icons/Messages.svg" tooltip="Messages" />
            <DockIcon icon="/icons/Photos.svg" tooltip="Photos" />
            <DockIcon icon="/icons/Calendar.svg" tooltip="Calendar" />
            <DockIcon icon="/icons/Notes.svg" tooltip="Notes" />
            <DockIcon icon="/icons/Safari.svg" tooltip="Safari" />
            <DockSeparator />
            <DockIcon icon="/icons/Stasis.svg" tooltip="Stasis" />
          </Dock>
        </div>
      </StageLayer>

      {/* Frame. `sizes` is required: this image's layout width is always
          1454 CSS px, so without it Next emits a 1x/2x srcset that tops out
          well short of what a large display needs at full zoom. */}
      <ProtectedImage
        src="/mockup/mockup.png"
        alt="MacBook running Stasis"
        width={1454}
        height={872}
        sizes="(max-width: 767px) 100vw, 200vw"
        loading="eager"
        fetchPriority="high"
        className="pointer-events-none absolute inset-0 z-10 h-full w-full [filter:drop-shadow(0_20px_50px_rgb(0_0_0/0.45))]"
      />
    </>
  );
}
