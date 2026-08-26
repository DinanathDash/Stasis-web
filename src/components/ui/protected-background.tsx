"use client";

import React, { ElementType } from "react";

interface Props extends React.HTMLAttributes<HTMLElement> {
  src: string;
  as?: ElementType;
}

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
