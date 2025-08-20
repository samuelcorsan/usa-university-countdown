import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-4 py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base">
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
          <div className="text-xs sm:text-sm text-muted-foreground px-2">
            © {new Date().getFullYear()} collegedecision.us All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
