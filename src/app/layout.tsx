import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { Caveat } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";
import { AssetPreloader } from "@/components/providers/asset-preloader";
import { seoMetadata, siteConfig } from "@/lib/seo";

export const metadata: Metadata = seoMetadata;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "macOS",
    author: {
      "@type": "Person",
      name: "Dinanath Dash",
      url: "https://www.dinanath.dev",
      sameAs: [
        "https://github.com/DinanathDash",
        "https://twitter.com/dinanathdash",
        "https://www.linkedin.com/in/dinanathdash",
        "https://instagram.com/dinanath_dash",
      ],
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${caveat.variable} font-sans antialiased flex flex-col min-h-screen`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <div className="flex-grow">{children}</div>
        <Footer />
        <AssetPreloader />
      </body>
    </html>
  );
}
