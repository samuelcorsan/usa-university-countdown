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
}

export function UniversitySelection({
  onUniversitySelect,
  customUniversities,
}: UniversitySelectionProps) {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 50) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sortedUniversities = useMemo(() => {
    return [...universities, ...customUniversities].sort((a, b) => {
      const now = new Date();
      const defaultTime = "19:00:00";

      const [monthRegularA, dayRegularA, yearRegularA] =
        a.applicationRegular.split("-");
      const targetDateRegularA = new Date(
        `20${yearRegularA}-${monthRegularA}-${dayRegularA}T${
          a.time || defaultTime
        }-05:00`
      );

      let earlyDecisionPassedA = false;
      if (a.showEarly && a.applicationEarly) {
        const [monthEarlyA, dayEarlyA, yearEarlyA] =
          a.applicationEarly.split("-");
        const targetDateEarlyA = new Date(
          `20${yearEarlyA}-${monthEarlyA}-${dayEarlyA}T${
            a.time || defaultTime
          }-05:00`
        );
        earlyDecisionPassedA = now > targetDateEarlyA;
      }

      const aIsPassed =
        now > targetDateRegularA && (!a.showEarly || earlyDecisionPassedA);

      const [monthRegularB, dayRegularB, yearRegularB] =
        b.applicationRegular.split("-");
      const targetDateRegularB = new Date(
        `20${yearRegularB}-${monthRegularB}-${dayRegularB}T${
          b.time || defaultTime
        }-05:00`
      );

      let earlyDecisionPassedB = false;
      if (b.showEarly && b.applicationEarly) {
        const [monthEarlyB, dayEarlyB, yearEarlyB] =
          b.applicationEarly.split("-");
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

      const aPriority = a.priority ?? Number.MAX_SAFE_INTEGER;
      const bPriority = b.priority ?? Number.MAX_SAFE_INTEGER;

      if (
        aPriority !== Number.MAX_SAFE_INTEGER &&
        bPriority !== Number.MAX_SAFE_INTEGER
      ) {
        return aPriority - bPriority;
      }

      if (aPriority !== Number.MAX_SAFE_INTEGER) return -1;
      if (bPriority !== Number.MAX_SAFE_INTEGER) return 1;

      const dateA = new Date(
        `20${yearRegularA}-${monthRegularA}-${dayRegularA}`
      );
      const dateB = new Date(
        `20${yearRegularB}-${monthRegularB}-${dayRegularB}`
      );

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

          <SuggestUniversityDialog />
        </div>

        {showScrollIndicator && (
          <div className="fixed bottom-6 left-0 right-0 z-50 md:hidden px-6">
            <div className="bg-background/90 backdrop-blur-sm border border-border rounded-full px-4 py-2 shadow-lg w-fit mx-auto">
              <div className="flex items-center justify-between text-sm text-muted-foreground space-x-4">
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
