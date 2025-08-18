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
  const today = `${now.getDate().toString().padStart(2, "0")}-${(
    now.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${now.getFullYear().toString().slice(-2)}`;

  const isToday =
    university.notificationRegular === today ||
    (university.showEarly && university.notificationEarly === today);

  const defaultTime = "19:00:00";
  const [dayRegular, monthRegular, yearRegular] =
    university.notificationRegular.split("-");
  const targetDateRegular = new Date(
    `20${yearRegular}-${monthRegular}-${dayRegular}T${
      university.time || defaultTime
    }-05:00`
  );

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

  const isPassed =
    now > targetDateRegular && (!university.showEarly || earlyDecisionPassed);

  const formatDate = (dateString: string) => {
    const [day, month, year] = dateString.split("-");
    const date = new Date(`20${year}-${month}-${day}`);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTooltipText = () => {
    if (university.showEarly && university.notificationEarly) {
      const earlyDate = formatDate(university.notificationEarly);
      const regularDate = formatDate(university.notificationRegular);

      if (earlyDecisionPassed) {
        return `Early decision passed on ${earlyDate}. Regular decision on ${regularDate}`;
      } else if (now > targetDateRegular) {
        return `Regular decision passed on ${regularDate}. Early decision on ${earlyDate}`;
      } else {
        return `Early decision on ${earlyDate}. Regular decision on ${regularDate}`;
      }
    } else {
      const regularDate = formatDate(university.notificationRegular);
      if (now > targetDateRegular) {
        return `Decision date passed on ${regularDate}`;
      } else {
        return `Decision date: ${regularDate}`;
      }
    }
  };

  const hexToRgba = (hex: string, alpha: number) => {
    const normalized = hex.replace("#", "");
    const r = parseInt(normalized.substring(0, 2), 16);
    const g = parseInt(normalized.substring(2, 4), 16);
    const b = parseInt(normalized.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const gradientAlpha = isPassed ? 0.06 : isToday ? 0.32 : 0.22;
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
