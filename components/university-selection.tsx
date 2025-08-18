"use client";

import { useMemo, useState, useEffect } from "react";
import universities from "@/data/universities";
import { University } from "@/data/universities";
import { UniversityCard } from "./university-card";
import { SuggestUniversityDialog } from "./suggest-university-dialog";
import { Header } from "./header";
import { Footer } from "./footer";

interface UniversitySelectionProps {
  onUniversitySelect: (universityName: string) => void;
  customUniversities: University[];
  setCustomUniversities: (universities: University[]) => void;
}

export function UniversitySelection({
  onUniversitySelect,
  customUniversities,
  setCustomUniversities,
}: UniversitySelectionProps) {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 100) {
        setShowScrollIndicator(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sortedUniversities = useMemo(() => {
    const popularUniversities = [
      "harvard.edu",
      "stanford.edu",
      "mit.edu",
      "yale.edu",
      "princeton.edu",
      "columbia.edu",
      "upenn.edu",
      "cornell.edu",
      "dartmouth.edu",
      "brown.edu",
      "berkeley.edu",
      "ucla.edu",
      "uchicago.edu",
      "duke.edu",
      "northwestern.edu",
      "caltech.edu",
    ];

    return [...universities, ...customUniversities].sort((a, b) => {
      const now = new Date();
      const defaultTime = "19:00:00";

      const [dayRegularA, monthRegularA, yearRegularA] =
        a.notificationRegular.split("-");
      const targetDateRegularA = new Date(
        `20${yearRegularA}-${monthRegularA}-${dayRegularA}T${
          a.time || defaultTime
        }-05:00`
      );

      let earlyDecisionPassedA = false;
      if (a.showEarly && a.notificationEarly) {
        const [dayEarlyA, monthEarlyA, yearEarlyA] =
          a.notificationEarly.split("-");
        const targetDateEarlyA = new Date(
          `20${yearEarlyA}-${monthEarlyA}-${dayEarlyA}T${
            a.time || defaultTime
          }-05:00`
        );
        earlyDecisionPassedA = now > targetDateEarlyA;
      }

      const aIsPassed =
        now > targetDateRegularA && (!a.showEarly || earlyDecisionPassedA);

      const [dayRegularB, monthRegularB, yearRegularB] =
        b.notificationRegular.split("-");
      const targetDateRegularB = new Date(
        `20${yearRegularB}-${monthRegularB}-${dayRegularB}T${
          b.time || defaultTime
        }-05:00`
      );

      let earlyDecisionPassedB = false;
      if (b.showEarly && b.notificationEarly) {
        const [dayEarlyB, monthEarlyB, yearEarlyB] =
          b.notificationEarly.split("-");
        const targetDateEarlyB = new Date(
          `20${yearEarlyB}-${monthEarlyB}-${dayEarlyB}T${
            b.time || defaultTime
          }-05:00`
        );
        earlyDecisionPassedB = now > targetDateEarlyB;
      }

      const bIsPassed =
        now > targetDateRegularB && (!b.showEarly || earlyDecisionPassedB);

      if (aIsPassed && !bIsPassed) return 1;
      if (!aIsPassed && bIsPassed) return -1;

      const aPopularityIndex = popularUniversities.indexOf(a.domain);
      const bPopularityIndex = popularUniversities.indexOf(b.domain);

      if (aPopularityIndex !== -1 && bPopularityIndex !== -1) {
        return aPopularityIndex - bPopularityIndex;
      }

      if (aPopularityIndex !== -1) return -1;
      if (bPopularityIndex !== -1) return 1;

      const [dayA, monthA, yearA] = a.notificationRegular.split("-");
      const [dayB, monthB, yearB] = b.notificationRegular.split("-");
      const dateA = new Date(`20${yearA}-${monthA}-${dayA}`);
      const dateB = new Date(`20${yearB}-${monthB}-${dayB}`);

      return dateA.getTime() - dateB.getTime();
    });
  }, [customUniversities]);

  return (
    <>
      <Header />

      <div className="flex-1 max-w-7xl mx-auto px-6 pb-8 w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {sortedUniversities.map((university) => (
            <UniversityCard
              key={university.name}
              university={university}
              onSelect={onUniversitySelect}
            />
          ))}

          <SuggestUniversityDialog
            customUniversities={customUniversities}
            setCustomUniversities={setCustomUniversities}
          />
        </div>

        {showScrollIndicator && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 md:hidden">
            <div className="bg-background/90 backdrop-blur-sm border border-border rounded-full px-4 py-2 shadow-lg">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Scroll for more universities</span>
                <span className="animate-bounce text-lg">↓</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
