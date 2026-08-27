"use client";

import { useState } from "react";
import { ProtectedImage } from "@/components/ui/protected-image";
import { AnimatePresence } from "framer-motion";
import { StartupScreen } from "./screens/startup-screen";
import { LoginScreen } from "./screens/login-screen";
import { MainScreen } from "./screens/main-screen";
import { HandwrittenNote } from "@/components/ui/handwritten-note";

type ScreenState = "splash" | "login" | "main";

export function AnimatedMockup() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>("splash");

  return (
    <div className="mt-24 w-full flex justify-center px-4 md:px-12 relative z-10 select-none">
      <div className="w-full max-w-6xl relative group">
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
          priority
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
          <AnimatePresence mode="wait">
            {currentScreen === "splash" && (
              <StartupScreen
                key="splash"
                onComplete={() => setCurrentScreen("login")}
              />
            )}

            {currentScreen === "login" && (
              <LoginScreen
                key="login"
                onLogin={() => setCurrentScreen("main")}
              />
            )}

            {currentScreen === "main" && (
              <MainScreen key="main" onLock={() => setCurrentScreen("login")} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
