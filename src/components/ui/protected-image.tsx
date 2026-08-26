import Image, { ImageProps } from "next/image";

export function ProtectedImage({
  src,
  alt,
  ...props
}: ImageProps & { src: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      draggable={false}
      onContextMenu={(e) => e.preventDefault()}
      style={{ userSelect: "none", pointerEvents: "none", ...props.style }}
      {...props}
    />
  );
}
