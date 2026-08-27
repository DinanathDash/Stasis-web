import Image, { ImageProps } from "next/image";

/**
 * `next/image` with drag, context-menu and text selection suppressed.
 *
 * `style` is destructured out of the rest-spread and re-applied last —
 * previously the spread still carried `style`, so any caller passing one
 * silently dropped the userSelect/pointerEvents defaults this component
 * exists to set.
 *
 * Pass `interactive` for an image that must receive pointer events (a
 * clickable icon inside the mockup, say); it omits `pointer-events: none`
 * while keeping the rest of the protection.
 */
export function ProtectedImage({
  src,
  alt,
  sizes,
  style,
  fill,
  interactive,
  ...rest
}: ImageProps & { src: string; interactive?: boolean }) {
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      draggable={false}
      onContextMenu={(e) => e.preventDefault()}
      sizes={sizes ?? (fill ? "100vw" : undefined)}
      {...rest}
      style={{
        userSelect: "none",
        ...(interactive ? {} : { pointerEvents: "none" }),
        ...style,
      }}
    />
  );
}
