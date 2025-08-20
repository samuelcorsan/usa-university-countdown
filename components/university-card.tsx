"use client";

import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { University } from "@/data/universities";
import { cn } from "@/lib/utils";

interface UniversityCardProps {
  university: University;
  onSelect: (universityName: string) => void;
}

export function UniversityCard({ university, onSelect }: UniversityCardProps) {
  const now = new Date();
  const today = `${(now.getMonth() + 1).toString().padStart(2, "0")}-${now
    .getDate()
    .toString()
    .padStart(2, "0")}-${now.getFullYear().toString().slice(-2)}`;

  const isToday =
    university.applicationRegular === today ||
    (university.showEarly && university.applicationEarly === today);

  const defaultTime = "19:00:00";

  if (!university.applicationRegular) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full">
              <button
                className="relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 w-full h-36 border-dashed border-muted-foreground/30 bg-muted/20 cursor-not-allowed"
                disabled
              >
                <div className="flex flex-col items-center space-y-3">
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
                      className={cn("rounded-full object-cover w-full h-full")}
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
                    <span className="block text-muted-foreground text-xs mt-1">
                      ⚠️ Dates not confirmed
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Application deadline dates have not been confirmed for this
              university yet.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  const [monthRegular, dayRegular, yearRegular] =
    university.applicationRegular.split("-");

  if (
    !monthRegular ||
    !dayRegular ||
    !yearRegular ||
    isNaN(parseInt(monthRegular)) ||
    isNaN(parseInt(dayRegular)) ||
    isNaN(parseInt(yearRegular))
  ) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full">
              <button
                className="relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 w-full h-36 border-dashed border-muted-foreground/30 bg-muted/20 cursor-not-allowed"
                disabled
              >
                <div className="flex flex-col items-center space-y-3">
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
                      className={cn("rounded-full object-cover w-full h-full")}
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
                    <span className="block text-muted-foreground text-xs mt-1">
                      ⚠️ Invalid date format
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Application deadline date format is invalid for this university.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  const targetDateRegular = new Date(
    `20${yearRegular}-${monthRegular}-${dayRegular}T${
      university.time || defaultTime
    }-05:00`
  );

  let earlyDecisionPassed = false;
  if (university.showEarly && university.applicationEarly) {
    const [monthEarly, dayEarly, yearEarly] =
      university.applicationEarly.split("-");

    if (
      monthEarly &&
      dayEarly &&
      yearEarly &&
      !isNaN(parseInt(monthEarly)) &&
      !isNaN(parseInt(dayEarly)) &&
      !isNaN(parseInt(yearEarly))
    ) {
      const targetDateEarly = new Date(
        `20${yearEarly}-${monthEarly}-${dayEarly}T${
          university.time || defaultTime
        }-05:00`
      );
      earlyDecisionPassed = now > targetDateEarly;
    }
  }

  const isPassed =
    now > targetDateRegular && (!university.showEarly || earlyDecisionPassed);

  const formatDate = (dateString: string) => {
    try {
      const [month, day, year] = dateString.split("-");
      const date = new Date(`20${year}-${month}-${day}`);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  const getTooltipText = () => {
    const regularDate = formatDate(university.applicationRegular);

    if (now > targetDateRegular) {
      return `Application deadline passed on ${regularDate}`;
    } else {
      return `Application deadline: ${regularDate}`;
    }
  };

  const hexToRgba = (hex: string, alpha: number) => {
    const normalized = hex.replace("#", "");
    const r = parseInt(normalized.substring(0, 2), 16);
    const g = parseInt(normalized.substring(2, 4), 16);
    const b = parseInt(normalized.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const gradientAlpha = isPassed ? 0.06 : isToday ? 0.25 : 0.2;
  const inlineGradientStyle = university.gradient
    ? {
        backgroundImage: `linear-gradient(135deg, ${hexToRgba(
          university.gradient.from,
          gradientAlpha
        )}, ${hexToRgba(university.gradient.to, gradientAlpha)})`,
      }
    : undefined;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={`/${university.domain}`} className="w-full">
            <button
              onClick={() => onSelect(university.name)}
              className={cn(
                "relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 w-full h-36",
                "hover:bg-accent/50 hover:shadow-lg hover:scale-[1.02] hover:border-primary/30",
                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2",
                "border-border bg-card/50",
                isToday &&
                  "border-blue-500 border-2 bg-blue-500/10 shadow-blue-500/20",
                isPassed && "border-dashed"
              )}
              style={inlineGradientStyle}
            >
              {isPassed && (
                <Badge
                  variant="secondary"
                  className="absolute -top-2 -right-2 z-10 text-xs px-2 py-1 bg-muted-foreground/20 text-muted-foreground border-muted-foreground/30 pointer-events-none"
                >
                  Passed
                </Badge>
              )}

              <div className="flex flex-col items-center space-y-3">
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
                    className={cn("rounded-full object-cover w-full h-full")}
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
              </div>
            </button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
