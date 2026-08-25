import type { Metadata } from "next";

const siteUrl = "https://stasis.dinanath.dev";

export const siteConfig = {
  name: "Stasis",
  description:
    "Monitor power metrics, manage charge limits, automate power profiles, and extend your battery's lifespan — all from the menu bar.",
  url: siteUrl,
  twitter: "@dinanathdash",
};

const isProduction =
  process.env.NODE_ENV === "production" &&
  process.env.VERCEL_ENV === "production";

export const seoMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: "Stasis - A smarter battery icon for your MacBook",
    template: `%s | ${siteConfig.name}`,
  },

  description: siteConfig.description,

  keywords: [
    "MacBook",
    "Battery Monitor",
    "Charge Limit",
    "Power Metrics",
    "MacOS Menu Bar",
    "Stasis",
    "Battery Lifespan",
    "MacBook battery health",
    "Extend MacBook battery life",
    "Mac battery charge limiter",
    "AlDente alternative",
    "MacBook battery management",
    "Mac battery charge limit 80%",
    "Stop charging MacBook at 80%",
    "Apple Silicon Mac power state control",
    "Clamshell mode battery management",
    "Open-source Mac battery software",
    "Battery Toolkit alternative",
  ],

  authors: [{ name: "Dinanath Dash" }],
  creator: "Dinanath Dash",

  robots: isProduction
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      }
    : { index: false, follow: false },

  openGraph: {
    title: {
      default: "Stasis - A smarter battery icon for your MacBook",
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `${siteConfig.url}/images/seo/opengraph-image.png?v=1`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: {
      default: "Stasis - A smarter battery icon for your MacBook",
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    creator: siteConfig.twitter,
    images: [`${siteConfig.url}/images/seo/twitter-image.png?v=1`],
  },

  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      {
        url: "/apple-touch-icon-precomposed.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: "black-translucent",
  },
};
