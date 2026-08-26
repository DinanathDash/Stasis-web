"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  MotionValue,
} from "framer-motion";
import {
  Children,
  cloneElement,
  ReactElement,
  ReactNode,
  useRef,
  useState,
} from "react";
import { ProtectedImage } from "@/components/ui/protected-image";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function Dock({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "flex h-[60px] items-end gap-2 rounded-2xl border border-white/20 bg-white/20 backdrop-blur-2xl px-3 py-2 shadow-2xl",
        className,
      )}
    >
      {Children.map(children, (child) => {
        if (child) {
          return cloneElement(
            child as ReactElement<{ mouseX: MotionValue<number> }>,
            { mouseX },
          );
        }
        return child;
      })}
    </motion.div>
  );
}

export function DockIcon({
  mouseX,
  icon,
  tooltip,
  children,
  className,
}: {
  mouseX?: MotionValue<number>;
  icon?: string;
  tooltip: string;
  children?: ReactNode;
  className?: string;
}) {
  const defaultMouseX = useMotionValue(Infinity);
  const activeMouseX = mouseX ?? defaultMouseX;
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(activeMouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Base size 40, max size 64, range 150px
  const widthSync = useTransform(distance, [-150, 0, 150], [40, 64, 40]);
  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 300,
    damping: 20,
  });

  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex items-end justify-center aspect-square shrink-0 will-change-[width]"
      style={{ width, WebkitTransform: "translateZ(0)" }}
    >
      <div
        className={cn(
          "w-full h-full rounded-[10px] cursor-pointer flex items-center justify-center overflow-hidden border border-white/10 bg-transparent will-change-transform",
          className,
        )}
      >
        {icon ? (
          <ProtectedImage
            src={icon}
            alt={tooltip}
            width={64}
            height={64}
            className="w-full h-full object-cover"
            unoptimized
          />
        ) : (
          children
        )}
      </div>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 2, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="absolute -top-[38px] px-3 py-1 bg-[#1a1a1a]/90 text-white text-[12px] tracking-wide rounded-full whitespace-nowrap border border-white/10 shadow-2xl z-50 pointer-events-none"
          >
            {tooltip}
            <div className="absolute -bottom-[4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1a1a1a]/80 border-b border-r border-white/10 rotate-45 rounded-[1px] -z-10"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function DockSeparator() {
  return (
    <div className="w-[2px] h-10 mx-1 bg-white/30 rounded-full shrink-0" />
  );
}
