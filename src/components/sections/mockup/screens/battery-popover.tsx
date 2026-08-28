"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown } from "lucide-react";
import { ProtectedImage } from "@/components/ui/protected-image";
import { useState, useRef, useEffect } from "react";

interface BatteryPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BatteryPopover({ isOpen, onClose }: BatteryPopoverProps) {
  const [isAppsExpanded, setIsAppsExpanded] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        !target.closest("#battery-trigger")
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={popoverRef}
          initial={{ opacity: 0, y: -10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.96 }}
          transition={{ duration: 0.1, ease: "easeOut" }}
          className="absolute top-full mt-2 right-0 w-[240px] bg-white/70 backdrop-blur-3xl border border-white/50 rounded-[12px] shadow-[0_20px_40px_rgba(0,0,0,0.15)] text-[10px] font-medium text-black/90 flex flex-col overflow-hidden origin-top-right z-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-black/5">
            <span className="font-semibold text-[11px]">Battery</span>
            <span className="font-semibold text-[11px] tabular-nums">78%</span>
          </div>

          {/* Section 1 */}
          <div className="flex flex-col gap-1 px-3 py-2 border-b border-black/5">
            <div className="flex items-center justify-between">
              <span className="text-black/50">Power Source</span>
              <span>Battery</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-black/50">Uptime</span>
              <span>4d 23h 52m</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-black/50">Battery Mode</span>
              <span>Charging</span>
            </div>
          </div>

          {/* Section 2 */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-black/5">
            <span className="text-black/50">Session Energy</span>
            <span>1.01 Wh</span>
          </div>

          {/* Section 3: Sankey Diagram */}
          <div className="px-3 py-2 border-b border-black/5 flex justify-center">
            <div className="relative w-full h-[85px] sm:h-[95px] scale-130">
              <ProtectedImage
                src="/mockup/power-sankey.svg"
                alt="Power Sankey"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Section 4 */}
          <div className="flex flex-col gap-1 px-3 py-2 border-b border-black/5">
            <div className="flex items-center justify-between">
              <span className="text-black/50">Cycle Count</span>
              <span>111</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-black/50">Battery Health</span>
              <span>99%</span>
            </div>
          </div>

          {/* Section 5 */}
          <div className="px-1.5 py-1 border-b border-black/5">
            <button
              className="w-full flex items-center justify-between px-1.5 py-1 rounded hover:bg-black/5 transition-colors cursor-pointer text-left"
              onClick={() => setIsAppsExpanded(!isAppsExpanded)}
            >
              <span className="text-black/60">Significant Energy Apps</span>
              {isAppsExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-black/30" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-black/30" />
              )}
            </button>

            <AnimatePresence>
              {isAppsExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformOrigin: "top" }}
                  className="flex flex-col gap-0.5 mt-1 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-1.5 py-1">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 relative flex items-center justify-center">
                        <ProtectedImage
                          src="/icons/Safari.svg"
                          alt="Safari"
                          fill
                          className="object-contain"
                          priority
                        />
                      </div>
                      <span>Safari</span>
                    </div>
                    <span className="text-orange-500 font-medium tabular-nums">
                      14.4
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-1.5 py-1">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 relative flex items-center justify-center">
                        <ProtectedImage
                          src="/icons/Photos.svg"
                          alt="Photos"
                          fill
                          className="object-contain"
                          priority
                        />
                      </div>
                      <span>Photos</span>
                    </div>
                    <span className="text-blue-500 font-medium tabular-nums">
                      4.4
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-1.5 py-1">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 relative flex items-center justify-center">
                        <ProtectedImage
                          src="/icons/Notes.svg"
                          alt="Notes"
                          fill
                          className="object-contain"
                          priority
                        />
                      </div>
                      <span>Notes</span>
                    </div>
                    <span className="text-blue-500 font-medium tabular-nums">
                      3.4
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Section 6 */}
          <div className="p-1.5 flex flex-col">
            <button className="w-full flex items-center justify-between px-1.5 py-1 rounded hover:bg-black/5 transition-colors cursor-pointer text-left">
              <span>Settings</span>
              <span className="text-black/40 text-[9px] tracking-widest font-mono">
                ⌘ ,
              </span>
            </button>
            <button className="w-full flex items-center justify-between px-1.5 py-1 rounded hover:bg-black/5 transition-colors cursor-pointer text-left">
              <span>Quit</span>
              <span className="text-black/40 text-[9px] tracking-widest font-mono">
                ⌘ Q
              </span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
