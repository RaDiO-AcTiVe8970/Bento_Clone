import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bentoportfolio.me';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "BentoPortfolio - Your Link in Bio",
    template: "%s | BentoPortfolio",
  },
  description: "Create your beautiful, customizable link-in-bio page. Build stunning portfolio grids with drag-and-drop blocks. Share all your important links, social media, and content in one place. Fast, beautiful, and free.",
  keywords: [
    "link in bio",
    "portfolio",
    "personal page",
    "bento grid",
    "profile",
    "linktree alternative",
    "bio link",
    "social media links",
    "creator tools",
    "personal branding",
    "link page",
    "custom bio link",
  ],
  authors: [{ name: "BentoPortfolio" }],
  creator: "BentoPortfolio",
  publisher: "BentoPortfolio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: "technology",
  classification: "Personal Portfolio Builder",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "BentoPortfolio",
    title: "BentoPortfolio - Your Link in Bio",
    description: "Create your beautiful, customizable link-in-bio page. Build stunning portfolio grids with drag-and-drop blocks.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "BentoPortfolio - Your Link in Bio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BentoPortfolio - Your Link in Bio",
    description: "Create your beautiful, customizable link-in-bio page. Build stunning portfolio grids with drag-and-drop blocks.",
    images: ["/twitter-image"],
    creator: "@bentoportfolio",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/favicon.svg", color: "#8b5cf6" },
    ],
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: baseUrl,
  },
  verification: {
    // Add your verification codes here when available
    // google: "google-verification-code",
    // yandex: "yandex-verification-code",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google.com" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
