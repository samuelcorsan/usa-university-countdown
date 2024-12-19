import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/theme-toogle";
import { Analytics } from "@vercel/analytics/react";
import dynamic from "next/dynamic";
import ErrorBoundary from "@/components/ErrorBoundary";
import { GoogleAnalytics } from "@next/third-parties/google";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://count.nyurejects.com"),
  title: "USA University Countdown | College Application Decision Dates",
  description:
    "Track college application decision dates for top US universities. Get accurate countdown timers for early and regular decision notifications from Harvard, MIT, Stanford and more.",
  keywords:
    "university countdown, college applications, USA universities, application deadlines, early decision, regular decision, university admissions, college notifications, ivy league decisions, college decision dates",
  authors: [
    {
      name: "USA University Countdown",
      url: "https://count.nyurejects.com",
    },
  ],
  creator: "USA University Countdown",
  publisher: "USA University Countdown",
  manifest: "/manifest.json",
  themeColor: "#000000",
  alternates: {
    canonical: "https://count.nyurejects.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://count.nyurejects.com",
    title: "USA University Countdown | College Application Decision Dates",
    description:
      "Track college application decision dates for top US universities. Get accurate countdown timers for early and regular decision notifications.",
    siteName: "USA University Countdown",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "USA University Countdown Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "USA University Countdown | College Application Decision Dates",
    description:
      "Track college application decision dates for top US universities. Get accurate countdown timers for early and regular decision notifications.",
    creator: "@usauniversitycd",
    images: ["/og-image.jpg"],
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

// Dynamically import service worker registration
const SwRegister = dynamic(() => import("./sw-register"), {
  ssr: true,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "USA University Countdown",
    description:
      "Track college application decision dates for top US universities",
    url: "https://count.nyurejects.com",
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="theme-preference"
        >
          <ErrorBoundary>
            <Analytics />
            <SwRegister />
            <div className="absolute top-4 right-4 z-50">
              <ModeToggle />
            </div>
            {children}
          </ErrorBoundary>
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-GM5JBE83W" />
    </html>
  );
}
