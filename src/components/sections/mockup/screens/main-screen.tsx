"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { siApple } from "simple-icons";
import { Zap } from "lucide-react";
import { ProtectedImage } from "@/components/ui/protected-image";
import { Dock, DockIcon, DockSeparator } from "@/components/ui/dock";
import { BatteryPopover } from "./battery-popover";

interface MainScreenProps {
  /**
   * Whether the battery popover is open. Its presence is the switch between
   * two modes: left out, the screen owns the state; given, the caller does.
   * The scene needs the latter so it can both demonstrate the popover and
   * reset one the reader shut by hand — an earlier version kept a local
   * "viewer has touched this" override, which made it impossible to reopen.
   */
  batteryOpen?: boolean;
  /** Fires for every open and close the screen itself initiates. */
  onBatteryOpenChange?: (open: boolean) => void;
}

export function MainScreen({
  batteryOpen,
  onBatteryOpenChange,
}: MainScreenProps) {
  const [time, setTime] = useState("");
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isBatteryOpen = batteryOpen ?? uncontrolledOpen;

  const setBatteryOpen = (open: boolean) => {
    if (batteryOpen === undefined) setUncontrolledOpen(open);
    onBatteryOpenChange?.(open);
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const day = now.toLocaleDateString("en-US", { weekday: "short" });
      const timeStr = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      setTime(`${day} ${timeStr}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col z-30 overflow-hidden bg-black/5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* AVIF at 3200x1800: the PNG this replaced was 1280x720, narrower than
          this box renders at full zoom, so it was being upscaled. `sizes` is
          explicit because the cutout is ~62vw zoomed and ~64vw at rest — the
          `fill` default of 100vw over-fetched and warned on every request. */}
      <ProtectedImage
        src="/mockup/macos-bg.avif"
        alt="macOS Background"
        fill
        // 923px is what the screen cutout renders at on a phone, where the
        // stage is pinned to a fixed 1:1 scale rather than fitted to the
        // viewport, so it is a constant rather than a fraction of vw.
        sizes="(max-width: 767px) 923px, 65vw"
        className="object-cover absolute inset-0 z-0 pointer-events-none"
      />

      {/* Top left Apple menu. Chrome, not a control — a plain div rather than a
          button, so nothing announces it as interactive or reacts to a hover it
          has no response for. */}
      <div className="absolute top-3 left-3 z-40">
        <div className="w-12 h-8 sm:w-14 sm:h-9 rounded-[8px] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <svg
            viewBox="0 0 24 24"
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white"
          >
            <path d={siApple.path} />
          </svg>
        </div>
      </div>

      {/* Top Right Menu Bar */}
      <div className="absolute top-3 right-3 z-40">
        <div className="h-8 sm:h-9 rounded-[8px] bg-white/10 backdrop-blur-md border border-white/20 flex items-center px-3 sm:px-4 gap-1 sm:gap-2 shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-white relative">
          <div
            id="battery-trigger"
            className="flex items-center gap-1.5 h-full cursor-pointer"
            onClick={() => setBatteryOpen(!isBatteryOpen)}
          >
            <span className="text-[10px] sm:text-xs font-medium tabular-nums flex items-center h-full pt-px">
              78%
            </span>
            <div className="w-4 h-4 sm:w-6 sm:h-6 relative opacity-90 flex items-center justify-center">
              <ProtectedImage
                src="/mockup/battery.svg"
                alt="Battery"
                fill
                className="object-contain"
              />
              <Zap
                className="absolute m-auto w-[6px] h-[6px] sm:w-[14px] sm:h-[14px] text-white fill-black translate-x-[-1px]"
                strokeWidth={1}
              />
            </div>
          </div>
          <div className="w-4 h-4 sm:w-7 sm:h-7 relative opacity-90 flex items-center justify-center">
            <ProtectedImage
              src="/mockup/wifi.svg"
              alt="WiFi"
              fill
              className="object-contain"
            />
          </div>
          <div className="w-4 h-4 sm:w-7 sm:h-7 relative opacity-90 flex items-center justify-center">
            <ProtectedImage
              src="/mockup/control-centre.svg"
              alt="Control Centre"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-[10px] sm:text-sm font-medium tracking-wide min-w-[70px] text-right tabular-nums flex items-center justify-end h-full pt-px">
            {time}
          </span>
        </div>

        {/* Battery Popover */}
        <BatteryPopover
          isOpen={isBatteryOpen}
          onClose={() => setBatteryOpen(false)}
        />
      </div>

      {/* Main Screen App Area - empty for now */}
      <div className="flex-1 relative z-10 pointer-events-none"></div>

      {/* Bottom Dock */}
      <div className="absolute bottom-2 sm:bottom-4 w-full flex justify-center pointer-events-none z-30">
        <Dock className="pointer-events-auto">
          {/* Dock Icons */}
          <DockIcon
            icon="/icons/Finder.svg"
            tooltip="Finder"
            className="bg-transparent !border-none !shadow-none"
          />
          <DockIcon
            icon="/icons/App Store.svg"
            tooltip="App Store"
            className="bg-transparent !border-none !shadow-none"
          />
          <DockIcon
            icon="/icons/Notes.svg"
            tooltip="Notes"
            className="bg-transparent !border-none !shadow-none"
          />
          <DockIcon
            icon="/icons/Music.svg"
            tooltip="Music"
            className="bg-transparent !border-none !shadow-none"
          />
          <DockIcon
            icon="/icons/Safari.svg"
            tooltip="Safari"
            className="bg-transparent !border-none !shadow-none"
          />
          <DockSeparator />
          <DockIcon
            icon="/icons/Stasis.webp"
            tooltip="Stasis"
            className="bg-transparent border-none shadow-none"
          />
        </Dock>
      </div>
    </motion.div>
  );
}
