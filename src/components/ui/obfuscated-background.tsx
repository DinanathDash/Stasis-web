"use client";

import { useObfuscatedMedia } from "@/hooks/use-obfuscated-media";
import React, { ElementType } from "react";

interface Props extends React.HTMLAttributes<HTMLElement> {
  src: string;
  as?: ElementType;
}

export function ObfuscatedBackground({
  src,
  className,
  as: Component = "div",
  children,
  ...props
}: Props) {
  const bgUrl = useObfuscatedMedia(src);

  return (
    <Component
      className={className}
      style={{
        backgroundImage: bgUrl ? `url(${bgUrl})` : undefined,
        ...props.style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
