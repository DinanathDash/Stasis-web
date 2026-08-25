import Image, { ImageProps } from "next/image";
import { useObfuscatedMedia } from "@/hooks/use-obfuscated-media";

export function ObfuscatedImage({
  src,
  alt,
  ...props
}: ImageProps & { src: string }) {
  const obfuscatedSrc = useObfuscatedMedia(src);

  if (!obfuscatedSrc) {
    // Return an empty skeleton while fetching
    return <div className={props.className} style={props.style} />;
  }

  return <Image src={obfuscatedSrc} alt={alt} unoptimized {...props} />;
}
