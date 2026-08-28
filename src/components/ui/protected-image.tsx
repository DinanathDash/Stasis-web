import Image, { ImageProps } from "next/image";

/**
 * `next/image` with drag, context-menu and text selection suppressed.
 *
 * `style` is destructured out of the rest-spread and re-applied last —
 * otherwise a caller passing one silently drops the defaults this exists to set.
 */
export function ProtectedImage({
  src,
  alt,
  sizes,
  style,
  fill,
  ...rest
}: ImageProps & { src: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      draggable={false}
      onContextMenu={(e) => e.preventDefault()}
      sizes={sizes ?? (fill ? "100vw" : undefined)}
      {...rest}
      style={{ userSelect: "none", pointerEvents: "none", ...style }}
    />
  );
}
