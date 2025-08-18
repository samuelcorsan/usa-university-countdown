import Image from "next/image";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface CalendarButtonsProps {
  title: string;
  date: string;
  time?: string;
  className?: string;
}

export function CalendarButtons({
  title,
  date,
  className,
  time = "19:00:00",
}: CalendarButtonsProps) {
  const [day, month, year] = date.split("-");
  const formattedDate = `20${year}-${month}-${day}T${time}-05:00`;
  const eventTitle = `${title} Decision Results`;
  const description = `Decision results for ${title}`;

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    eventTitle
  )}&dates=${formattedDate.replace(/[-:]/g, "").split(".")[0]}Z/${
    formattedDate.replace(/[-:]/g, "").split(".")[0]
  }Z&details=${encodeURIComponent(description)}`;

  const outlookCalendarUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(
    eventTitle
  )}&startdt=${formattedDate}&enddt=${formattedDate}&body=${encodeURIComponent(
    description
  )}`;

  const appleCalendarUrl = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${encodeURIComponent(window.location.href)}
DTSTART:${formattedDate.replace(/[-:]/g, "").split(".")[0]}Z
DTEND:${formattedDate.replace(/[-:]/g, "").split(".")[0]}Z
SUMMARY:${eventTitle}
DESCRIPTION:${description}
END:VEVENT
END:VCALENDAR`;

  const handleEventTracking = (calendarType: string) => {
    if (typeof window !== "undefined") {
      window.gtag("event", "add_to_calendar", {
        event_category: "Calendar",
        event_label: calendarType,
        value: title,
      });
    }
  };

  return (
    <div
      className={cn(
        "flex gap-2 justify-center flex-wrap md:flex-nowrap",
        className
      )}
    >
      <Button
        variant="outline"
        size="lg"
        asChild
        className="flex items-center gap-2 w-full"
      >
        <a
          href={googleCalendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleEventTracking("Google Calendar")}
        >
          <Image
            src="/calendar/google.svg"
            alt="Google Calendar"
            width={16}
            height={16}
            className="w-4 h-4"
          />
          Google Calendar
        </a>
      </Button>
      <Button
        variant="outline"
        size="lg"
        asChild
        className="flex items-center gap-2 w-full"
      >
        <a
          href={outlookCalendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleEventTracking("Outlook Calendar")}
        >
          <Image
            src="/calendar/outlook.svg"
            alt="Outlook Calendar"
            width={16}
            height={16}
            className="w-4 h-4"
          />
          Outlook Calendar
        </a>
      </Button>
      <Button
        variant="outline"
        size="lg"
        asChild
        className="flex items-center gap-2 w-full"
      >
        <a
          href={appleCalendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          download="event.ics"
          onClick={() => handleEventTracking("Apple Calendar")}
        >
          <Image
            src="/calendar/apple.svg"
            alt="Apple Calendar"
            width={16}
            height={16}
            className="w-4 h-4"
          />
          Apple Calendar
        </a>
      </Button>
    </div>
  );
}
