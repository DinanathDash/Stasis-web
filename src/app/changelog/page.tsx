import { Header } from "@/components/sections/header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sparkles,
  Bug,
  Wrench,
  ShieldCheck,
  Palette,
  Hammer,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Release = {
  version: string;
  date: string;
  description: string;
  categories: {
    title: string;
    items: string[];
  }[];
};

function parseChangelog(content: string): Release[] {
  const releases: Release[] = [];
  // Split by "## " (Release header)
  const releaseBlocks = content.split(/^##\s+/gm).slice(1); // ignore the first part which is title/intro

  for (const block of releaseBlocks) {
    const firstLineEnd = block.indexOf("\n");
    if (firstLineEnd === -1) continue;

    const headerLine = block.slice(0, firstLineEnd).trim();
    let version = headerLine;
    let date = "";

    // Check if it's "Version - Date" or just "Version"
    const dateMatch = headerLine.match(/^(.*?)\s+-\s+(.*?)$/);
    if (dateMatch) {
      version = dateMatch[1].replace(/^\[|\]$/g, "").trim(); // Remove brackets if present e.g. [1.0.0]
      date = dateMatch[2].trim();
    }

    if (version.toLowerCase() === "unreleased") continue;

    const body = block.slice(firstLineEnd + 1).trim();

    // Split body by "### " (Category header)
    const categoryBlocks = body.split(/^###\s+/gm);
    const description = categoryBlocks[0].trim(); // Everything before the first category

    const categories = [];
    for (let i = 1; i < categoryBlocks.length; i++) {
      const catBlock = categoryBlocks[i];
      const catFirstLineEnd = catBlock.indexOf("\n");
      const catTitle =
        catFirstLineEnd !== -1
          ? catBlock.slice(0, catFirstLineEnd).trim()
          : catBlock.trim();

      const catContent =
        catFirstLineEnd !== -1
          ? catBlock.slice(catFirstLineEnd + 1).trim()
          : "";

      // Extract bullet points
      const items = catContent
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith("- ") || line.startsWith("* "))
        .map((line) => line.replace(/^[-*]\s*/, ""));

      if (items.length > 0) {
        categories.push({
          title: catTitle,
          items,
        });
      }
    }

    releases.push({
      version,
      date,
      description,
      categories,
    });
  }

  return releases;
}

export default async function ChangelogPage() {
  let releases: Release[] = [];

  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/DinanathDash/Stasis/main/CHANGELOG.md",
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      },
    );
    if (res.ok) {
      const text = await res.text();
      releases = parseChangelog(text);
    }
  } catch (error) {
    console.error("Failed to fetch changelog:", error);
  }

  const getCategoryIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes("feature"))
      return <Sparkles className="w-5 h-5 mt-0.5 text-foreground" />;
    if (lower.includes("fix") || lower.includes("bug"))
      return <Bug className="w-5 h-5 mt-0.5 text-foreground" />;
    if (
      lower.includes("ui") ||
      lower.includes("layout") ||
      lower.includes("enhancement")
    )
      return <Palette className="w-5 h-5 mt-0.5 text-foreground" />;
    if (lower.includes("security") || lower.includes("distribution"))
      return <ShieldCheck className="w-5 h-5 mt-0.5 text-foreground" />;
    if (lower.includes("infrastructure") || lower.includes("build"))
      return <Hammer className="w-5 h-5 mt-0.5 text-foreground" />;
    return <Wrench className="w-5 h-5 mt-0.5 text-foreground" />;
  };

  return (
    <main className="flex min-h-screen flex-col items-center pb-24">
      <Header />

      <section className="w-full max-w-3xl px-4 mt-20">
        {releases.length > 0 ? (
          <Accordion
            type="single"
            collapsible
            className="w-full space-y-2"
            defaultValue={releases[0].version}
          >
            {releases.map((release) => (
              <AccordionItem
                value={release.version}
                key={release.version}
                className="border-b border-border/50 py-2"
              >
                <AccordionTrigger className="hover:no-underline hover:text-foreground">
                  <div className="flex w-full items-center justify-between text-lg md:text-xl">
                    <span className="font-bold tracking-tight text-foreground/90">
                      {release.version}
                    </span>
                    {release.date && (
                      <span className="text-base text-muted-foreground font-normal tabular-nums">
                        {release.date}
                      </span>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-8 pl-8 pr-4">
                  {release.description && (
                    <div className="prose prose-slate dark:prose-invert mb-8 text-muted-foreground">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {release.description}
                      </ReactMarkdown>
                    </div>
                  )}

                  <div className="space-y-8">
                    {release.categories.map((category) => (
                      <div key={category.title}>
                        <div className="flex items-start gap-3 mb-4">
                          {getCategoryIcon(category.title)}
                          <h3 className="text-lg font-bold tracking-tight text-foreground/90">
                            {category.title}{" "}
                            <span className="text-muted-foreground font-normal">
                              ({category.items.length})
                            </span>
                          </h3>
                        </div>
                        <ul className="space-y-3 pl-[32px] text-muted-foreground text-base">
                          {category.items.map((item, i) => (
                            <li key={i} className="leading-relaxed">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  p: ({ ...props }) => <span {...props} />,
                                }}
                              >
                                {item}
                              </ReactMarkdown>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center text-muted-foreground mt-20">
            Failed to load changelog. Please check the Stasis GitHub repository
            directly.
          </div>
        )}
      </section>
    </main>
  );
}
