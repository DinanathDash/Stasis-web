"use client";

import { useEffect, useRef, useState } from "react";
import LineSidebar from "../motion/LineSidebar";

export function ChangelogSidebar({ versions }: { versions: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollLock = useRef(false);
  const scrollLockTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const update = () => {
      if (scrollLock.current) return;
      const offset = 200; // offset for sticky header

      let index = 0;

      // Check if scrolled to bottom of page
      if (
        window.innerHeight + Math.round(window.scrollY) >=
        document.documentElement.scrollHeight - 50
      ) {
        const visible = versions.findLast((version) => {
          const el = document.getElementById(`release-${version}`);
          if (!el) return false;
          const rect = el.getBoundingClientRect();
          return rect.top < window.innerHeight && rect.bottom > 0;
        });
        if (visible) {
          index = versions.indexOf(visible);
        }
      } else {
        const active = versions.findLast((version) => {
          const top = document
            .getElementById(`release-${version}`)
            ?.getBoundingClientRect().top;
          return top !== undefined && top <= offset;
        });
        index = active ? versions.indexOf(active) : 0;
      }

      setActiveIndex(index);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [versions]);

  // Keep active item in view within the sidebar
  useEffect(() => {
    const activeEl = document.querySelector(`li[aria-current="true"]`);
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [activeIndex]);

  return (
    <LineSidebar
      items={versions}
      activeIndex={activeIndex}
      accentColor="hsl(var(--foreground))"
      textColor="hsl(var(--muted-foreground))"
      markerColor="hsl(var(--border))"
      showIndex={false}
      onItemClick={(index, label) => {
        scrollLock.current = true;
        clearTimeout(scrollLockTimer.current);
        scrollLockTimer.current = setTimeout(() => {
          scrollLock.current = false;
        }, 1000);

        setActiveIndex(index);

        const el = document.getElementById(`release-${label}`);
        if (el) {
          const trigger = el.querySelector(
            'button[data-state="closed"]',
          ) as HTMLElement;
          if (trigger) trigger.click();

          setTimeout(() => {
            const y = el.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: "smooth" });
          }, 250);
        }
      }}
    />
  );
}
