import { UsaUniversityCountdown } from "@/components/UsaUniversityCountdown";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import universities from "@/universities";
import { getDominantColor } from "@/lib/color-utils";
import type { Viewport } from "next";

interface Props {
  params: Promise<{
    domain: string;
  }>;
}

export default async function Page(props: Props) {
  const params = await props.params;
  const domain = await params.domain;

  if (!domain) {
    notFound();
  }

  // Clean the domain parameter
  const cleanDomain = domain
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/+$/, "")
    .trim();
  if (!cleanDomain) {
    notFound();
  }

  return <UsaUniversityCountdown initialDomain={cleanDomain} />;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const domain = await params.domain;

  // Clean the domain parameter
  const cleanDomain = domain
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/+$/, "")
    .trim();

  // Find university data
  const university = universities.find(
    (uni) => uni.domain.toLowerCase() === cleanDomain.toLowerCase()
  );

  if (!university) {
    return {
      title: "University Not Found | USA University Countdown",
      description: "The requested university countdown was not found.",
    };
  }

  // Get logo URL
  const logoUrl = university.fileExists
    ? `/logos/${university.domain}.jpg`
    : `https://logo.clearbit.com/${university.domain}`;

  return {
    title: `${university.name} Decision Date Countdown | USA University Countdown`,
    description: `Track ${university.name}'s college application decision dates. Get accurate countdown timers for early decision (${university.notificationEarly}) and regular decision (${university.notificationRegular}) notifications.`,
    openGraph: {
      title: `${university.name} Decision Date Countdown`,
      description: `Track ${university.name}'s college application decision dates and notifications.`,
      url: `https://count.nyurejects.com/${cleanDomain}`,
    },
    twitter: {
      title: `${university.name} Decision Date Countdown`,
      description: `Track ${university.name}'s college application decision dates and notifications.`,
    },
    icons: {
      icon: logoUrl,
      shortcut: logoUrl,
      apple: logoUrl,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#000000", // Default theme color
};
