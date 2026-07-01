import Link from "next/link";
import type { TripDay } from "@/types";
import { PaceBadge } from "@/components/ui/PaceBadge";
import { BedIcon, AlertIcon, ArrowRightIcon } from "@/components/ui/icons";
import { formatMonthDay } from "@/lib/utils/date";

export function DayCard({
  day,
  hotelName,
  className = "",
}: {
  day: TripDay;
  hotelName?: string;
  className?: string;
}) {
  return (
    <article
      className={`rounded-2xl border border-border bg-surface p-4 shadow-sm ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs text-muted">
            {formatMonthDay(day.date)} · {day.weekday}
          </p>
          <p className="mt-0.5 truncate text-[13px] font-medium text-accent">
            {day.city}
          </p>
        </div>
        <PaceBadge pace={day.pace} />
      </div>

      <h3 className="mt-2 text-base font-semibold text-foreground">
        {day.title}
      </h3>
      {day.summary && (
        <p className="mt-1 line-clamp-3 text-sm text-muted">{day.summary}</p>
      )}

      {hotelName && (
        <p className="mt-2.5 flex items-center gap-1.5 text-xs text-muted">
          <BedIcon className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">住：{hotelName}</span>
        </p>
      )}

      {day.reminder && (
        <p className="mt-2 flex items-start gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs text-amber-800">
          <AlertIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{day.reminder}</span>
        </p>
      )}

      <Link
        href={`/day/${day.date}`}
        className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent"
      >
        进入详情
        <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </article>
  );
}
