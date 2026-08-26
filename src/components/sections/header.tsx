"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Book, History, ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siApple } from "simple-icons";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      {/* Placeholder to keep layout space while motion.div is absolute */}
      <div
        className={cn(
          "w-full opacity-0 pointer-events-none transition-all duration-300",
          isScrolled ? "mt-4 p-4 md:py-3" : "py-4",
        )}
      >
        <div className="h-8 w-full" />
      </div>

      <div className="absolute top-0 left-0 right-0 w-full flex justify-center pointer-events-none">
        <motion.div
          layout
          transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
          className={cn(
            "pointer-events-auto flex flex-col overflow-hidden transition-all duration-500 w-full",
            isScrolled || isMobileMenuOpen
              ? "max-w-5xl mt-4 mx-4 rounded-2xl border border-border bg-background ring-4 ring-muted shadow-xl"
              : "max-w-full rounded-none border-transparent bg-transparent",
            isScrolled || isMobileMenuOpen
              ? "p-4 px-6 md:px-8 md:py-3"
              : "py-4 px-6 md:px-12",
          )}
        >
          <div className="flex items-center justify-between w-full">
            <Link
              href="/"
              onClick={(e) => {
                handleSamePageScroll(e, "/");
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 text-lg font-semibold tracking-tight px-3 py-1 -mx-3 -my-2 rounded-xl hover:bg-foreground/10 transition-all z-10"
            >
              <Image
                src="/favicon.png"
                alt="Stasis Logo"
                width={32}
                height={32}
              />
              Stasis
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground z-10">
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
                  className="flex items-center justify-center gap-1.5"
                >
                  <div className="flex items-center justify-start w-4 opacity-100 transition-all duration-300 ease-out group-hover:w-0 group-hover:mr-0 group-hover:opacity-0 group-hover:scale-50 shrink-0 overflow-hidden">
                    <svg
                      role="img"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      className="!h-4 !w-4 fill-current shrink-0"
                    >
                      <path d={siApple.path} />
                    </svg>
                  </div>
                  <span className="whitespace-nowrap relative z-10 text-sm leading-none flex items-center h-full">
                    Download for Mac
                  </span>
                  <div className="flex items-center justify-end w-0 opacity-0 transition-all duration-300 ease-out group-hover:w-4 group-hover:opacity-100 shrink-0 overflow-hidden">
                    <ArrowRight className="!h-4 !w-4 shrink-0 -translate-x-4 scale-50 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:scale-100" />
                  </div>
                </a>
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex md:hidden items-center z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="rounded-xl h-10 w-10 hover:bg-foreground/10 relative overflow-hidden flex items-center justify-center"
              >
                <div className="relative flex items-center justify-center h-5 w-5">
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: isMobileMenuOpen ? 0 : 1,
                      rotate: isMobileMenuOpen ? 90 : 0,
                      scale: isMobileMenuOpen ? 0.5 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                    className="absolute"
                  >
                    <Menu className="!h-5 !w-5" />
                  </motion.div>
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: isMobileMenuOpen ? 1 : 0,
                      rotate: isMobileMenuOpen ? 0 : -90,
                      scale: isMobileMenuOpen ? 1 : 0.5,
                    }}
                    transition={{ duration: 0.2 }}
                    className="absolute"
                  >
                    <X className="!h-5 !w-5" />
                  </motion.div>
                </div>
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Dropdown */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="overflow-hidden md:hidden"
              >
                <div className="flex flex-col gap-2 pt-4">
                  <a
                    href="https://github.com/DinanathDash/Stasis/wiki"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-foreground/10 hover:text-foreground transition-all text-sm font-medium text-muted-foreground"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Book className="h-5 w-5" />
                    Documentation
                  </a>
                  <Link
                    href="/changelog"
                    onClick={(e) => {
                      handleSamePageScroll(e, "/changelog");
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-foreground/10 hover:text-foreground transition-all text-sm font-medium text-muted-foreground"
                  >
                    <History className="h-5 w-5" />
                    Changelog
                  </Link>
                  <Button
                    asChild
                    className="w-full mt-2 rounded-xl py-6 font-medium shadow-sm transition-all duration-300 bg-foreground text-background hover:bg-foreground/90"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <a
                      href="https://github.com/DinanathDash/Stasis/releases/latest/download/Stasis.dmg"
                      className="flex items-center justify-center gap-4"
                    >
                      <svg
                        role="img"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        className="!h-5 !w-5 fill-current"
                      >
                        <path d={siApple.path} />
                      </svg>
                      <span className="whitespace-nowrap text-base leading-none flex items-center h-full">
                        Download for Mac
                      </span>
                    </a>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </header>
  );
}
