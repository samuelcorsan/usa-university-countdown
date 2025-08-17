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
import { CalendarButtons } from "./CalendarButtons";
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
      <div className="h-full flex flex-col items-center justify-center bg-background relative">
        <div className="bg-card p-8 rounded-lg shadow-md w-[90%] md:w-full max-w-4xl border border-border">
          {!showCountdown ? (
            <>
              <h1 className="text-2xl font-bold  text-center">
                Select Your University
              </h1>
              <div className="relative mt-4">
                <div
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4 max-h-[65vh] overflow-y-auto"
                  onScroll={handleScroll}
                >
                  {allUniversities.map((university) => {
                    const isPassed = hasDecisionPassed(university);
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
                                "flex items-center space-x-2 p-2 rounded-lg border transition-colors w-full",
                                "hover:bg-accent",
                                selectedUniversity === university.name
                                  ? "border-primary bg-primary/10"
                                  : "border-border",
                                isDecisionToday(university) &&
                                  "border-blue-500 border-dashed bg-blue-500/10",
                                isPassed &&
                                  "opacity-50 hover:opacity-75 border-dashed "
                              )}
                            >
                              <Avatar className="h-6 w-6">
                                <Image
                                  src={
                                    university.fileExists
                                      ? `/logos/${university.domain}.jpg`
                                      : `https://logo.clearbit.com/${university.domain}`
                                  }
                                  alt={`${university.name} logo`}
                                  width={24}
                                  height={24}
                                  className={cn(
                                    "rounded-full bg-primary",
                                    isPassed && "grayscale"
                                  )}
                                  loading="lazy"
                                />
                                <AvatarFallback>
                                  {university.name
                                    .split(" ")
                                    .map((word) => word[0])
                                    .join("")
                                    .slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm truncate">
                                {university.name}
                                {isDecisionToday(university) && " 🎉"}
                                {isPassed && " (Passed)"}
                              </span>
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
                      <button className="flex items-center justify-center space-x-2 p-2 rounded-lg border border-dashed border-border hover:border-foreground hover:bg-accent transition-colors w-full">
                        <span className="text-sm">🎓 Suggest a University</span>
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
                        >
                          {isSubmitting ? "Submitting..." : "Submit Suggestion"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Mobile scroll indicator - hidden when at bottom */}
                {!isBottom && (
                  <div className="md:hidden absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-card to-transparent pointer-events-none flex items-end justify-center pb-2">
                    <span className="text-muted-foreground text-sm animate-bounce">
                      Scroll for more universities ↓
                    </span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {selectedUniversityData && (
                <div className="flex items-center justify-center mb-6 space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={`/logos/${selectedUniversityData.domain}.jpg`}
                      alt={`${selectedUniversityData.name} logo`}
                    />
                    <AvatarFallback>
                      {selectedUniversityData.name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <h1 className="text-2xl font-bold text-center">
                      {selectedUniversityData.name}
                    </h1>
                    <Tooltip>
                      {selectedUniversityData.notConfirmedDate && (
                        <TooltipTrigger>
                          <Badge
                            className="rounded-full text-sm mt-1"
                            variant="destructive"
                          >
                            ⚠️ Dates have not been confirmed
                          </Badge>
                        </TooltipTrigger>
                      )}
                      <TooltipContent>
                        <p>
                          I have not confirmed the dates for this university
                          yet. If you know the dates, please let me know so I
                          can add them.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              )}
              {selectedUniversityData?.showEarly && (
                <section className="flex flex-col items-center justify-center">
                  <h2 className="text-xl font-semibold mb-4 text-center">
                    Early Decision 2 Countdown
                  </h2>
                  <div className="grid grid-cols-4 gap-2 text-center mb-6 w-fit justify-center items-center">
                    <div className="bg-accent p-2 rounded w-full">
                      <CountdownNumber
                        value={timeLeft.days}
                        isUrgent={isTimeUrgent(timeLeft)}
                      />
                      <div className="text-sm">Days</div>
                    </div>
                    <div className="bg-accent p-2 rounded w-full">
                      <CountdownNumber
                        value={timeLeft.hours}
                        isUrgent={isTimeUrgent(timeLeft)}
                      />
                      <div className="text-sm">Hours</div>
                    </div>
                    <div className="bg-accent p-2 rounded w-full">
                      <CountdownNumber
                        value={timeLeft.minutes}
                        isUrgent={isTimeUrgent(timeLeft)}
                      />
                      <div className="text-sm">Minutes</div>
                    </div>
                    <div className="bg-accent p-2 rounded w-full">
                      <CountdownNumber
                        value={timeLeft.seconds}
                        isUrgent={isTimeUrgent(timeLeft)}
                      />
                      <div className="text-sm">Seconds</div>
                    </div>
                  </div>
                </section>
              )}
              <section className="flex flex-col items-center justify-center">
                <h2 className="text-xl font-semibold mb-4 text-center">
                  Regular Decision Countdown
                </h2>
                <div className="grid grid-cols-4 gap-2 text-center mb-6 w-fit justify-center items-center">
                  <div className="bg-accent p-2 rounded w-full">
                    <CountdownNumber
                      value={timeLeftRegular.days}
                      isUrgent={isTimeUrgent(timeLeftRegular)}
                    />
                    <div className="text-sm">Days</div>
                  </div>
                  <div className="bg-accent p-2 rounded w-full">
                    <CountdownNumber
                      value={timeLeftRegular.hours}
                      isUrgent={isTimeUrgent(timeLeftRegular)}
                    />
                    <div className="text-sm">Hours</div>
                  </div>
                  <div className="bg-accent p-2 rounded w-full">
                    <CountdownNumber
                      value={timeLeftRegular.minutes}
                      isUrgent={isTimeUrgent(timeLeftRegular)}
                    />
                    <div className="text-sm">Minutes</div>
                  </div>
                  <div className="bg-accent p-2 rounded w-full">
                    <CountdownNumber
                      value={timeLeftRegular.seconds}
                      isUrgent={isTimeUrgent(timeLeftRegular)}
                    />
                    <div className="text-sm">Seconds</div>
                  </div>
                </div>
              </section>

              <CalendarButtons
                title={`${selectedUniversityData?.name} Regular`}
                date={selectedUniversityData?.notificationRegular || ""}
                time={selectedUniversityData?.time || ""}
                className="w-full mb-6"
              />
              <Button onClick={handleBack} className="w-full">
                Back to Selection
              </Button>
            </>
          )}
        </div>
        <footer className="mt-8 mb-4 flex flex-col items-center gap-4 text-sm text-muted-foreground">
          {showProductHuntBadge && (
            <a
              href="https://www.producthunt.com/posts/usa-university-countdown?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-usa&#0045;university&#0045;countdown"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-4"
            >
              <Image
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=819313&theme=neutral&t=1737822372083"
                alt="USA University Countdown - College application decision dates | Product Hunt"
                width={250}
                height={54}
                unoptimized
              />
            </a>
          )}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1">
              Made with ❤️ by{" "}
              <Link
                href="https://mrlol.dev"
                target="_blank"
                className="font-medium text-primary hover:underline"
              >
                Leo
              </Link>{" "}
              from <span className="inline-flex items-center gap-1">🇪🇸</span>
            </div>
            <div>
              © {new Date().getFullYear()} CollegeDecision.us All rights
              reserved.
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}
