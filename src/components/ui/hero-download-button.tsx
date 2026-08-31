"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { siApple } from "simple-icons";
import { useState } from "react";
import { DownloadDialog } from "./download-dialog";

export function HeroDownloadButton() {
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);

  return (
    <>
      <DownloadDialog
        isOpen={isDownloadDialogOpen}
        onClose={() => setIsDownloadDialogOpen(false)}
      />
      <Button
        size="lg"
        className="h-12 md:h-14 w-full text-base md:text-lg group relative rounded-xl px-6 md:px-8 font-medium shadow-lg transition-all duration-300 bg-foreground text-background hover:bg-foreground border border-transparent cursor-pointer flex items-center justify-center"
        onClick={() => setIsDownloadDialogOpen(true)}
      >
        <div className="flex items-center justify-start w-7 mr-2 opacity-100 transition-all duration-300 ease-out group-hover:w-0 group-hover:mr-0 group-hover:opacity-0 group-hover:scale-50 shrink-0">
          <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="!h-6 !w-6 fill-current shrink-0"
          >
            <path d={siApple.path} />
          </svg>
        </div>
        <span className="whitespace-nowrap relative z-10">
          Download for Mac
        </span>
        <div className="flex items-center justify-end w-0 -ml-2 opacity-0 transition-all duration-300 ease-out group-hover:w-7 group-hover:ml-2 group-hover:opacity-100 shrink-0">
          <ArrowRight className="!h-6 !w-6 shrink-0 -translate-x-4 scale-50 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:scale-100" />
        </div>
      </Button>
    </>
  );
}
