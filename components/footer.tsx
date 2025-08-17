"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";

export function Footer() {
  const { theme } = useTheme();

  const badgeTheme = theme === "dark" ? "dark" : "neutral";

  return (
    <footer className="mt-auto py-8 border-t border-border/50 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 relative">
        <Link
          href="https://www.producthunt.com/posts/usa-university-countdown?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-usa&#0045;university&#0045;countdown"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute -left-4 top-1/2 -translate-y-1/2"
        >
          <Image
            src={`https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=819313&theme=${badgeTheme}&t=1737822372083`}
            alt="USA University Countdown - College application decision dates | Product Hunt"
            width={250}
            height={54}
            unoptimized
          />
        </Link>
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <span>Made with</span>
            <span className="text-red-500 animate-pulse">❤️</span>
            <span>by</span>
            <Link
              href="https://disam.dev"
              target="_blank"
              className="font-semibold text-primary hover:text-primary/80 transition-colors underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
            >
              Samuel
            </Link>
            <span>&</span>
            <Link
              href="https://mrlol.dev"
              target="_blank"
              className="font-semibold text-primary hover:text-primary/80 transition-colors underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
            >
              Leo
            </Link>
            <span>from</span>
            <span className="inline-flex items-center gap-1">🇪🇸</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} collegedecision.us All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
