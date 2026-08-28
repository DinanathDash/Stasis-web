import Image from "next/image";
import Link from "next/link";
import { Magnetic } from "@/components/motion/magnetic";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex flex-col items-center justify-center flex-grow min-h-screen w-full overflow-hidden">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <Image
          src="/background.webp"
          alt="404 Background"
          fill
          className="object-cover opacity-60"
          loading="eager"
          fetchPriority="high"
        />
        {/* Gradient overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
        <h1 className="flex justify-center text-[7rem] sm:text-[10rem] md:text-[14rem] lg:text-[20rem] font-black tracking-tighter leading-none text-foreground drop-shadow-xl">
          {"404".split("").map((ch, i) => (
            <Magnetic key={i} strength={0.6}>
              <span className="inline-block px-1 tabular-nums">{ch}</span>
            </Magnetic>
          ))}
        </h1>
        <div className="space-y-4 mt-8 sm:mt-12">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground">
            Lost in the void
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-lg mx-auto">
            We couldn&apos;t find the page you were looking for. It might have
            been moved, renamed, or doesn&apos;t exist.
          </p>
        </div>
        <Button
          asChild
          size="lg"
          className="group relative overflow-hidden mt-12 rounded-2xl px-8 h-14 text-base font-semibold shadow-lg transition-all duration-300 hover:bg-foreground"
        >
          <Link href="/" className="flex items-center justify-center">
            <div className="flex items-center justify-start w-7 mr-2 opacity-100 transition-all duration-500 ease-out group-hover:w-0 group-hover:mr-0 group-hover:opacity-0 group-hover:scale-50 shrink-0">
              <Home className="!h-5 !w-5 shrink-0" />
            </div>
            <span className="whitespace-nowrap relative z-10">Return Home</span>
            <div className="flex items-center justify-end w-0 opacity-0 transition-all duration-500 ease-out group-hover:w-7 group-hover:ml-2 group-hover:opacity-100 shrink-0">
              <ArrowRight className="!h-6 !w-6 shrink-0 -translate-x-4 scale-50 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:scale-100" />
            </div>
          </Link>
        </Button>
      </div>
    </main>
  );
}
