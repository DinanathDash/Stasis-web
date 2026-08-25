"use client";

import { useEffect, useRef } from "react";
import { useObfuscatedMedia } from "@/hooks/use-obfuscated-media";
import { ObfuscatedImage } from "@/components/ui/obfuscated-image";
import { ObfuscatedBackground } from "@/components/ui/obfuscated-background";

import {
  Anchor,
  BatteryWarning,
  Flame,
  Gauge,
  Usb,
  Globe,
  Cpu,
  Droplets,
  Battery,
  Activity,
} from "lucide-react";

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
        className="w-full h-full object-cover rounded-2xl shadow-2xl ring-1 ring-white/10"
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

const OTHER_FEATURES = [
  {
    label: (
      <div className="flex items-center justify-center w-full h-10 gap-3">
        <Anchor className="w-5 h-5 shrink-0 text-primary" />
        <span className="truncate font-medium">Sailing Mode</span>
      </div>
    ),
    value: "1",
  },
  {
    label: (
      <div className="flex items-center justify-center w-full h-10 gap-3">
        <BatteryWarning className="w-5 h-5 shrink-0 text-destructive" />
        <span className="truncate font-medium">Force Discharge</span>
      </div>
    ),
    value: "2",
  },
  {
    label: (
      <div className="flex items-center justify-center w-full h-10 gap-3">
        <Flame className="w-5 h-5 shrink-0 text-orange-500" />
        <span className="truncate font-medium">Heat Protection</span>
      </div>
    ),
    value: "3",
  },
  {
    label: (
      <div className="flex items-center justify-center w-full h-10 gap-3">
        <Gauge className="w-5 h-5 shrink-0 text-blue-500" />
        <span className="truncate font-medium">Battery Calibration</span>
      </div>
    ),
    value: "4",
  },
  {
    label: (
      <div className="flex items-center justify-center w-full h-10 gap-3">
        <Usb className="w-5 h-5 shrink-0 text-zinc-500" />
        <span className="truncate font-medium">Multi-Port Detection</span>
      </div>
    ),
    value: "5",
  },
  {
    label: (
      <div className="flex items-center justify-center w-full h-10 gap-3">
        <Globe className="w-5 h-5 shrink-0 text-green-500" />
        <span className="truncate font-medium">Multi-Language</span>
      </div>
    ),
    value: "6",
  },
  {
    label: (
      <div className="flex items-center justify-center w-full h-10 gap-3">
        <Cpu className="w-5 h-5 shrink-0 text-purple-500" />
        <span className="truncate font-medium">Helper Daemon</span>
      </div>
    ),
    value: "7",
  },
  {
    label: (
      <div className="flex items-center justify-center w-full h-10 gap-3">
        <Droplets className="w-5 h-5 shrink-0 text-cyan-500" />
        <span className="truncate font-medium">Liquid Glass UI</span>
      </div>
    ),
    value: "8",
  },
  {
    label: (
      <div className="flex items-center justify-center w-full h-10 gap-3">
        <Battery className="w-5 h-5 shrink-0 text-emerald-500" />
        <span className="truncate font-medium">Hardware Charge Limit</span>
      </div>
    ),
    value: "9",
  },
  {
    label: (
      <div className="flex items-center justify-center w-full h-10 gap-3">
        <Activity className="w-5 h-5 shrink-0 text-pink-500" />
        <span className="truncate font-medium">Live Power Dashboard</span>
      </div>
    ),
    value: "10",
  },
];

function AutoScrollWheel() {
  const scrollList = [...OTHER_FEATURES, ...OTHER_FEATURES];

  return (
    <div className="relative flex flex-col items-center justify-center w-[90%] h-[78%] max-w-[932px] aspect-video mx-auto rounded-2xl shadow-2xl ring-1 ring-white/10 bg-background/80 backdrop-blur-sm z-10">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes verticalMarquee {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .animate-vertical-marquee {
          animation: verticalMarquee 15s linear infinite;
        }
      `,
        }}
      />

      {/* Outer Wheel Container */}
      <div
        className="relative w-[90%] max-w-md h-[180px] overflow-hidden shrink-0"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
        }}
      >
        {/* Base Faded List */}
        <div className="absolute top-0 left-0 right-0 flex flex-col animate-vertical-marquee">
          {scrollList.map((item, idx) => (
            <div
              key={`base-${idx}`}
              className="flex items-center justify-center w-full h-10 text-muted-foreground opacity-30"
            >
              {item.label}
            </div>
          ))}
        </div>

        {/* Highlight Center Background Overlay */}
        <div className="absolute top-1/2 left-0 right-0 h-10 -translate-y-1/2 bg-foreground/10 border-y border-border/50 backdrop-blur-md rounded-md z-10 pointer-events-none" />

        {/* Static Clipping Wrapper for Highlight Text */}
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            clipPath: "inset(calc(50% - 20px) 0 calc(50% - 20px) 0)",
            WebkitClipPath: "inset(calc(50% - 20px) 0 calc(50% - 20px) 0)",
          }}
        >
          {/* Inner Highlight List (Perfectly synced) */}
          <div className="absolute top-0 left-0 right-0 flex flex-col animate-vertical-marquee">
            {scrollList.map((item, idx) => (
              <div
                key={`highlight-${idx}`}
                className="flex items-center justify-center w-full h-10 text-foreground font-medium drop-shadow-md"
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
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
            src="/features/power-flow.mov"
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
            className="w-[90%] h-auto max-w-[932px] mx-auto object-cover rounded-2xl shadow-2xl ring-1 ring-white/10 pointer-events-none select-none"
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
      title: "MagSafe Integration",
      description:
        "Smartly manage your MagSafe charging state to optimize for battery health and reduce thermal throttling.",
      placeholder: (
        <div className="relative flex items-center justify-center w-full h-full">
          <ObfuscatedImage
            src="/features/magsafe.jpg"
            alt="MagSafe Integration"
            width={1920}
            height={1080}
            className="w-[90%] h-auto max-w-[932px] mx-auto object-cover rounded-2xl shadow-2xl ring-1 ring-white/10 pointer-events-none select-none"
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

    {
      title: "App Intents & Spotlight",
      description:
        "Control your Stasis settings instantly through Spotlight search, Siri, or custom Apple Shortcuts.",
      placeholder: (
        <div className="relative flex items-center justify-center w-full h-full">
          <FeatureVideo
            src="/features/spotlight.mov"
            className="w-[90%] max-w-[932px] mx-auto rounded-2xl pointer-events-none select-none"
          />
        </div>
      ),
    },
    {
      title: "And Much More",
      description:
        "Explore a variety of powerful under-the-hood capabilities designed to give you complete control.",
      placeholder: (
        <div className="relative flex items-center justify-center w-full h-full">
          <AutoScrollWheel />
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
                className="bg-cover bg-center bg-no-repeat rounded-[1.5rem] aspect-[4/3] mb-6 relative overflow-hidden"
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
