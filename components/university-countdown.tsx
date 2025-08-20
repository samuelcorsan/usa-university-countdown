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
  const [timeLeftApplicationEarly, setTimeLeftApplicationEarly] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [timeLeftApplicationRegular, setTimeLeftApplicationRegular] = useState({
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

      // Parse notification dates (mm-dd-yy format)
      if (university.showEarly) {
        const [monthEarly, dayEarly, yearEarly] =
          university.notificationEarly.split("-");
        const targetDateEarly = new Date(
          `20${yearEarly}-${monthEarly}-${dayEarly}T${
            university.time || defaultTime
          }-05:00`
        );
        const differenceEarly = targetDateEarly.getTime() - now.getTime();

        if (differenceEarly > 0) {
          setTimeLeftApplicationEarly({
            days: Math.floor(differenceEarly / (1000 * 60 * 60 * 24)),
            hours: Math.floor((differenceEarly / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((differenceEarly / 1000 / 60) % 60),
            seconds: Math.floor((differenceEarly / 1000) % 60),
          });
        }
      }

      const [monthRegular, dayRegular, yearRegular] =
        university.notificationRegular.split("-");
      const targetDateRegular = new Date(
        `20${yearRegular}-${monthRegular}-${dayRegular}T${
          university.time || defaultTime
        }-05:00`
      );
      const differenceRegular = targetDateRegular.getTime() - now.getTime();

      if (differenceRegular > 0) {
        const timeLeft = calculateTimeLeft(targetDateRegular);
        if (timeLeft) {
          setTimeLeftApplicationRegular(timeLeft);
        }
      }

      // Parse application dates (mm-dd-yy format)
      if (university.applicationEarly) {
        const [monthEarly, dayEarly, yearEarly] =
          university.applicationEarly.split("-");
        const targetDateApplicationEarly = new Date(
          `20${yearEarly}-${monthEarly}-${dayEarly}T${defaultTime}-05:00`
        );
        const differenceApplicationEarly =
          targetDateApplicationEarly.getTime() - now.getTime();

        if (differenceApplicationEarly > 0) {
          const timeLeft = calculateTimeLeft(targetDateApplicationEarly);
          if (timeLeft) {
            setTimeLeftApplicationEarly(timeLeft);
          }
        }
      }

      if (university.applicationRegular) {
        const [monthRegular, dayRegular, yearRegular] =
          university.applicationRegular.split("-");
        const targetDateApplicationRegular = new Date(
          `20${yearRegular}-${monthRegular}-${dayRegular}T${defaultTime}-05:00`
        );
        const differenceApplicationRegular =
          targetDateApplicationRegular.getTime() - now.getTime();

        if (differenceApplicationRegular > 0) {
          const timeLeft = calculateTimeLeft(targetDateApplicationRegular);
          if (timeLeft) {
            setTimeLeftApplicationRegular(timeLeft);
          }
        }
      }
    }, 500);

    return () => clearInterval(timer);
  }, [university, calculateTimeLeft]);

  return (
    <>
      <div className="bg-background flex flex-col">
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
            <div className="text-center mb-4">
              <Avatar className="h-24 w-24 mx-auto mb-4 ring-2 ring-primary/20 shadow-lg">
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

              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
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
                    I have not confirmed the application deadline dates for this
                    university yet. If you know the dates, please let me know so
                    I can add them.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          <div className="w-full max-w-4xl space-y-8">
            {/* Application Deadlines */}
            <div className="rounded-2xl p-8">
              {university.applicationEarly && (
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center text-foreground">
                    Early Application Deadline
                  </h2>
                  <div className="grid grid-cols-4 gap-8">
                    <TimeUnit
                      value={timeLeftApplicationEarly.days}
                      label="Days"
                    />
                    <TimeUnit
                      value={timeLeftApplicationEarly.hours}
                      label="Hours"
                    />
                    <TimeUnit
                      value={timeLeftApplicationEarly.minutes}
                      label="Minutes"
                    />
                    <TimeUnit
                      value={timeLeftApplicationEarly.seconds}
                      label="Seconds"
                    />
                  </div>
                </div>
              )}

              {university.applicationRegular && (
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center text-foreground">
                    Regular Application Deadline
                  </h2>
                  <div className="grid grid-cols-4 gap-8">
                    <TimeUnit
                      value={timeLeftApplicationRegular.days}
                      label="Days"
                    />
                    <TimeUnit
                      value={timeLeftApplicationRegular.hours}
                      label="Hours"
                    />
                    <TimeUnit
                      value={timeLeftApplicationRegular.minutes}
                      label="Minutes"
                    />
                    <TimeUnit
                      value={timeLeftApplicationRegular.seconds}
                      label="Seconds"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-full max-w-4xl space-y-6 mt-12">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Add to Calendar
              </h3>
              <CalendarButtons
                title={`${university.name} Early Application`}
                date={university.applicationEarly || ""}
                time="19:00"
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
