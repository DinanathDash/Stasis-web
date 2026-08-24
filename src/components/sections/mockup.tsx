"use client";

import Image from "next/image";
import { Dock, DockIcon, DockSeparator } from "@/components/ui/dock";
import { Wifi, Search, Settings2, Battery } from "lucide-react";

export function Mockup() {
  return (
    <div className="mt-16 w-full flex justify-center px-4 md:px-12 relative z-10">
      <div className="w-full max-w-6xl relative group">
        <Image
          src="/mockup.png"
          alt="MacBook Space Black Mockup"
          width={2048}
          height={1236}
          priority
          className="w-full h-auto drop-shadow-2xl relative z-10 pointer-events-none"
        />

        {/* Screen Canvas Area */}
        <div
          className="absolute z-20 overflow-hidden"
          style={{
            left: "10.2417%",
            top: "2.4692%",
            width: "79.5171%",
            height: "85.4912%",
            borderRadius: "1.4%", // Approximate border radius for the screen corners
          }}
        >
          {/* Top Menu Bar Area */}
          <div className="w-full h-[3.2%] flex items-center justify-between px-3 md:px-5 text-[6px] sm:text-[7px] md:text-[9px] font-medium text-white relative z-10 bg-black/20 pt-0.5 leading-none">
            {/* Left Items */}
            <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4 h-full">
              {/* Apple Logo SVG */}
              <svg
                viewBox="0 0 384 512"
                className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-2.5 md:w-2.5 fill-white "
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.1-44.6-35.9-2.8-74.3 22.7-93.1 22.7-18.9 0-46.5-22.1-77.4-21.5-42.5.8-82.5 24.8-103.8 62.6-43.1 76.6-11 190.5 31.4 252.1 20.8 30.1 44.8 63 76.7 61.8 30.7-1.2 42.4-20 78.4-20 35.9 0 46.5 19.8 78.6 19.3 33.1-.6 53.9-30.8 74.4-61 24.6-36.2 34.6-71.3 35.2-73.2-1.1-.3-73.7-28-76.3-113.4zm-78-181.7c18.2-22.1 30.5-52.9 27.2-83.6-26.1 1.1-58.4 17.5-77.1 39.8-16.7 19.8-31 51.2-27.1 81.3 29.2 2.2 59.2-16.4 77-37.5z" />
              </svg>
              <span className="font-bold tracking-wide cursor-default">
                Finder
              </span>
              <span className="cursor-default flex items-center">File</span>
              <span className="cursor-default flex items-center">Edit</span>
              <span className="cursor-default flex items-center">View</span>
              <span className="cursor-default hidden sm:flex items-center">
                Go
              </span>
              <span className="cursor-default hidden sm:flex items-center">
                Window
              </span>
              <span className="cursor-default hidden md:flex items-center">
                Help
              </span>
            </div>

            {/* Right Items */}
            <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4 h-full">
              <Battery className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 opacity-80 hidden md:block" />
              <Wifi className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3" />
              <Search className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 hidden sm:block" />
              <Settings2 className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 hidden sm:block" />
              <span className="cursor-default flex items-center">
                Sun 9:55 PM
              </span>
            </div>
          </div>

          {/* Bottom Dock */}
          <div className="absolute bottom-2 sm:bottom-4 w-full flex justify-center pointer-events-none">
            <Dock className="pointer-events-auto">
              {/* Dock Icons */}
              <DockIcon
                icon="/icons/Finder.svg"
                tooltip="Finder"
                className="bg-transparent !border-none !shadow-none"
              />
              <DockIcon
                icon="/icons/Messages.svg"
                tooltip="Messages"
                className="bg-transparent !border-none !shadow-none"
              />
              <DockIcon
                icon="/icons/Photos.svg"
                tooltip="Photos"
                className="bg-transparent !border-none !shadow-none"
              />
              <DockIcon
                icon="/icons/Calendar.svg"
                tooltip="Terminal"
                className="bg-transparent !border-none !shadow-none"
              />
              <DockIcon
                icon="/icons/Notes.svg"
                tooltip="System Settings"
                className="bg-transparent !border-none !shadow-none"
              />
              <DockIcon
                icon="/icons/Safari.svg"
                tooltip="Safari"
                className="bg-transparent !border-none !shadow-none"
              />
              <DockSeparator />

              <DockIcon
                icon="/icons/Stasis.svg"
                tooltip="Stasis"
                className="bg-transparent border-none shadow-none"
              />
            </Dock>
          </div>
        </div>
      </div>
    </div>
  );
}
