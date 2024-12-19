"use client";

import { useState, useEffect, useRef } from "react";
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
import universities from "@/universities";
import { University } from "@/universities";
import { CalendarButtons } from "./CalendarButtons";

function CountdownNumber({ value }: { value: number }) {
  const displayValue = value.toString().padStart(2, "0");

  return (
    <div className="flex justify-center space-x-[1px]">
      {displayValue.split("").map((digit, index) => (
        <div key={index} className="relative h-[36px] w-[28px] overflow-hidden">
          <div
            className="absolute w-full transition-transform duration-300 flex flex-col"
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
  const [newUniversity, setNewUniversity] = useState({
    name: "",
    domain: "",
    notificationEarly: "",
    notificationRegular: "",
  });
  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  const selectedUniversityData = universities.find(
    (uni) => uni.name === selectedUniversity
  );

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
        const [dayEarly, monthEarly, yearEarly] =
          selectedUniversityData.notificationEarly.split("-");
        const targetDateEarly = new Date(
          `20${yearEarly}-${monthEarly}-${dayEarly}T${
            selectedUniversityData.time || defaultTime
          }-05:00`
        );
        const differenceEarly = targetDateEarly.getTime() - now.getTime();

        // Regular notification countdown
        const [dayRegular, monthRegular, yearRegular] =
          selectedUniversityData.notificationRegular.split("-");
        const targetDateRegular = new Date(
          `20${yearRegular}-${monthRegular}-${dayRegular}T${
            selectedUniversityData.time || defaultTime
          }-05:00`
        );
        const differenceRegular = targetDateRegular.getTime() - now.getTime();

        if (differenceEarly > 0) {
          setTimeLeft({
            days: Math.floor(differenceEarly / (1000 * 60 * 60 * 24)),
            hours: Math.floor((differenceEarly / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((differenceEarly / 1000 / 60) % 60),
            seconds: Math.floor((differenceEarly / 1000) % 60),
          });
        }

        if (differenceRegular > 0) {
          setTimeLeftRegular({
            days: Math.floor(differenceRegular / (1000 * 60 * 60 * 24)),
            hours: Math.floor((differenceRegular / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((differenceRegular / 1000 / 60) % 60),
            seconds: Math.floor((differenceRegular / 1000) % 60),
          });
        }
      }, 500);

      return () => clearInterval(timer);
    }
  }, [showCountdown, selectedUniversityData, mounted]);

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
  }, [initialDomain, mounted, customUniversities]);

  const handleSelectUniversity = (value: string) => {
    setSelectedUniversity(value);
    const university = [...universities, ...customUniversities].find(
      (uni) => uni.name === value
    );
    if (university && !initialDomain) {
      const cleanDomain = university.domain
        .replace(/^https?:\/\//, "")
        .replace(/^www\./, "")
        .replace(/\/+$/, "");

      // Use View Transitions API
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          router.push(`/${cleanDomain}`);
        });
      } else {
        router.push(`/${cleanDomain}`);
      }
    }
  };

  const handleNext = () => {
    if (selectedUniversity) {
      localStorage.setItem("selectedUniversity", selectedUniversity);

      // Use View Transitions API
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          setShowCountdown(true);
        });
      } else {
        setShowCountdown(true);
      }
    }
  };

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

  const handleAddUniversity = () => {
    if (!newUniversity.notificationEarly || !newUniversity.notificationRegular)
      return;

    const cleanDomain = (domain: string) => {
      return domain
        .replace(/^https?:\/\//, "")
        .replace(/^www\./, "")
        .replace(/\/+$/, "")
        .trim();
    };

    const updated = [
      ...customUniversities,
      {
        ...newUniversity,
        domain: cleanDomain(newUniversity.domain),
        fileExists: false,
      },
    ];

    setCustomUniversities(updated);
    localStorage.setItem("customUniversities", JSON.stringify(updated));
    setNewUniversity({
      name: "",
      domain: "",
      notificationEarly: "",
      notificationRegular: "",
    });

    dialogCloseRef.current?.click();
  };

  const allUniversities = [...universities, ...customUniversities];

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    domain: string,
    universityName: string
  ) => {
    const target = e.target as HTMLImageElement;

    // Try Clearbit as first fallback
    target.src = `https://logo.clearbit.com/${domain}`;

    // If Clearbit fails, use UI Avatars as final fallback
    target.onerror = () => {
      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        universityName
      )}&background=random`;
      target.onerror = null; // Prevent infinite loop
    };
  };

  if (!mounted) {
    return null; // or a loading state
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col items-center justify-center bg-background relative">
        <div className="bg-card p-8 rounded-lg shadow-md w-[90%] md:w-full max-w-4xl border border-border">
          {!showCountdown ? (
            <>
              <h1 className="text-2xl font-bold mb-6 text-center">
                Select Your University
              </h1>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                {allUniversities.map((university) => (
                  <button
                    key={university.name}
                    onClick={() => {
                      handleSelectUniversity(university.name);
                    }}
                    className={cn(
                      "flex items-center space-x-2 p-2 rounded-lg border transition-colors",
                      "hover:bg-accent",
                      selectedUniversity === university.name
                        ? "border-primary bg-primary/10"
                        : "border-border"
                    )}
                  >
                    <Image
                      src={
                        university.fileExists
                          ? `/logos/${university.domain}.jpg`
                          : `https://logo.clearbit.com/${university.domain}`
                      }
                      alt={`${university.name} logo`}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span className="text-sm truncate">{university.name}</span>
                  </button>
                ))}

                <Dialog>
                  <DialogTrigger asChild>
                    {/**  <button className="flex items-center justify-center space-x-2 p-2 rounded-lg border border-dashed border-border hover:border-foreground hover:bg-accent transition-colors">
                    <span className="text-sm">+ Add University</span>
                  </button>
                  */}
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New University</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">University Name</Label>
                        <Input
                          id="name"
                          value={newUniversity.name}
                          onChange={(e) =>
                            setNewUniversity({
                              ...newUniversity,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="domain">
                          Domain (e.g., harvard.edu)
                        </Label>
                        <Input
                          id="domain"
                          value={newUniversity.domain}
                          onChange={(e) =>
                            setNewUniversity({
                              ...newUniversity,
                              domain: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Early Decision Date (DD-MM-YY)</Label>
                        <Input
                          placeholder="15-12-24"
                          value={newUniversity.notificationEarly}
                          onChange={(e) =>
                            setNewUniversity({
                              ...newUniversity,
                              notificationEarly: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Regular Decision Date (DD-MM-YY)</Label>
                        <Input
                          placeholder="28-03-25"
                          value={newUniversity.notificationRegular}
                          onChange={(e) =>
                            setNewUniversity({
                              ...newUniversity,
                              notificationRegular: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <DialogClose ref={dialogCloseRef} className="hidden" />
                    <Button
                      onClick={handleAddUniversity}
                      disabled={
                        !newUniversity.name ||
                        !newUniversity.domain ||
                        !newUniversity.notificationEarly ||
                        !newUniversity.notificationRegular
                      }
                    >
                      Add University
                    </Button>
                  </DialogContent>
                </Dialog>
              </div>
            </>
          ) : (
            <>
              {selectedUniversityData && (
                <div className="flex items-center justify-center mb-6 space-x-4">
                  <Image
                    src={`/logos/${selectedUniversityData.domain}.jpg`}
                    alt={`${selectedUniversityData.name} logo`}
                    width={64}
                    height={64}
                    className="rounded-full"
                    onError={(e) =>
                      handleImageError(
                        e,
                        selectedUniversityData.domain,
                        selectedUniversityData.name
                      )
                    }
                  />
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
              {/**
              <h2 className="text-xl font-semibold mb-4 text-center">
                Early Decision/Action Countdown
              </h2>
              <div className="grid grid-cols-4 gap-2 text-center mb-6">
                <div className="bg-accent p-2 rounded ">
                  <CountdownNumber value={timeLeft.days} />
                  <div className="text-sm">Days</div>
                </div>
                <div className="bg-accent p-2 rounded">
                  <CountdownNumber value={timeLeft.hours} />
                  <div className="text-sm">Hours</div>
                </div>
                <div className="bg-accent p-2 rounded">
                  <CountdownNumber value={timeLeft.minutes} />
                  <div className="text-sm">Minutes</div>
                </div>
                <div className="bg-accent p-2 rounded">
                  <CountdownNumber value={timeLeft.seconds} />
                  <div className="text-sm">Seconds</div>
                </div>
              </div>
              */}
              <section className="flex flex-col items-center justify-center">
                <h2 className="text-xl font-semibold mb-4 text-center">
                  Regular Decision Countdown
                </h2>
                <div className="grid grid-cols-4 gap-2 text-center mb-6 w-fit justify-center items-center">
                  <div className="bg-accent p-2 rounded w-full">
                    <CountdownNumber value={timeLeftRegular.days} />
                    <div className="text-sm">Days</div>
                  </div>
                  <div className="bg-accent p-2 rounded w-full">
                    <CountdownNumber value={timeLeftRegular.hours} />
                    <div className="text-sm">Hours</div>
                  </div>
                  <div className="bg-accent p-2 rounded w-full">
                    <CountdownNumber value={timeLeftRegular.minutes} />
                    <div className="text-sm">Minutes</div>
                  </div>
                  <div className="bg-accent p-2 rounded w-full">
                    <CountdownNumber value={timeLeftRegular.seconds} />
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
        <footer className="mt-8 mb-4 text-sm text-muted-foreground">
          Made with ❤️ by{" "}
          <Link
            href="https://linkedin.com/in/leonardo-ollero"
            target="_blank"
            className="font-medium text-primary hover:underline"
          >
            Leo
          </Link>
        </footer>
      </div>
    </TooltipProvider>
  );
}
