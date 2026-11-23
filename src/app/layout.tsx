import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Bot } from "lucide-react";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BGM AU LTD | The Clash of Metals",
  description:
    "Premium bullion dealer. Live gold & silver prices, physical bullion store, and intelligent market insights.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BGM AU",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <head>
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--bg-dark)] text-[var(--text-primary)]">
        <ServiceWorkerRegister />
        {children}

        <Link
          href="/assay"
          aria-label="Ask BGM Assay"
          className="fixed bottom-6 right-6 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37] text-black shadow-lg shadow-black/40 transition-transform hover:scale-105"
        >
          <Bot className="h-6 w-6" />
        </Link>
      </body>
    </html>
  );
}
