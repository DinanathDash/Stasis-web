"use client";

import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Minus, Plus } from "lucide-react";
import { ProtectedImage } from "@/components/ui/protected-image";
import { ProtectedBackground } from "@/components/ui/protected-background";

interface DownloadDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DownloadDialog({ isOpen, onClose }: DownloadDialogProps) {
  const [mounted, setMounted] = useState(false);
  const [isHoveringDropZone, setIsHoveringDropZone] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const checkIntersection = (info: PanInfo) => {
    if (!dropZoneRef.current) return false;
    const dropZone = dropZoneRef.current.getBoundingClientRect();
    const { x, y } = info.point;
    return (
      x >= dropZone.left &&
      x <= dropZone.right &&
      y >= dropZone.top &&
      y <= dropZone.bottom
    );
  };

  const handleDrag = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    setIsHoveringDropZone(checkIntersection(info));
  };

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    setIsHoveringDropZone(false);
    if (checkIntersection(info)) {
      // Trigger download
      const link = document.createElement("a");
      link.href =
        "https://github.com/DinanathDash/Stasis/releases/latest/download/Stasis.dmg";
      link.download = "Stasis.dmg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Close the dialog after a slight delay
      setTimeout(() => {
        onClose();
      }, 400);
    }
  };

  const dialogContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-[101] flex flex-col items-center justify-center pointer-events-none p-4 select-none">
            {/* Header Text */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="pointer-events-auto mb-8 text-center text-white"
            >
              <p className="text-base md:text-lg text-white/90 drop-shadow-md font-medium">
                Drag and drop the{" "}
                <ProtectedImage
                  src="/dmg/app-icon.png"
                  alt="Stasis"
                  width={20}
                  height={20}
                  className="inline-block align-text-bottom mx-1 rounded-sm"
                />{" "}
                Stasis app <br className="hidden md:block" />
                into Macintosh HD to download it.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="pointer-events-auto relative w-full max-w-[600px] overflow-hidden rounded-xl bg-background shadow-2xl ring-1 ring-black/5"
            >
              {/* Window Title Bar */}
              <div className="relative flex h-10 items-center bg-[#f6f6f6] px-4 border-b border-black/10 group/titlebar">
                <div className="flex items-center gap-2 z-10">
                  <button
                    onClick={onClose}
                    className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/90 border border-black/10"
                  >
                    <X className="h-2.5 w-2.5 opacity-0 group-hover/titlebar:opacity-100 text-black/60" />
                  </button>
                  <button className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e]/90 border border-black/10">
                    <Minus className="h-2.5 w-2.5 opacity-0 group-hover/titlebar:opacity-100 text-black/60" />
                  </button>
                  <button className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#27c93f] hover:bg-[#27c93f]/90 border border-black/10">
                    <Plus className="h-2.5 w-2.5 opacity-0 group-hover/titlebar:opacity-100 text-black/60" />
                  </button>
                </div>

                {/* Title next to traffic lights */}
                <div className="ml-4 flex items-center gap-2 text-[13px] font-medium text-black/70">
                  <ProtectedImage
                    src="/dmg/app-icon.png"
                    alt="Stasis"
                    width={20}
                    height={20}
                    className="rounded-sm w-auto h-auto"
                  />
                  Stasis
                </div>
              </div>

              {/* Main Content Area */}
              {/* See ProtectedBackground for why these are WebP, not AVIF.
                  2400x1600 / 6.6MB -> 1800x1200 / 215KB, for a box that is at
                  most 600px wide. It matters most here: this element only
                  mounts when the dialog opens, so the download used to start
                  on the click. */}
              <ProtectedBackground
                src="/dmg/dmg-background.webp"
                className="relative h-[440px] md:h-[340px] w-full overflow-hidden bg-[#E7E7E7] bg-cover bg-center"
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent from-40% to-[#FBFAF5]/70 pointer-events-none"></div>

                <div className="-top-4 md:top-0 relative z-10 flex flex-col md:flex-row h-full items-center justify-center gap-4 md:gap-12 px-4 md:px-12 select-none">
                  {/* Stasis App Icon */}
                  <div className="flex flex-col items-center gap-2 md:gap-3 relative z-50">
                    <div className="relative h-24 w-24 md:h-28 md:w-28 rounded-3xl bg-white/10 backdrop-blur-md border border-white/40 shadow-xl shadow-black/5 ring-1 ring-black/5 flex items-center justify-center">
                      <motion.div
                        drag
                        dragSnapToOrigin
                        whileHover={{ scale: 1.05 }}
                        whileDrag={{ scale: 1.1, zIndex: 50 }}
                        dragTransition={{
                          bounceStiffness: 500,
                          bounceDamping: 20,
                        }}
                        onDrag={handleDrag}
                        onDragEnd={handleDragEnd}
                        className="cursor-grab active:cursor-grabbing"
                      >
                        <ProtectedImage
                          src="/dmg/app-icon.png"
                          alt="Stasis"
                          width={100}
                          height={100}
                          className="object-contain p-2 pointer-events-none w-auto h-auto scale-90 md:scale-100"
                        />
                      </motion.div>
                    </div>
                    <span className="text-xs md:text-sm font-medium text-black/80 drop-shadow-sm">
                      Stasis
                    </span>
                  </div>

                  {/* Arrow (Mobile) */}
                  <div className="relative block md:hidden">
                    <ProtectedImage
                      src="/dmg/arrow-vertical.svg"
                      alt="Arrow"
                      width={38}
                      height={38}
                      className="object-contain drop-shadow-xl"
                    />
                  </div>

                  {/* Arrow (Desktop) */}
                  <div className="relative hidden md:block -mt-48">
                    <ProtectedImage
                      src="/dmg/arrow-horizontal.svg"
                      alt="Arrow"
                      width={170}
                      height={170}
                      className="object-contain drop-shadow-xl"
                    />
                  </div>

                  {/* Macintosh HD Drive */}
                  <div className="flex flex-col items-center gap-2 md:gap-3">
                    <div
                      ref={dropZoneRef}
                      className={`relative h-24 w-24 md:h-28 md:w-28 rounded-3xl backdrop-blur-md border shadow-xl shadow-black/5 ring-1 ring-black/5 flex items-center justify-center overflow-hidden transition-all duration-300 ${
                        isHoveringDropZone
                          ? "bg-white/30 border-white/80 scale-105 shadow-2xl"
                          : "bg-white/10 border-white/40"
                      }`}
                    >
                      <ProtectedImage
                        src="/dmg/mac-drive.png"
                        alt="Macintosh HD"
                        width={110}
                        height={110}
                        className="object-contain p-2 drop-shadow-xl w-auto h-auto scale-90 md:scale-100"
                      />
                    </div>
                    <span className="text-xs md:text-sm font-medium text-black/80 drop-shadow-sm">
                      Macintosh HD
                    </span>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-white border-t border-black/10 flex items-center px-4 gap-2">
                  <ProtectedImage
                    src="/dmg/app-icon.png"
                    alt="Stasis"
                    width={18}
                    height={18}
                    className="rounded-[2px] w-auto h-auto"
                  />
                  <span className="text-[11px] font-medium text-black/60">
                    Stasis
                  </span>
                </div>
              </ProtectedBackground>
            </motion.div>

            {/* Footer Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="pointer-events-auto mt-8 text-center text-white/80"
            >
              <p className="text-sm font-medium drop-shadow-sm">
                If you have any issues downloading or{" "}
                <br className="hidden md:block" />
                installing, please{" "}
                <a
                  href="https://github.com/DinanathDash/Stasis/issues/new/choose"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white underline underline-offset-4 hover:text-white/80 transition-colors"
                >
                  contact us
                </a>
                .
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;

  return createPortal(dialogContent, document.body);
}
