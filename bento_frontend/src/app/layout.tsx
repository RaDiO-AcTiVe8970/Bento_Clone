import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Bento - Your Link in Bio",
    template: "%s | Bento",
  },
  description: "Create your beautiful, customizable link-in-bio page. Share all your important links in one place.",
  keywords: ["link in bio", "portfolio", "personal page", "bento", "profile"],
  authors: [{ name: "Bento Clone" }],
  creator: "Bento Clone",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Bento",
    title: "Bento - Your Link in Bio",
    description: "Create your beautiful, customizable link-in-bio page.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bento - Your Link in Bio",
    description: "Create your beautiful, customizable link-in-bio page.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
