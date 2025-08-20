"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import universities from "@/data/universities";
import { University } from "@/data/universities";
import { UniversitySelection } from "./university-selection";
import { UniversityCountdown } from "./university-countdown";

export function UsaUniversityCountdown({
  initialDomain,
}: {
  initialDomain?: string;
}) {
  const router = useRouter();
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [showCountdown, setShowCountdown] = useState(false);
  const [customUniversities, setCustomUniversities] = useState<University[]>(
    []
  );
  const [mounted, setMounted] = useState(false);

  const selectedUniversityData = universities.find(
    (uni) => uni.name === selectedUniversity
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("customUniversities");
    if (stored) {
      setCustomUniversities(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (initialDomain && mounted) {
      const cleanInitialDomain = initialDomain
        .replace(/^https?:\/\//, "")
        .replace(/^www\./, "")
        .replace(/\/+$/, "");

      const university = [...universities, ...customUniversities].find(
        (uni) => uni.domain.toLowerCase() === cleanInitialDomain.toLowerCase()
      );

      if (university) {
        setSelectedUniversity(university.name);
        setShowCountdown(true);
      } else {
        router.push("/");
      }
    }
  }, [initialDomain, mounted, customUniversities, router]);

  const handleBack = () => {
    setShowCountdown(false);
    setSelectedUniversity("");
    localStorage.removeItem("selectedUniversity");
    if (initialDomain) {
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          router.push("/");
        });
      } else {
        router.push("/");
      }
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="bg-background flex flex-col">
      {!showCountdown ? (
        <UniversitySelection
          onUniversitySelect={(universityName) => {
            setSelectedUniversity(universityName);
            setShowCountdown(true);
          }}
          customUniversities={customUniversities}
        />
      ) : (
        <UniversityCountdown
          university={selectedUniversityData!}
          onBack={handleBack}
        />
      )}
    </div>
  );
}
