import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/theme-toogle";
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

export const metadata: Metadata = {
  title: "USA University Countdown",
  description: "Countdown to the start of the USA university application",
  keywords:
    "university countdown, college applications, USA universities, application deadlines, early decision, regular decision, university admissions, college notifications",
  authors: [{ name: "USA University Countdown" }],
  creator: "USA University Countdown",
  publisher: "USA University Countdown",
  manifest: "/manifest.json",
  themeColor: "#000000",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://usa-university-countdown.vercel.app",
    title: "USA University Countdown",
    description: "Countdown to the start of the USA university application",
    siteName: "USA University Countdown",
  },
  twitter: {
    card: "summary_large_image",
    title: "USA University Countdown",
    description: "Countdown to the start of the USA university application",
    creator: "@usauniversitycd",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        <div className="absolute top-4 right-4 z-50">
          <ModeToggle />
        </div>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
