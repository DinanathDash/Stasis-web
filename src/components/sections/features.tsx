"use client";

import { useEffect, useRef } from "react";
import { useObfuscatedMedia } from "@/hooks/use-obfuscated-media";
import { ObfuscatedImage } from "@/components/ui/obfuscated-image";
import { ObfuscatedBackground } from "@/components/ui/obfuscated-background";

function FeatureVideo({ src, className }: { src: string; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const obfuscatedSrc = useObfuscatedMedia(src);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !obfuscatedSrc) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let isPlaying = false;
    let isIntersecting = false;
    let lastTime = performance.now();

    video.defaultMuted = true;
    video.muted = true;

    // The core rendering loop
    const drawFrame = (time: number) => {
      // Draw the video frame to the canvas if we have enough data
      if (video.readyState >= 2) {
        if (canvas.width !== video.videoWidth) canvas.width = video.videoWidth;
        if (canvas.height !== video.videoHeight)
          canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }

      // If native autoplay is blocked, we "scrub" the video manually.
      // Safari allows modifying currentTime without a user gesture.
      if (!isPlaying && video.readyState >= 1 && video.duration > 0) {
        const delta = (time - lastTime) / 1000;
        let nextTime = video.currentTime + delta;
        if (nextTime >= video.duration) nextTime = 0;
        video.currentTime = nextTime;
      }
      lastTime = time;

      rafId = requestAnimationFrame(drawFrame);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isIntersecting = entry.isIntersecting;

          if (entry.isIntersecting) {
            lastTime = performance.now();
            rafId = requestAnimationFrame(drawFrame);
            // Attempt to play natively
            video
              .play()
              .then(() => {
                isPlaying = true;
              })
              .catch(() => {
                isPlaying = false; // Fall back to scrubbing
              });
          } else {
            cancelAnimationFrame(rafId);
            video.pause();
            isPlaying = false;
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(canvas);

    // Global unlocker: the first time the user interacts, we unlock native playback.
    // By calling play() inside a user gesture, Safari removes the playback restrictions.
    const unlock = () => {
      video
        .play()
        .then(() => {
          // If the video is currently off-screen, pause it immediately so it doesn't
          // play silently in the background.
          if (!isIntersecting) {
            video.pause();
            isPlaying = false;
          } else {
            isPlaying = true;
          }
        })
        .catch(() => {});
    };

    window.addEventListener("mousedown", unlock, { once: true, passive: true });
    window.addEventListener("touchstart", unlock, {
      once: true,
      passive: true,
    });
    window.addEventListener("keydown", unlock, { once: true, passive: true });

    return () => {
      observer.unobserve(canvas);
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousedown", unlock);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [obfuscatedSrc]);

  return (
    <div className={`relative ${className}`}>
      {/* Hidden video acts purely as a texture source. Since it's invisible, Safari's play button is never seen. */}
      {/* Conditionally render video only when obfuscatedSrc is ready to prevent empty src requests */}
      {obfuscatedSrc && (
        <video
          ref={videoRef}
          src={obfuscatedSrc}
          muted
          loop
          playsInline
          preload="auto"
          className="absolute w-0 h-0 opacity-0 pointer-events-none"
        />
      )}
      {/* The visible canvas playing the video */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover rounded-2xl shadow-2xl ring-1 ring-white/10 dark:ring-white/20"
        style={{
          WebkitMaskImage: "-webkit-radial-gradient(white, black)",
          WebkitBackfaceVisibility: "hidden",
          MozBackfaceVisibility: "hidden",
          transform: "translateZ(0)",
        }}
      />
    </div>
  );
}

export function Features() {
  const features = [
    {
      title: "Power Flow Diagram",
      description:
        "Dynamic Sankey visualization mapping real-time power distribution between your charger, battery, and system.",
      placeholder: (
        <div className="relative flex items-center justify-center w-full h-full">
          <FeatureVideo
            src="/features/power-flow1.mov"
            className="w-[90%] max-w-[932px] mx-auto rounded-2xl pointer-events-none select-none"
          />
        </div>
      ),
    },
    {
      title: "Dynamic Island HUD",
      description:
        "Sleek hardware notch overlay providing animated status pills for charging state changes and power alerts.",
      placeholder: (
        <div className="relative flex items-center justify-center w-full h-full">
          <FeatureVideo
            src="/features/notch-hud.mp4"
            className="w-[90%] max-w-[932px] mx-auto rounded-2xl pointer-events-none select-none"
          />
        </div>
      ),
    },
    {
      title: "High Energy App Detection",
      description:
        "Instantly identify apps draining your battery. Get real-time alerts when background processes consume excessive power.",
      placeholder: (
        <div className="relative flex items-center justify-center w-full h-full">
          <ObfuscatedImage
            src="/features/energy.png"
            alt="High Energy App Detection"
            width={1920}
            height={1080}
            className="w-[90%] h-auto max-w-[932px] mx-auto object-cover rounded-2xl shadow-2xl ring-1 ring-white/10 dark:ring-white/20 pointer-events-none select-none"
            style={{
              WebkitMaskImage: "-webkit-radial-gradient(white, black)",
              WebkitBackfaceVisibility: "hidden",
              MozBackfaceVisibility: "hidden",
              transform: "translateZ(0)",
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <div className="max-w-2xl text-center mx-auto">
          <h2 className="text-4xl font-medium tracking-tight mb-4 text-foreground">
            Features
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover how Stasis helps you monitor metrics, set charge limits,
            and extend your battery lifespan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-card text-card-foreground rounded-[2rem] p-4 shadow-sm border border-border/50"
            >
              {/* Image Container with dynamic background */}
              <ObfuscatedBackground
                src="/cutting-mat.png"
                className="bg-cover bg-center bg-no-repeat rounded-[1.5rem] aspect-[4/3] mb-6 relative overflow-hidden border border-border/30"
              >
                {feature.placeholder}
              </ObfuscatedBackground>

              {/* Text & Toggle Container */}
              <div className="px-2">
                <div className="mb-3">
                  <h3 className="text-xl font-bold text-foreground">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
