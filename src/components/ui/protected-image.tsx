import Image, { ImageProps } from "next/image";

export function ProtectedImage({
  src,
  alt,
  sizes,
  ...props
}: ImageProps & { src: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      draggable={false}
      onContextMenu={(e) => e.preventDefault()}
      style={{ userSelect: "none", pointerEvents: "none", ...props.style }}
      sizes={sizes || (props.fill ? "100vw" : undefined)}
      {...props}
    />
  );
}
