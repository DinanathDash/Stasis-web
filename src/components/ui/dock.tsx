"use client";

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { Children, cloneElement, ReactElement, ReactNode, useRef, useState } from "react";
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
  let mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "flex h-[56px] items-end gap-2 rounded-2xl border border-white/20 bg-white/20 backdrop-blur-2xl px-3 pb-2 shadow-2xl",
        className
      )}
    >
      {Children.map(children, (child) => {
        if (child) {
          return cloneElement(child as ReactElement, { mouseX });
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
  mouseX?: any;
  icon?: string;
  tooltip: string;
  children?: ReactNode;
  className?: string;
}) {
  let ref = useRef<HTMLDivElement>(null);

  let distance = useTransform(mouseX, (val: number) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Base size 40, max size 64, range 150px
  let widthSync = useTransform(distance, [-150, 0, 150], [40, 64, 40]);
  let width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex justify-center"
    >
      <div
        className={cn(
          "w-full aspect-square rounded-[14px] cursor-pointer flex items-center justify-center overflow-hidden border border-white/10 bg-transparent",
          className
        )}
      >
        {icon ? (
          <img src={icon} alt={tooltip} className="w-full h-full object-cover" />
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
            className="absolute -top-[34px] px-2.5 py-1 bg-[#1e1e1e] text-[#f5f5f5] text-[10px] font-medium tracking-wide rounded-[5px] whitespace-nowrap border border-white/10 shadow-xl z-50 pointer-events-none"
          >
            {tooltip}
            <div className="absolute -bottom-[4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1e1e1e] border-b border-r border-white/10 rotate-45 rounded-[1px] -z-10"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function DockSeparator() {
  return <div className="w-[1px] h-10 mx-1 bg-white/30 rounded-full shrink-0" />;
}
