"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Puzzle, Book, History } from "lucide-react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initialize on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full flex justify-center transition-all duration-300">
      <div
        className={cn(
          "flex items-center justify-between transition-all duration-300 w-full",
          isScrolled
            ? "max-w-5xl mt-4 mx-4 rounded-2xl border border-border bg-background ring-4 ring-muted shadow-xl py-3 px-6 md:px-8"
            : "max-w-full rounded-none border-transparent bg-transparent py-6 px-6 md:px-12",
        )}
      >
        <Link
          href="/"
          className="flex items-center gap-3 text-lg font-semibold tracking-tight px-3 py-1 -mx-3 -my-2 rounded-xl hover:bg-foreground/10 transition-all"
        >
          <Image src="/favicon.png" alt="Stasis Logo" width={32} height={32} />
          Stasis
        </Link>
        <div className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Link
            href="/#features"
            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-foreground/10 hover:text-foreground transition-all"
          >
            <Puzzle className="h-4 w-4" />
            Features
          </Link>
          <a
            href="https://github.com/DinanathDash/Stasis/wiki"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-foreground/10 hover:text-foreground transition-all"
          >
            <Book className="h-4 w-4" />
            Documentation
          </a>
          <Link
            href="/changelog"
            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-foreground/10 hover:text-foreground transition-all"
          >
            <History className="h-4 w-4" />
            Changelog
          </Link>
        </div>
      </div>
    </header>
  );
}
