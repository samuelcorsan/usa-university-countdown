"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import universities from "@/data/universities";
import { University } from "@/data/universities";
import { CalendarButtons } from "./calendar-buttons";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import React from "react";
import { toast } from "@/hooks/use-toast";

const CountdownNumber = React.memo(
  ({ value, isUrgent }: { value: number; isUrgent?: boolean }) => {
    const displayValue = value.toString().padStart(2, "0");

    return (
      <div className="flex justify-center space-x-[1px]">
        {displayValue.split("").map((digit, index) => (
          <div
            key={index}
            className="relative h-[36px] w-[28px] overflow-hidden"
          >
            <div
              className={cn(
                "absolute w-full transition-transform duration-300 flex flex-col",
                isUrgent && "text-destructive"
              )}
              style={{
                transform: `translateY(-${parseInt(digit) * 36}px)`,
              }}
            >
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="h-[36px] flex items-center justify-center text-2xl font-bold"
                >
                  {i}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
);
CountdownNumber.displayName = "CountdownNumber";

const showProductHuntBadge = false;

const normalizeUniversityName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\b(university|college|institute|of|technology)\b/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
};

const isTimeUrgent = (timeLeft: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}) => {
  return timeLeft.days === 0 && timeLeft.hours === 0;
};

export function UsaUniversityCountdown({
  initialDomain,
}: {
  initialDomain?: string;
}) {
  const router = useRouter();
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [showCountdown, setShowCountdown] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [timeLeftRegular, setTimeLeftRegular] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [customUniversities, setCustomUniversities] = useState<University[]>(
    []
  );
  const [mounted, setMounted] = useState(false);
  const [isBottom, setIsBottom] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const suggestDialogCloseRef = useRef<HTMLButtonElement>(null);

  const selectedUniversityData = universities.find(
    (uni) => uni.name === selectedUniversity
  );

  const calculateTimeLeft = useCallback((targetDate: Date) => {
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return null;
  }, []);

  const isDecisionToday = (university: University) => {
    const now = new Date();
    const today = `${now.getDate().toString().padStart(2, "0")}-${(
      now.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${now.getFullYear().toString().slice(-2)}`;

    const isToday =
      university.notificationRegular === today ||
      (university.showEarly && university.notificationEarly === today);
    console.log(
      university.name,
      university.notificationRegular,
      today,
      isToday
    );
    return isToday;
  };

  const hasDecisionPassed = (university: University) => {
    const now = new Date();
    const defaultTime = "19:00:00"; // 7 PM default

    // Check regular decision date
    const [dayRegular, monthRegular, yearRegular] =
      university.notificationRegular.split("-");
    const targetDateRegular = new Date(
      `20${yearRegular}-${monthRegular}-${dayRegular}T${
        university.time || defaultTime
      }-05:00`
    );

    // Check early decision date if it exists
    let earlyDecisionPassed = false;
    if (university.showEarly && university.notificationEarly) {
      const [dayEarly, monthEarly, yearEarly] =
        university.notificationEarly.split("-");
      const targetDateEarly = new Date(
        `20${yearEarly}-${monthEarly}-${dayEarly}T${
          university.time || defaultTime
        }-05:00`
      );
      earlyDecisionPassed = now > targetDateEarly;
    }

    return (
      now > targetDateRegular && (!university.showEarly || earlyDecisionPassed)
    );
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (showCountdown && selectedUniversityData) {
      const timer = setInterval(() => {
        const now = new Date();
        const defaultTime = "19:00:00"; // 7 PM default

        // Early notification countdown
        if (selectedUniversityData.showEarly) {
          const [dayEarly, monthEarly, yearEarly] =
            selectedUniversityData.notificationEarly.split("-");
          const targetDateEarly = new Date(
            `20${yearEarly}-${monthEarly}-${dayEarly}T${
              selectedUniversityData.time || defaultTime
            }-05:00`
          );
          const differenceEarly = targetDateEarly.getTime() - now.getTime();

          if (differenceEarly > 0) {
            setTimeLeft({
              days: Math.floor(differenceEarly / (1000 * 60 * 60 * 24)),
              hours: Math.floor((differenceEarly / (1000 * 60 * 60)) % 24),
              minutes: Math.floor((differenceEarly / 1000 / 60) % 60),
              seconds: Math.floor((differenceEarly / 1000) % 60),
            });
          }
        }

        // Regular notification countdown
        const [dayRegular, monthRegular, yearRegular] =
          selectedUniversityData.notificationRegular.split("-");
        const targetDateRegular = new Date(
          `20${yearRegular}-${monthRegular}-${dayRegular}T${
            selectedUniversityData.time || defaultTime
          }-05:00`
        );
        const differenceRegular = targetDateRegular.getTime() - now.getTime();

        if (differenceRegular > 0) {
          const timeLeft = calculateTimeLeft(targetDateRegular);
          if (timeLeft) {
            setTimeLeftRegular(timeLeft);
          }
        }
      }, 500);

      return () => clearInterval(timer);
    }
  }, [showCountdown, selectedUniversityData, calculateTimeLeft, mounted]);

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
      // Use View Transitions API
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          router.push("/");
        });
      } else {
        router.push("/");
      }
    }
  };

  // Sort universities by release date and popularity
  const sortUniversities = (universities: University[]) => {
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

    return [...universities].sort((a, b) => {
      const aIsPassed = hasDecisionPassed(a);
      const bIsPassed = hasDecisionPassed(b);

      // Move passed decisions to the end
      if (aIsPassed && !bIsPassed) return 1;
      if (!aIsPassed && bIsPassed) return -1;

      // If both are passed or both are not passed, sort by popularity and date
      const aPopularityIndex = popularUniversities.indexOf(a.domain);
      const bPopularityIndex = popularUniversities.indexOf(b.domain);

      // If both are popular universities
      if (aPopularityIndex !== -1 && bPopularityIndex !== -1) {
        return aPopularityIndex - bPopularityIndex;
      }

      // If only one is popular, prioritize it
      if (aPopularityIndex !== -1) return -1;
      if (bPopularityIndex !== -1) return 1;

      // For non-popular universities, sort by date
      const [dayA, monthA, yearA] = a.notificationRegular.split("-");
      const [dayB, monthB, yearB] = b.notificationRegular.split("-");
      const dateA = new Date(`20${yearA}-${monthA}-${dayA}`);
      const dateB = new Date(`20${yearB}-${monthB}-${dayB}`);

      return dateA.getTime() - dateB.getTime();
    });
  };

  const allUniversities = sortUniversities([
    ...universities,
    ...customUniversities,
  ]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom =
      Math.abs(
        e.currentTarget.scrollHeight -
          e.currentTarget.scrollTop -
          e.currentTarget.clientHeight
      ) < 1;
    setIsBottom(bottom);
  };

  const handleSuggestUniversity = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Normalize the suggestion
      const normalizedSuggestion = normalizeUniversityName(suggestion);

      // Check if the university already exists
      const existingUniversity = universities.find((uni) => {
        const normalizedName = normalizeUniversityName(uni.name);
        return (
          normalizedName.includes(normalizedSuggestion) ||
          normalizedSuggestion.includes(normalizedName)
        );
      });

      if (existingUniversity) {
        toast({
          title: "University Already Listed",
          description: `${existingUniversity.name} is already in our database.`,
          variant: "destructive",
          duration: 5000,
        });
        setIsSubmitting(false);
        return;
      }

      const response = await fetch("/api/suggest-university", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ suggestion }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit suggestion");
      }

      toast({
        title: "Suggestion Sent",
        description:
          "Thank you for suggesting a university. We'll review it soon!",
        duration: 5000,
      });

      setSuggestion("");
      suggestDialogCloseRef.current?.click();
    } catch (error) {
      console.error("Error suggesting university:", error);
      toast({
        title: "Error",
        description: "Failed to submit suggestion. Please try again later.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return null; // or a loading state
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background flex flex-col">
        {!showCountdown ? (
          <>
            {/* Header Section */}
            <div className="py-8">
              <div className="max-w-7xl mx-auto px-6">
                <div className="text-center">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                    Select Your University
                  </h1>
                  <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                    Track countdowns to college decision dates and never miss an
                    important announcement
                  </p>
                </div>
              </div>
            </div>

            {/* Universities Grid */}
            <div className="flex-1 max-w-7xl mx-auto px-6 pb-8 w-full">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {allUniversities.map((university) => {
                  const isPassed = hasDecisionPassed(university);
                  const isToday = isDecisionToday(university);
                  return (
                    <Link
                      href={`/${university.domain}`}
                      className="w-full"
                      key={university.name}
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            key={university.name}
                            onClick={() => {}}
                            className={cn(
                              "relative flex flex-col items-center space-y-3 p-4 rounded-xl border transition-all duration-200 w-full h-36",
                              "hover:bg-accent/50 hover:shadow-lg hover:scale-[1.02] hover:border-primary/30",
                              "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2",
                              selectedUniversity === university.name
                                ? "border-primary bg-primary/10 shadow-lg"
                                : "border-border bg-card/50",
                              isToday &&
                                "border-blue-500 border-2 bg-blue-500/10 shadow-blue-500/20",
                              isPassed &&
                                "opacity-60 hover:opacity-80 border-dashed"
                            )}
                          >
                            {isPassed && (
                              <Badge
                                variant="secondary"
                                className="absolute -top-2 -right-2 text-xs px-2 py-1 bg-muted-foreground/20 text-muted-foreground border-muted-foreground/30 pointer-events-none"
                              >
                                Passed
                              </Badge>
                            )}

                            <Avatar className="h-12 w-12 ring-2 ring-background shadow-sm">
                              <Image
                                src={
                                  university.fileExists
                                    ? `/logos/${university.domain}.jpg`
                                    : `https://logo.clearbit.com/${university.domain}`
                                }
                                alt={`${university.name} logo`}
                                width={48}
                                height={48}
                                className={cn(
                                  "rounded-full object-cover",
                                  isPassed && "grayscale"
                                )}
                                loading="lazy"
                              />
                              <AvatarFallback className="text-sm font-semibold">
                                {university.name
                                  .split(" ")
                                  .map((word) => word[0])
                                  .join("")
                                  .slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>

                            <div className="text-center w-full">
                              <span className="text-sm font-medium leading-tight block">
                                {university.name}
                              </span>
                              {isToday && (
                                <span className="block text-blue-500 text-xs mt-1 animate-pulse">
                                  🎉 Today!
                                </span>
                              )}
                            </div>
                          </button>
                        </TooltipTrigger>
                        {isPassed && (
                          <TooltipContent>
                            <p>
                              Decision date has passed on{" "}
                              {university.notificationRegular}
                            </p>
                            {university.showEarly && (
                              <p>
                                Early decision date:{" "}
                                {university.notificationEarly}
                              </p>
                            )}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </Link>
                  );
                })}

                <Dialog>
                  <DialogTrigger asChild>
                    <button className="flex flex-col items-center justify-center space-y-3 p-4 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-accent/50 transition-all duration-200 w-full h-28 group">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <span className="text-2xl">🎓</span>
                      </div>
                      <span className="text-sm font-medium text-center group-hover:text-primary transition-colors">
                        Suggest a University
                      </span>
                    </button>
                  </DialogTrigger>

                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Suggest a University</DialogTitle>
                      <DialogDescription>
                        Help us expand our database by suggesting a university
                        to add.
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      onSubmit={handleSuggestUniversity}
                      className="grid gap-4 py-4"
                    >
                      <div className="grid gap-2">
                        <Label htmlFor="suggestion">
                          University Name or Domain
                        </Label>
                        <Input
                          id="suggestion"
                          placeholder="e.g., Stanford University or stanford.edu"
                          value={suggestion}
                          onChange={(e) => setSuggestion(e.target.value)}
                          required
                        />
                      </div>
                      <DialogClose
                        ref={suggestDialogCloseRef}
                        className="hidden"
                      />
                      <Button
                        type="submit"
                        disabled={!suggestion || isSubmitting}
                        className="w-full"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Suggestion"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
            {selectedUniversityData && (
              <div className="text-center mb-12">
                <Avatar className="h-24 w-24 mx-auto mb-6 ring-4 ring-primary/20 shadow-xl">
                  <AvatarImage
                    src={`/logos/${selectedUniversityData.domain}.jpg`}
                    alt={`${selectedUniversityData.name} logo`}
                  />
                  <AvatarFallback className="text-3xl font-bold">
                    {selectedUniversityData.name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  {selectedUniversityData.name}
                </h1>
                <Tooltip>
                  {selectedUniversityData.notConfirmedDate && (
                    <TooltipTrigger>
                      <Badge
                        className="rounded-full text-sm px-4 py-2 bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20 transition-colors"
                        variant="secondary"
                      >
                        ⚠️ Dates not confirmed
                      </Badge>
                    </TooltipTrigger>
                  )}
                  <TooltipContent>
                    <p>
                      I have not confirmed the dates for this university yet. If
                      you know the dates, please let me know so I can add them.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}

            {selectedUniversityData?.showEarly && (
              <section className="w-full max-w-4xl mb-12">
                <h2 className="text-2xl font-bold mb-8 text-center text-blue-600">
                  Early Decision 2 Countdown
                </h2>
                <div className="grid grid-cols-4 gap-4 text-center">
                  {[
                    { value: timeLeft.days, label: "Days" },
                    { value: timeLeft.hours, label: "Hours" },
                    { value: timeLeft.minutes, label: "Minutes" },
                    { value: timeLeft.seconds, label: "Seconds" },
                  ].map(({ value, label }) => (
                    <div
                      key={label}
                      className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-6 rounded-2xl border border-blue-500/20 shadow-lg backdrop-blur-sm"
                    >
                      <CountdownNumber
                        value={value}
                        isUrgent={isTimeUrgent(timeLeft)}
                      />
                      <div className="text-lg font-semibold text-blue-600 mt-3">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="w-full max-w-4xl mb-12">
              <h2 className="text-2xl font-bold mb-8 text-center text-foreground">
                Regular Decision Countdown
              </h2>
              <div className="grid grid-cols-4 gap-4 text-center">
                {[
                  { value: timeLeftRegular.days, label: "Days" },
                  { value: timeLeftRegular.hours, label: "Hours" },
                  { value: timeLeftRegular.minutes, label: "Minutes" },
                  { value: timeLeftRegular.seconds, label: "Seconds" },
                ].map(({ value, label }) => (
                  <div
                    key={label}
                    className="bg-gradient-to-br from-primary/10 to-primary/20 p-6 rounded-2xl border border-primary/20 shadow-lg backdrop-blur-sm"
                  >
                    <CountdownNumber
                      value={value}
                      isUrgent={isTimeUrgent(timeLeftRegular)}
                    />
                    <div className="text-lg font-semibold text-primary mt-3">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="w-full max-w-4xl space-y-6">
              <CalendarButtons
                title={`${selectedUniversityData?.name} Regular`}
                date={selectedUniversityData?.notificationRegular || ""}
                time={selectedUniversityData?.time || ""}
                className="w-full"
              />
              <Button
                onClick={handleBack}
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                size="lg"
              >
                ← Back to Selection
              </Button>
            </div>
          </div>
        )}

        <footer className="mt-auto py-8 border-t border-border/50 bg-muted/30">
          <div className="max-w-7xl mx-auto px-6">
            {showProductHuntBadge && (
              <div className="text-center mb-6">
                <a
                  href="https://www.producthunt.com/posts/usa-university-countdown?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-usa&#0045;university&#0045;countdown"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=819313&theme=neutral&t=1737822372083"
                    alt="USA University Countdown - College application decision dates | Product Hunt"
                    width={250}
                    height={54}
                    unoptimized
                  />
                </a>
              </div>
            )}
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex items-center gap-2">
                <span>Made with</span>
                <span className="text-red-500 animate-pulse">❤️</span>
                <span>by</span>
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
                © {new Date().getFullYear()} CollegeDecision.us All rights
                reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}
