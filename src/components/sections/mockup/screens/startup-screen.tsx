"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { siApple } from "simple-icons";
import { Power } from "lucide-react";

interface StartupScreenProps {
  onComplete: () => void;
}

export function StartupScreen({ onComplete }: StartupScreenProps) {
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (hasStarted) {
      const audio = new Audio("/mockup/macos-startup-sound.mp3");
      audio.play().catch((e) => console.log("Audio playback blocked:", e));

      // Total animation time: 1s wait, 1.5s loading, 0.5s wait, 0.5s fade out -> ~4.5s total
      const timer = setTimeout(() => {
        onComplete();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [hasStarted, onComplete]);

  return (
    <motion.div
      className="absolute inset-0 bg-black flex flex-col items-center justify-center z-50 cursor-pointer"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      onClick={() => {
        if (!hasStarted) setHasStarted(true);
      }}
    >
      {!hasStarted ? (
        <motion.div
          className="flex flex-col items-center gap-4 group"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm mb-2 shadow-inner text-white/40 group-hover:text-white/70 transition-colors">
            <Power className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <span className="text-sm tracking-widest font-medium text-white/40">
            Click to power on
          </span>
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-16 h-16 md:w-20 md:h-20 fill-white"
            >
              <path d={siApple.path} />
            </svg>
          </motion.div>

          <div className="absolute bottom-[12%] w-40 h-1 bg-[#333333] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5, ease: "easeInOut", delay: 1 }}
            />
          </div>
        </>
      )}
    </motion.div>
  );
}
