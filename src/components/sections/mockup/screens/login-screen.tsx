"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useState, useRef } from "react";
import { ProtectedImage } from "@/components/ui/protected-image";
import { AppleHelloEffectEnglish } from "@/components/ui/apple-hello-effect-english";
import { AppleHelloEffectHindi } from "@/components/ui/apple-hello-effect-hindi";
import { AppleHelloEffectSpanish } from "@/components/ui/apple-hello-effect-spanish";
import { AppleHelloEffectVietnamese } from "@/components/ui/apple-hello-effect-vietnamese";
import { playSound } from "@/lib/sound-engine";
import { click8bitSound } from "@/lib/click-8bit";

interface LoginScreenProps {
  onLogin: () => void;
}

const HELLO_COMPONENTS = [
  AppleHelloEffectEnglish,
  AppleHelloEffectHindi,
  AppleHelloEffectSpanish,
  AppleHelloEffectVietnamese,
];

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const handleAnimationComplete = () => {
    // Wait for a second after the handwriting finishes, then move to the next language
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % HELLO_COMPONENTS.length);
    }, 1500);
  };

  const handleLoginClick = () => {
    playSound(click8bitSound.dataUri);
    onLogin();
  };

  const CurrentHello = HELLO_COMPONENTS[currentIndex];

  return (
    <motion.div
      className="absolute inset-0 z-40 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      {/* Background Image */}
      <ProtectedImage
        src="/mockup/macos-bg.png"
        alt="macOS Background"
        fill
        className="object-cover absolute inset-0 z-0"
      />

      {/* Layer Blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs z-0" />

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col items-center justify-between w-full h-full p-12">
        {/* Top spacer */}
        <div className="flex-1" />

        {/* Hello Effect (Middle) */}
        <div
          ref={ref}
          className="flex-1 flex items-center justify-center min-h-[200px]"
        >
          <AnimatePresence mode="wait">
            {isInView && (
              <CurrentHello
                key={currentIndex}
                className="h-12 md:h-20 text-white"
                onAnimationComplete={handleAnimationComplete}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Button */}
        <div className="flex-1 flex items-end justify-center pb-2">
          <motion.button
            onClick={handleLoginClick}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-white/10 backdrop-blur-lg border border-white/20 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.2)] cursor-pointer"
          >
            Get Started
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
