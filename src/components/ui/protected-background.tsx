"use client";

import React, { ElementType } from "react";

interface Props extends React.HTMLAttributes<HTMLElement> {
  src: string;
  as?: ElementType;
}

/**
 * An image rendered as a CSS `background-image` rather than an `<img>`, so it
 * cannot be dragged out or saved from the context menu.
 *
 * The cost of that protection is that **this never touches `next/image`**.
 * There is no resizing, no srcset and no `Accept`-header format negotiation —
 * whatever `src` names is exactly what every browser downloads, at full size,
 * in that format. So the file on disk has to already be the right size and the
 * right format, and it is worth checking the box this renders into before
 * pointing it at anything.
 *
 * Use **WebP here, not AVIF.** Nothing can negotiate a fallback for a CSS
 * background, so the format has to be one every visitor can decode, and WebP's
 * floor (Safari 14 / macOS Big Sur) sits two years below AVIF's (Safari 16 /
 * Ventura). Re-encoding this site's four backgrounds both ways, AVIF won by
 * about 10KB in total across all of them — nowhere near enough to buy a
 * narrower floor with. AVIF is still the right choice for anything going
 * through `next/image`, which negotiates per request and can fall back.
 */
export function ProtectedBackground({
  src,
  className,
  as: Component = "div",
  children,
  ...props
}: Props) {
  return (
    <Component
      className={className}
      style={{
        backgroundImage: `url(${src})`,
        ...props.style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
