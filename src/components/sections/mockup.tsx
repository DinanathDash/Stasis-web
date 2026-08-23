import Image from "next/image";

export function Mockup() {
  return (
    <div className="mt-16 w-full flex justify-center px-4 md:px-12 relative z-10">
      <div className="w-full max-w-6xl relative group">
        <Image
          src="/SpaceBlack.png"
          alt="MacBook Space Black Mockup"
          width={2400}
          height={1600}
          priority
          className="w-full h-auto drop-shadow-2xl"
        />
        {/* We will overlay the menu bar UI on top of this image later */}
      </div>
    </div>
  );
}
