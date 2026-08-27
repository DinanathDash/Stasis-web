"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { siApple } from "simple-icons";
import { Zap } from "lucide-react";
import { ProtectedImage } from "@/components/ui/protected-image";
import { Dock, DockIcon } from "@/components/ui/dock";
import { BatteryPopover } from "./battery-popover";
import { playSound } from "@/lib/sound-engine";
import { chipLay1Sound } from "@/lib/chip-lay-1";

interface MainScreenProps {
  onLock?: () => void;
}

export function MainScreen({ onLock }: MainScreenProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [time, setTime] = useState("");
  const [isBatteryOpen, setIsBatteryOpen] = useState(false);

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

  const handleAppleClick = () => {
    playSound(chipLay1Sound.dataUri);
    if (onLock) {
      onLock();
    }
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col z-30 overflow-hidden bg-black/5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <ProtectedImage
        src="/mockup/macos-bg.png"
        alt="macOS Background"
        fill
        className="object-cover absolute inset-0 z-0 pointer-events-none"
      />

      {/* Top Left Menu Button */}
      <div className="absolute top-3 left-3 z-40">
        <button
          onClick={handleAppleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="w-12 h-8 sm:w-14 sm:h-9 rounded-[8px] bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative"
        >
          <AnimatePresence mode="wait">
            {isHovered ? (
              <motion.div
                key="lock"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-3.5 h-3.5 sm:w-6 sm:h-6 relative">
                  <ProtectedImage
                    src="/mockup/apple-lock.svg"
                    alt="Apple lock"
                    fill
                    className="object-contain"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="apple"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white"
                >
                  <path d={siApple.path} />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Top Right Menu Bar */}
      <div className="absolute top-3 right-3 z-40">
        <div className="h-8 sm:h-9 rounded-[8px] bg-white/10 backdrop-blur-md border border-white/20 flex items-center px-3 sm:px-4 gap-1 sm:gap-2 shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-white relative">
          <div
            id="battery-trigger"
            className="flex items-center gap-1.5 h-full cursor-pointer"
            onClick={() => setIsBatteryOpen(!isBatteryOpen)}
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
          onClose={() => setIsBatteryOpen(false)}
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
            icon="/icons/Notes.svg"
            tooltip="Notes"
            className="bg-transparent !border-none !shadow-none"
          />
          <DockIcon
            icon="/icons/Safari.svg"
            tooltip="Safari"
            className="bg-transparent !border-none !shadow-none"
          />
          <DockIcon
            icon="/icons/Stasis.svg"
            tooltip="Stasis"
            className="bg-transparent border-none shadow-none"
          />
        </Dock>
      </div>
    </motion.div>
  );
}
