"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Book, History, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siApple } from "simple-icons";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const handleSamePageScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (pathname === href) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

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
          onClick={(e) => handleSamePageScroll(e, "/")}
          className="flex items-center gap-3 text-lg font-semibold tracking-tight px-3 py-1 -mx-3 -my-2 rounded-xl hover:bg-foreground/10 transition-all"
        >
          <Image src="/favicon.png" alt="Stasis Logo" width={32} height={32} />
          Stasis
        </Link>
        <div className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground">
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
            onClick={(e) => handleSamePageScroll(e, "/changelog")}
            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-foreground/10 hover:text-foreground transition-all"
          >
            <History className="h-4 w-4" />
            Changelog
          </Link>
          <Button
            asChild
            className="group relative rounded-xl px-4 ml-2 font-medium shadow-sm transition-all duration-300 bg-foreground text-background hover:bg-foreground"
          >
            <a
              href="https://github.com/DinanathDash/Stasis/releases/latest/download/Stasis.dmg"
              className="flex items-center justify-center"
            >
              <div className="flex items-center justify-start w-4 mr-2 opacity-100 transition-all duration-300 ease-out group-hover:w-0 group-hover:mr-0 group-hover:opacity-0 group-hover:scale-50 shrink-0">
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="!h-4 !w-4 fill-current shrink-0"
                >
                  <path d={siApple.path} />
                </svg>
              </div>
              <span className="whitespace-nowrap relative z-10 text-sm">
                Download for Mac
              </span>
              <div className="flex items-center justify-end w-0 opacity-0 transition-all duration-300 ease-out group-hover:w-4 group-hover:ml-2 group-hover:opacity-100 shrink-0">
                <ArrowRight className="!h-4 !w-4 shrink-0 -translate-x-4 scale-50 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:scale-100" />
              </div>
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
