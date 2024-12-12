import { UsaUniversityCountdown } from "@/components/UsaUniversityCountdown";
import { notFound } from "next/navigation";

type Props = {
  params: {
    domain: string;
  };
};

export default async function UniversityPage({ params }: Props) {
  const { domain } = await params;

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
