"use client";

import { ProtectedImage } from "@/components/ui/protected-image";

export function StaticMockup() {
  return (
    <div className="mt-16 w-full flex justify-center px-4 md:px-12 relative z-10">
      <div className="w-full max-w-6xl relative group">
        {/* Laptop Frame */}
        <ProtectedImage
          src="/mockup/mockup.png"
          alt="MacBook Space Black Mockup"
          width={1454}
          height={872}
          priority
          className="w-full h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.50)] relative z-10 pointer-events-none"
        />

        {/* Static Screen Area (-ve z-axis to fit behind the frame) */}
        <div
          className="absolute z-0 overflow-hidden"
          style={{
            left: "9.88%", // (1453.8 - 1165) / 2 / 1453.8
            top: "2.25%", // Estimated top bezel
            width: "80.16%", // 1165 / 1453.8
            height: "86.3%", // 753 / 872
          }}
        >
          <ProtectedImage
            src="/mockup/static-screen.png"
            alt="Static Screen Content"
            width={1165}
            height={753}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
