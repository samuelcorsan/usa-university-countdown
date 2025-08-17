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
import { cn } from "@/lib/utils";

interface UniversityCountdownProps {
  university: University;
  onBack: () => void;
}

const CountdownNumber = ({ value, isUrgent }: { value: number; isUrgent?: boolean }) => {
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
};

export function UniversityCountdown({ university, onBack }: UniversityCountdownProps) {
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

  const isTimeUrgent = (timeLeft: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }) => {
    return timeLeft.days === 0 && timeLeft.hours === 0;
  };

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

      const [dayRegular, monthRegular, yearRegular] =
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
          setTimeLeftRegular(timeLeft);
        }
      }
    }, 500);

    return () => clearInterval(timer);
  }, [university, calculateTimeLeft]);

  return (
    <>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <TooltipProvider>
          <div className="text-center mb-12">
            <Avatar className="h-24 w-24 mx-auto mb-6 ring-4 ring-primary/20 shadow-xl">
              <AvatarImage
                src={`/logos/${university.domain}.jpg`}
                alt={`${university.name} logo`}
              />
              <AvatarFallback className="text-3xl font-bold">
                {university.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {university.name}
            </h1>
            <Tooltip>
              {university.notConfirmedDate && (
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
        </TooltipProvider>

        {university.showEarly && (
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
            title={`${university.name} Regular`}
            date={university.notificationRegular || ""}
            time={university.time || ""}
            className="w-full"
          />
          <Button
            onClick={onBack}
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
            size="lg"
          >
            ← Back to Selection
          </Button>
        </div>
      </div>

      <Footer />
    </>
  );
}
