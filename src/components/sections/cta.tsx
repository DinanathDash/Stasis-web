import { ArrowRight } from "lucide-react";
import { siGithub } from "simple-icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ObfuscatedBackground } from "@/components/ui/obfuscated-background";

export function Cta() {
  const faqs = [
    {
      question: "What is the maximum charge limit I can set?",
      answer:
        "You can set a maximum charge level between 50% and 100%. This is enforced at the hardware level via the SMC, ensuring accurate and reliable limits.",
    },
    {
      question: "Does Stasis work in Sleep mode?",
      answer:
        "Yes! Because the charge limit is enforced at the hardware level, it remains perfectly active even through system sleep or complete power cycling.",
    },
    {
      question: "Can I temporarily bypass the limit?",
      answer:
        'Absolutely. You can use the "Top-Up to 100%" feature to temporarily override your limit and charge fully when you need maximum battery life.',
    },
    {
      question: "What Mac models are supported?",
      answer:
        "Stasis is fully supported on all Apple Silicon MacBooks (M-series chips) running macOS 14.8 - 26.6.",
    },
    {
      question: "What languages are supported?",
      answer:
        "Stasis is fully localized in 17 languages, including English, German, Spanish, French, Chinese, Japanese, Korean, and many more.",
    },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-start">
        {/* Left Side: CTA Card */}
        <ObfuscatedBackground
          src="/cta.png"
          className="relative overflow-hidden rounded-3xl bg-black p-10 lg:p-14 text-black shadow-xl h-full flex flex-col justify-center min-h-[400px] bg-cover bg-center bg-no-repeat"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FBFAF5]"></div>
          <div className="relative z-10 flex flex-col items-start justify-center h-full space-y-6">
            <h2 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tight">
              Found a bug or <br />
              need help?
            </h2>
            <p className="text-black/90 text-lg max-w-sm">
              Help us improve Stasis. Report issues, suggest features, or
              contribute directly on GitHub.
            </p>
            <div>
              <Button
                asChild
                size="lg"
                className="h-14 text-lg group relative rounded-xl px-8 font-medium shadow-lg transition-all duration-300 bg-foreground text-background hover:bg-foreground"
              >
                <a
                  href="https://github.com/DinanathDash/Stasis/releases/latest"
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
                    Report an Issue
                  </span>
                  <div className="flex items-center justify-end w-0 opacity-0 transition-all duration-300 ease-out group-hover:w-7 group-hover:ml-2 group-hover:opacity-100 shrink-0">
                    <ArrowRight className="!h-6 !w-6 shrink-0 -translate-x-4 scale-50 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:scale-100" />
                  </div>
                </a>
              </Button>
            </div>
          </div>
        </ObfuscatedBackground>

        {/* Right Side: FAQs */}
        <div className="flex flex-col justify-center h-full space-y-2">
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border/50 bg-muted/30 rounded-2xl px-6 data-[state=open]:bg-muted/50 transition-colors"
              >
                <AccordionTrigger className="hover:no-underline py-5 text-left font-medium text-[15px]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5 text-[15px]">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
