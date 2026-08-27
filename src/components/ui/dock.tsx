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
import { cn } from "@/lib/utils";
import { useStageScale } from "@/components/sections/mockup/stage-context";
import { DOCK } from "@/components/sections/mockup/stage-geometry";

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
        "flex items-end border border-white/20 bg-white/20 shadow-2xl backdrop-blur-2xl",
        className,
      )}
      style={{
        height: DOCK.H,
        gap: DOCK.GAP,
        borderRadius: DOCK.RADIUS,
        paddingInline: DOCK.PAD_X,
        paddingBlock: DOCK.PAD_Y,
      }}
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
  const stageScale = useStageScale();

  /**
   * Two coordinate spaces meet here, and only one of them needs converting.
   *
   * `clientX` and `getBoundingClientRect()` are both post-transform viewport
   * px, so the raw distance shrinks and grows with the stage's scale — while
   * MAG_RANGE is authored in design units. Left unconverted, the
   * magnification field narrows as the mockup grows (only the hovered icon
   * reacts) and widens as it shrinks (every icon lifts at once). Divide.
   *
   * The width range below is the opposite case and must NOT be divided: it is
   * set as CSS `width`, which already lives in the local design space that the
   * stage transform then scales.
   */
  const distance = useTransform(activeMouseX, (val: number) => {
    const el = ref.current;
    if (!el) return Infinity;
    const bounds = el.getBoundingClientRect();
    return (val - bounds.x - bounds.width / 2) / (stageScale.current || 1);
  });

  const widthSync = useTransform(
    distance,
    [-DOCK.MAG_RANGE, 0, DOCK.MAG_RANGE],
    // Annotated because DOCK is `as const`, which would otherwise infer the
    // output range as the literal union `46 | 74`.
    [DOCK.ICON_BASE, DOCK.ICON_MAX, DOCK.ICON_BASE] as number[],
  );
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
      className="relative flex aspect-square shrink-0 items-end justify-center will-change-[width]"
      style={{ width, WebkitTransform: "translateZ(0)" }}
    >
      <div
        className={cn(
          "flex h-full w-full cursor-pointer items-center justify-center overflow-hidden bg-transparent will-change-transform",
          className,
        )}
        style={{ borderRadius: DOCK.ICON_RADIUS }}
      >
        {icon ? (
          <ProtectedImage
            src={icon}
            alt={tooltip}
            width={64}
            height={64}
            className="h-full w-full object-cover"
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
            className="pointer-events-none absolute z-50 whitespace-nowrap rounded-full border border-white/10 bg-[#1a1a1a]/90 tracking-wide text-white shadow-2xl"
            style={{
              top: -DOCK.TOOLTIP_OFFSET,
              fontSize: DOCK.TOOLTIP_TEXT,
              paddingInline: DOCK.PAD_X,
              paddingBlock: DOCK.PAD_Y / 2,
            }}
          >
            {tooltip}
            <div className="absolute -bottom-[4px] left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45 rounded-[1px] border-b border-r border-white/10 bg-[#1a1a1a]/80"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function DockSeparator() {
  return (
    <div
      className="shrink-0 rounded-full bg-white/30"
      style={{
        width: DOCK.SEP_W,
        height: DOCK.SEP_H,
        marginInline: DOCK.SEP_MX,
      }}
    />
  );
}
