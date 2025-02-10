import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/theme-toggle";
import { Analytics } from "@vercel/analytics/react";
import dynamic from "next/dynamic";
import ErrorBoundary from "@/components/ErrorBoundary";
import { GoogleAnalytics } from "@next/third-parties/google";
import universities from "@/universities";
import { Toaster } from "@/components/ui/toaster";

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
  maximumScale: 5,
  themeColor: "#000000",
  colorScheme: "dark light",
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  imagePreload: true,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://collegedecision.us"),
  title: "USA University Countdown | Real-time College Decision Date Tracker",
  description:
    "Stay ahead with real-time countdowns for college decision dates at top US universities. Track early action, early decision, and regular decision release dates for Harvard, MIT, Stanford, and other prestigious institutions. Get accurate notification times and never miss an important admission decision.",
  applicationName: "USA University Countdown",
  referrer: "origin-when-cross-origin",
  keywords:
    "university countdown, college applications, USA universities, application deadlines, early decision, regular decision, university admissions, college notifications, ivy league decisions, college decision dates, " +
    universities
      .map((uni) => [
        uni.name,
        uni.domain.split(".")[0],
        `${uni.name} decision date`,
        `${uni.name} admissions`,
      ])
      .flat()
      .concat([
        "university countdown",
        "college applications",
        "USA universities",
        "application deadlines",
        "early decision",
        "regular decision",
        "university admissions",
        "college notifications",
        "ivy league decisions",
        "college decision dates",
        "rd decision date",
        "regular decision date",
      ])
      .join(", "),
  authors: [
    {
      name: "USA University Countdown",
      url: "https://count.nyurejects.com",
    },
  ],
  creator: "USA University Countdown",
  publisher: "USA University Countdown",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: "cPoEeLVQ9rRKkbhtGjsfWJNWeFUYI7u_iudiKZNS1KI",
  },
  manifest: "/manifest.json",
  themeColor: "#000000",
  alternates: {
    canonical: "https://collegedecision.us",
    languages: {
      "en-US": "https://collegedecision.us",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://collegedecision.us",
    title: "USA University Countdown | Real-time College Decision Date Tracker",
    description:
      "Stay informed with precise countdowns to college admission decisions. Track early action, early decision, and regular decision dates for top US universities, including Ivy League schools. Never miss an important admission notification with our accurate tracking system.",
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
    title: "USA University Countdown | Real-time College Decision Date Tracker",
    description:
      "Stay informed with precise countdowns to college admission decisions. Track early action, early decision, and regular decision dates for top US universities, including Ivy League schools. Never miss an important admission notification.",
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
      "Comprehensive tracking system for college application decision dates at top US universities. Features real-time countdowns for early action, early decision, and regular decision notifications.",
    url: "https://collegedecision.us",
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link
          rel="preconnect"
          href="https://logo.clearbit.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://logo.clearbit.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative overflow-auto py-5`}
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
            <Toaster />
          </ErrorBoundary>
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-5L0ZT9WWCH" />
    </html>
  );
}
