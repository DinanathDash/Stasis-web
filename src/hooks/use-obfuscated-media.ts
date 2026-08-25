import { useEffect, useState } from "react";

export function useObfuscatedMedia(url: string) {
  const [blobUrl, setBlobUrl] = useState<string>("");

  useEffect(() => {
    if (!url) return;
    let objectUrl = "";
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        setBlobUrl(objectUrl);
      })
      .catch(console.error);

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [url]);

  return blobUrl;
}
