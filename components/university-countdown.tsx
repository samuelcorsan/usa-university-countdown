"use client";

import { useState, useEffect, useCallback } from "react";
import { University } from "@/data/universities";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarButtons } from "./calendar-buttons";
import { Footer } from "./footer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UniversityCountdownProps {
  university: University;
  onBack: () => void;
}

const TimeUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="text-center">
    <div className="text-3xl font-bold text-foreground mb-1">
      {value.toString().padStart(2, "0")}
    </div>
    <div className="text-sm text-muted-foreground font-medium">{label}</div>
  </div>
);

export function UniversityCountdown({
  university,
  onBack,
}: UniversityCountdownProps) {
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

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const defaultTime = "19:00:00";

      if (university.showEarly) {
        const [dayEarly, monthEarly, yearEarly] =
          university.notificationEarly.split("-");
        const targetDateEarly = new Date(
          `20${yearEarly}-${monthEarly}-${dayEarly}T${
            university.time || defaultTime
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

      const [monthRegular, yearRegular] =
        university.notificationRegular.split("-");
      const targetDateRegular = new Date(
        `20${yearRegular}-${monthRegular}-${yearRegular}T${
          university.time || defaultTime
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
  }, [university, calculateTimeLeft]);

  return (
    <>
      <div className="min-h-screen bg-background flex flex-col">
        <div className="absolute top-6 left-6 z-10">
          <Button
            onClick={onBack}
            size="default"
            className="bg-secondary hover:bg-secondary/80 text-secondary-foreground border-secondary shadow-sm transition-all duration-200 hover:shadow-md px-4 py-2"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </Button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          <TooltipProvider>
            <div className="text-center mb-12">
              <Avatar className="h-20 w-20 mx-auto mb-4 ring-2 ring-primary/20 shadow-lg">
                <AvatarImage
                  src={`/logos/${university.domain}.jpg`}
                  alt={`${university.name} logo`}
                />
                <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                  {university.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                {university.name}
              </h1>

              <Tooltip>
                {university.notConfirmedDate && (
                  <TooltipTrigger>
                    <Badge
                      className="rounded-full text-xs px-3 py-1 bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20 transition-colors"
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
          </TooltipProvider>

          <div className="w-full max-w-4xl space-y-8">
            {university.showEarly && (
              <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 dark:from-blue-400/20 dark:to-blue-500/20 rounded-2xl p-8 border border-blue-200/30 dark:border-blue-700/30">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-blue-700 dark:text-blue-300">
                  Early Decision 2 Countdown
                </h2>
                <div className="grid grid-cols-4 gap-8">
                  <TimeUnit value={timeLeft.days} label="Days" />
                  <TimeUnit value={timeLeft.hours} label="Hours" />
                  <TimeUnit value={timeLeft.minutes} label="Minutes" />
                  <TimeUnit value={timeLeft.seconds} label="Seconds" />
                </div>
              </div>
            )}

            <div className="bg-gradient-to-r from-muted/30 to-muted/50 dark:from-muted/20 dark:to-muted/40 rounded-2xl p-8 border border-border/30">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-foreground">
                Regular Decision Countdown
              </h2>
              <div className="grid grid-cols-4 gap-8">
                <TimeUnit value={timeLeftRegular.days} label="Days" />
                <TimeUnit value={timeLeftRegular.hours} label="Hours" />
                <TimeUnit value={timeLeftRegular.minutes} label="Minutes" />
                <TimeUnit value={timeLeftRegular.seconds} label="Seconds" />
              </div>
            </div>
          </div>

          <div className="w-full max-w-2xl space-y-6 mt-8">
            <div className="bg-card rounded-2xl p-8 border-2 border-border shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-card-foreground mb-2">
                  Add to Calendar
                </h3>
                <p className="text-sm text-muted-foreground">
                  Get notified when {university.name} releases decisions
                </p>
              </div>
              <CalendarButtons
                title={`${university.name} Regular Decision`}
                date={university.notificationRegular || ""}
                time={university.time || ""}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
