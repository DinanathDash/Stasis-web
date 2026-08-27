"use client";

import { ProtectedImage } from "@/components/ui/protected-image";
import { MainScreen } from "./screens/main-screen";
import { HandwrittenNote } from "@/components/ui/handwritten-note";

/**
 * The mockup itself — note, frame and the interactive screen — with no page
 * layout of its own.
 *
 * Split out from `AnimatedMockup` so the same markup can be mounted two ways:
 * directly in the page flow (below), or on the scroll scene's design-unit
 * stage via `StagedAnimatedMockup`. Everything in here is authored in CSS px
 * against a 1152px-wide box; the stage reproduces that by scaling the whole
 * subtree rather than rewriting the values inside it.
 *
 * The boot sequence is currently switched off: this opens straight on
 * `MainScreen` rather than running splash -> login -> main. `startup-screen`
 * and `login-screen` are still in ./screens if we want them back — restore
 * them by reinstating the `ScreenState` machine and passing `onLock` to
 * MainScreen. Without `onLock`, clicking the Apple menu still plays its sound
 * but no longer locks.
 */
export function AnimatedMockupBody() {
  return (
    <div className="w-full relative group">
      {/* Handwritten Note pointing to the screen */}
      <div className="absolute -top-26 right-4 md:-right-20 z-50 hidden md:block">
        <HandwrittenNote
          arrowPosition="left"
          side="none"
          arrowOffsetX={0}
          arrowOffsetY={20}
          arrowClassName="[transform:rotate(-60deg)_scaleX(-1)]"
          className="text-white opacity-90 rotate-[-12deg]"
        >
          psst.... its interactive!
        </HandwrittenNote>
      </div>

      {/* Laptop Frame */}
      <ProtectedImage
        src="/mockup/mockup.png"
        alt="MacBook Space Black Mockup"
        width={1454}
        height={872}
        sizes="(max-width: 767px) 100vw, 200vw"
        loading="eager"
        fetchPriority="high"
        className="w-full h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.50)] relative z-10 pointer-events-none"
      />

      {/* Interactive Screen Area (-ve z-axis to fit behind the frame) */}
      <div
        className="absolute overflow-hidden bg-black"
        style={{
          left: "9.88%",
          top: "2.25%",
          width: "80.16%",
          height: "86.3%",
          zIndex: 0,
        }}
      >
        <MainScreen />
      </div>
    </div>
  );
}

/** The mockup as a standalone page section, sized by the viewport. */
export function AnimatedMockup() {
  return (
    <div className="mt-24 w-full flex justify-center px-4 md:px-12 relative z-10 select-none">
      <div className="w-full max-w-6xl">
        <AnimatedMockupBody />
      </div>
    </div>
  );
}
