"use client";

import { ScrollProgress } from "@/components/ui/scroll-progress";

export function ChangelogMobileNav({ versions }: { versions: string[] }) {
  const sections = versions.map((v) => ({
    id: `release-${v}`,
    label: v,
  }));

  return (
    <div className="md:hidden">
      <ScrollProgress sections={sections} />
    </div>
  );
}
