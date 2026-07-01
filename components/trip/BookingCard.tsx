import type { Booking } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BOOKING_TYPE_META } from "@/lib/utils/labels";
import { formatMonthDay } from "@/lib/utils/date";
import { ClockIcon } from "@/components/ui/icons";

export function BookingCard({ booking }: { booking: Booking }) {
  const type = BOOKING_TYPE_META[booking.type];
  return (
    <article className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-2">
          <span className="text-lg leading-none" aria-hidden>
            {type.emoji}
          </span>
          <div className="min-w-0">
            <h3 className="flex items-center gap-1.5 text-base font-semibold text-foreground">
              <span className="truncate">{booking.title}</span>
              {booking.is_important && (
                <span className="text-accent" title="重要" aria-label="重要">
                  ★
                </span>
              )}
            </h3>
            <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
              <span className="rounded bg-surface-muted px-1.5 py-0.5">
                {type.label}
              </span>
              <span>{formatMonthDay(booking.date)}</span>
              {booking.time && (
                <span className="inline-flex items-center gap-0.5">
                  <ClockIcon className="h-3 w-3" />
                  {booking.time}
                </span>
              )}
              {booking.city && <span>· {booking.city}</span>}
            </p>
          </div>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {booking.public_note && (
        <p className="mt-2.5 text-sm text-muted">{booking.public_note}</p>
      )}
    </article>
  );
}
