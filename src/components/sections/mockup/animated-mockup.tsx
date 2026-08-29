"use client";

import { ProtectedImage } from "@/components/ui/protected-image";
import { MainScreen } from "./screens/main-screen";
import { HandwrittenNote } from "@/components/ui/handwritten-note";

/**
 * The mockup itself — note, frame and interactive screen — with no page layout
 * of its own, so `StagedAnimatedMockup` can mount it on the scene's stage.
 *
 * Everything here is authored in CSS px against a 1152px-wide box; the stage
 * reproduces that by scaling the whole subtree rather than rewriting the values
 * inside it.
 *
 * There is no boot sequence: this opens straight on `MainScreen`. The splash
 * and login screens were removed (see git history) along with the `ScreenState`
 * machine and `onLock`, so clicking the Apple menu plays its sound but does not
 * lock.
 */
export function AnimatedMockupBody({
  batteryOpen,
  onBatteryOpenChange,
}: {
  /** Forwarded to MainScreen — see its prop docs. Pass both or neither:
   *  supplying `batteryOpen` puts the popover under the caller's control. */
  batteryOpen?: boolean;
  onBatteryOpenChange?: (open: boolean) => void;
} = {}) {
  return (
    <div className="w-full relative group">
      {/* `data-mockup-note` is the handle the scene fades this out by.
          Shown on phones, where it is the only note and stays put, and from xl
          up, where the scene cross-fades it to the second one. In between the
          machine is panning through a narrow viewport with no room for it. */}
      <div
        data-mockup-note
        className="absolute -top-26 right-14 z-50 block md:hidden xl:block xl:-right-20"
      >
        <HandwrittenNote
          arrowPosition="left"
          side="none"
          arrowOffsetX={0}
          arrowOffsetY={20}
          arrowClassName="[transform:rotate(-60deg)_scaleX(-1)]"
          className="opacity-90 rotate-[-12deg]"
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
        <MainScreen
          batteryOpen={batteryOpen}
          onBatteryOpenChange={onBatteryOpenChange}
        />
      </div>
    </div>
  );
}
