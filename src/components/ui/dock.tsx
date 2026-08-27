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

/**
 * Dock sizing, in whatever unit the surrounding mockup is authored in.
 *
 * It is a prop rather than a constant because the mockups disagree: the
 * percentage-based ones size their screen against the viewport, so the dock
 * has to stay in real CSS px, while the design-unit stage authors everything
 * against a fixed 1454px canvas and needs correspondingly larger numbers.
 */
export type DockMetrics = {
  H: number;
  ICON_BASE: number;
  ICON_MAX: number;
  MAG_RANGE: number;
  GAP: number;
  PAD_X: number;
  PAD_Y: number;
  RADIUS: number;
  ICON_RADIUS: number;
  SEP_W: number;
  SEP_H: number;
  SEP_MX: number;
  TOOLTIP_OFFSET: number;
  TOOLTIP_TEXT: number;
};

/** Real CSS px, matching how the dock has always rendered. Default so the
 *  percentage-based mockups are unaffected by the stage's larger tokens. */
export const DOCK_DEFAULT: DockMetrics = {
  H: 60,
  ICON_BASE: 40,
  ICON_MAX: 64,
  MAG_RANGE: 150,
  GAP: 8,
  PAD_X: 12,
  PAD_Y: 8,
  RADIUS: 16,
  ICON_RADIUS: 10,
  SEP_W: 2,
  SEP_H: 40,
  SEP_MX: 4,
  TOOLTIP_OFFSET: 38,
  TOOLTIP_TEXT: 12,
};

export function Dock({
  children,
  className,
  metrics = DOCK_DEFAULT,
}: {
  children: ReactNode;
  className?: string;
  metrics?: DockMetrics;
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
        height: metrics.H,
        gap: metrics.GAP,
        borderRadius: metrics.RADIUS,
        paddingInline: metrics.PAD_X,
        paddingBlock: metrics.PAD_Y,
      }}
    >
      {Children.map(children, (child) => {
        if (child) {
          return cloneElement(
            child as ReactElement<{
              mouseX: MotionValue<number>;
              metrics: DockMetrics;
            }>,
            { mouseX, metrics },
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
  metrics = DOCK_DEFAULT,
}: {
  mouseX?: MotionValue<number>;
  icon?: string;
  tooltip: string;
  children?: ReactNode;
  className?: string;
  metrics?: DockMetrics;
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
   * MAG_RANGE is authored in the mockup's own units. Left unconverted, the
   * magnification field narrows as the mockup grows (only the hovered icon
   * reacts) and widens as it shrinks (every icon lifts at once). Divide.
   *
   * The width range below is the opposite case and must NOT be divided: it is
   * set as CSS `width`, which already lives in the local space that any
   * enclosing transform then scales.
   *
   * Outside a stage `useStageScale` yields a stable 1, so this is a no-op for
   * the percentage-based mockups.
   */
  const distance = useTransform(activeMouseX, (val: number) => {
    const el = ref.current;
    if (!el) return Infinity;
    const bounds = el.getBoundingClientRect();
    return (val - bounds.x - bounds.width / 2) / (stageScale.current || 1);
  });

  const widthSync = useTransform(
    distance,
    [-metrics.MAG_RANGE, 0, metrics.MAG_RANGE],
    [metrics.ICON_BASE, metrics.ICON_MAX, metrics.ICON_BASE],
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
          "flex h-full w-full cursor-pointer items-center justify-center overflow-hidden border border-white/10 bg-transparent will-change-transform",
          className,
        )}
        style={{ borderRadius: metrics.ICON_RADIUS }}
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
              top: -metrics.TOOLTIP_OFFSET,
              fontSize: metrics.TOOLTIP_TEXT,
              paddingInline: metrics.PAD_X,
              paddingBlock: metrics.PAD_Y / 2,
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

export function DockSeparator({
  metrics = DOCK_DEFAULT,
}: {
  metrics?: DockMetrics;
}) {
  return (
    <div
      className="shrink-0 rounded-full bg-white/30"
      style={{
        width: metrics.SEP_W,
        height: metrics.SEP_H,
        marginInline: metrics.SEP_MX,
      }}
    />
  );
}
