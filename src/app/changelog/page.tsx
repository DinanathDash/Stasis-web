import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Header } from '@/components/sections/header';

export default async function ChangelogPage() {
  // Read the CHANGELOG.md file from the Stasis repo root
  const changelogPath = path.join(process.cwd(), '..', 'CHANGELOG.md');
  let changelogContent = '';

  try {
    changelogContent = fs.readFileSync(changelogPath, 'utf8');
  } catch (error) {
    changelogContent = 'Changelog could not be loaded at this time.';
  }

  return (
    <main className="flex min-h-screen flex-col items-center pb-24">
      <Header />

      {/* Changelog Content */}
      <section className="w-full max-w-4xl px-4 mt-16">
        <div className="prose prose-slate prose-lg max-w-none dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {changelogContent}
          </ReactMarkdown>
        </div>
      </section>
    </main>
  );
}
