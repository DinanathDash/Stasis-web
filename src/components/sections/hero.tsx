import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { siGithub } from "simple-icons";
import { ProtectedBackground } from "@/components/ui/protected-background";
import { HeroDownloadButton } from "@/components/ui/hero-download-button";

export async function Hero() {
  let version = "1.0.0";
  let releaseUrl = "https://github.com/DinanathDash/Stasis/releases/latest";
  try {
    const res = await fetch(
      "https://api.github.com/repos/DinanathDash/Stasis/releases/latest",
      { next: { revalidate: 3600 } },
    );
    if (res.ok) {
      const data = await res.json();
      if (data.tag_name) {
        // Strip leading 'v' if present (e.g. 'v0.20.2' -> '0.20.2')
        version = data.tag_name.replace(/^v/, "");
      }
      if (data.html_url) {
        releaseUrl = data.html_url;
      }
    }
  } catch (error) {
    console.error("Failed to fetch Stasis release version:", error);
  }

  return (
    <ProtectedBackground
      src="/background.png"
      as="section"
      className="relative w-full flex flex-col items-center text-center pt-16 md:pt-24 pb-20 md:pb-32 px-4 bg-cover bg-center bg-no-repeat"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FBFAF5]"></div>

      <div className="relative z-10 flex flex-col items-center">
        <a
          href={releaseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group mb-8 inline-flex items-center rounded-full border border-border/50 bg-muted/40 backdrop-blur-md p-1 pr-3 sm:pr-4 text-xs sm:text-sm font-medium text-foreground shadow-sm hover:bg-muted/60 transition-colors max-w-full overflow-hidden"
        >
          <span className="rounded-full bg-background border border-border/50 px-3 py-1 shadow-sm mr-2 sm:mr-3 shrink-0">
            Stasis {version}
          </span>
          <span className="truncate">
            New feature is ready to use, let&apos;s try
          </span>
          <ArrowRight className="ml-2 h-4 w-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:-rotate-45" />
        </a>
        <h1 className="mb-6 max-w-3xl text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-medium leading-[1.15] tracking-tight">
          A smarter battery icon
          <br />
          for your MacBook.
        </h1>
        <p className="mb-10 max-w-[600px] text-base md:text-lg text-muted-foreground leading-relaxed px-2">
          Monitor power metrics, manage charge limits, automate power profiles,
          and extend your battery&apos;s lifespan — all from the menu bar.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full sm:w-auto px-4 sm:px-0">
          <HeroDownloadButton />
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 md:h-14 w-full sm:w-auto text-base md:text-lg group relative overflow-hidden rounded-xl px-6 md:px-8 font-medium bg-background/50 backdrop-blur-md border-border/50 text-foreground transition-all duration-300 shadow-sm"
          >
            <a
              href="https://github.com/DinanathDash/Stasis"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <div className="flex items-center justify-start w-7 mr-2 opacity-100 transition-all duration-300 ease-out group-hover:w-0 group-hover:mr-0 group-hover:opacity-0 group-hover:scale-50 shrink-0">
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="!h-6 !w-6 fill-current shrink-0"
                >
                  <path d={siGithub.path} />
                </svg>
              </div>
              <span className="whitespace-nowrap relative z-10">
                View on GitHub
              </span>
              <div className="flex items-center justify-end w-0 opacity-0 transition-all duration-300 ease-out group-hover:w-7 group-hover:ml-2 group-hover:opacity-100 shrink-0">
                <ArrowRight className="!h-6 !w-6 shrink-0 -translate-x-4 scale-50 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:scale-100" />
              </div>
            </a>
          </Button>
        </div>
      </div>
    </ProtectedBackground>
  );
}
