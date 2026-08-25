"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, FileText, ShieldCheck } from "lucide-react";
import { siGithub, siX } from "simple-icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Footer() {
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

  return (
    <footer className="relative w-full flex flex-col items-center justify-center py-2 md:py-12 px-4 overflow-hidden">
      {/* Background Watermark */}
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none select-none z-0 overflow-hidden">
        <h1 className="text-[25vw] md:text-[20vw] font-black text-foreground/[0.05] tracking-tighter whitespace-nowrap translate-y-[37%]">
          Stasis
        </h1>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-5xl gap-6 md:gap-4 mb-14 md:mb-32">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="secondary"
            size="icon"
            asChild
            className="rounded-2xl h-12 w-12 bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all shadow-sm"
          >
            <Link
              href="https://x.com/DinanathDash"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="!h-5 !w-5 fill-current"
              >
                <path d={siX.path} />
              </svg>
              <span className="sr-only">X (Twitter)</span>
            </Link>
          </Button>
          <Button
            variant="secondary"
            size="icon"
            asChild
            className="rounded-2xl h-12 w-12 bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all shadow-sm"
          >
            <Link
              href="https://github.com/DinanathDash/Stasis"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="!h-6 !w-6 fill-current"
              >
                <path d={siGithub.path} />
              </svg>
              <span className="sr-only">GitHub</span>
            </Link>
          </Button>
          <Button
            variant="secondary"
            size="icon"
            asChild
            className="rounded-2xl h-12 w-12 bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all shadow-sm"
          >
            <Link
              href="mailto:reach@dinanath.dev"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Mail className="!h-6 !w-6" />
              <span className="sr-only">Email</span>
            </Link>
          </Button>
        </div>

        <Separator orientation="vertical" className="hidden md:block h-8 w-px bg-border mx-2" />
        <Separator orientation="horizontal" className="block md:hidden w-16 h-px bg-border" />

        <div className="flex items-center justify-center gap-4">
          <Button
            variant="secondary"
            asChild
            className="rounded-2xl h-12 px-5 bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all shadow-sm"
          >
            <Link href="/terms" onClick={(e) => handleSamePageScroll(e, "/terms")} className="flex items-center gap-2.5">
              <FileText className="!h-4.5 !w-4.5" />
              <span className="text-base font-medium">Terms</span>
            </Link>
          </Button>
          <Button
            variant="secondary"
            asChild
            className="rounded-2xl h-12 px-5 bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all shadow-sm"
          >
            <Link href="/privacy" onClick={(e) => handleSamePageScroll(e, "/privacy")} className="flex items-center gap-2.5">
              <ShieldCheck className="!h-5 !w-5" />
              <span className="text-base font-medium">Privacy</span>
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
