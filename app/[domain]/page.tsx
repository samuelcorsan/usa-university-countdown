import { UsaUniversityCountdown } from "@/components/usa-university-countdown";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import universities from "@/data/universities";
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

  const cleanDomain = domain
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/+$/, "")
    .trim();

  const university = universities.find(
    (uni) => uni.domain.toLowerCase() === cleanDomain.toLowerCase()
  );

  if (!university) {
    return {
      title: "University Not Found | USA University Countdown",
      description: "The requested university countdown was not found.",
      robots: {
        index: false,
        follow: true,
      },
    };
  }
  const universityAbbreviation = university.domain.split(".")[0];
  const keywords = [
    university.name,
    `${university.name} decision date`,
    `${university.name} admissions`,
    `${university.name} early decision`,
    `${university.name} regular decision`,
    `${university.name} countdown`,
    `${university.name} application results`,
    `${universityAbbreviation} decision date`,
    `${universityAbbreviation} admissions`,
    `${universityAbbreviation} early decision`,
    `${universityAbbreviation} regular decision`,
    `${universityAbbreviation} countdown`,
    `${universityAbbreviation} application results`,
    "college decisions",
    "university countdown",
    "admission dates",
  ].join(", ");

  const logoUrl = university.fileExists
    ? `/logos/${university.domain}.jpg`
    : `https://logo.clearbit.com/${university.domain}`;

  return {
    title: `${university.name} Decision Date Countdown | USA University Countdown`,
    description: `Track ${university.name}'s college application decision dates. Get accurate countdown timers for early decision (${university.notificationEarly}) and regular decision (${university.notificationRegular}) notifications.`,
    keywords,
    openGraph: {
      title: `${university.name} Decision Date Countdown`,
      description: `Track ${university.name}'s college application decision dates and notifications.`,
      url: `https://collegedecision.us/${cleanDomain}`,
      type: "website",
      siteName: "USA University Countdown",
      images: [
        {
          url: `/api/og?domain=${cleanDomain}`,
          width: 1200,
          height: 630,
          alt: `${university.name} Decision Date Countdown`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${university.name} Decision Date Countdown`,
      description: `Track ${university.name}'s college application decision dates and notifications.`,
      images: [`/api/og?domain=${cleanDomain}`],
    },
    icons: {
      icon: logoUrl,
      shortcut: logoUrl,
      apple: logoUrl,
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
}

export const viewport: Viewport = {
  themeColor: "#000000",
};
