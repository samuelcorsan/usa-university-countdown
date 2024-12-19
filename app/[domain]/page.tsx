import { UsaUniversityCountdown } from "@/components/UsaUniversityCountdown";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import universities from "@/universities";
import { getDominantColor } from "@/lib/color-utils";

interface Props {
  params: {
    domain: string;
  };
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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

  // Get dominant color
  const themeColor = await getDominantColor(logoUrl);

  return {
    title: `${university.name} Decision Date Countdown | USA University Countdown`,
    description: `Track ${university.name}'s college application decision dates. Get accurate countdown timers for early decision (${university.notificationEarly}) and regular decision (${university.notificationRegular}) notifications.`,
    themeColor: themeColor,
    openGraph: {
      title: `${university.name} Decision Date Countdown`,
      description: `Track ${university.name}'s college application decision dates and notifications.`,
      url: `https://count.nyurejects.com/${cleanDomain}`,
    },
    twitter: {
      title: `${university.name} Decision Date Countdown`,
      description: `Track ${university.name}'s college application decision dates and notifications.`,
    },
  };
}
