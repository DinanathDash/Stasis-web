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
 * The cost is that this never touches `next/image`: no resizing, no srcset, no
 * `Accept`-header format negotiation. Whatever `src` names is exactly what every
 * browser downloads, at full size — so the file has to already be the right size
 * and format.
 *
 * Use **WebP here, not AVIF**. Nothing can negotiate a fallback for a CSS
 * background, and WebP's floor (Safari 14) sits two years below AVIF's
 * (Safari 16). Encoding this site's backgrounds both ways, AVIF won by ~10KB in
 * total — not enough to buy a narrower floor with. AVIF is still right for
 * anything going through `next/image`, which negotiates per request.
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
