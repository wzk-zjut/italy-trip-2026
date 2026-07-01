import type { Hotel } from "@/types";
import {
  BedIcon,
  MapPinIcon,
  RouteIcon,
  CalendarIcon,
} from "@/components/ui/icons";
import { formatMonthDay } from "@/lib/utils/date";

export function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-surface-muted px-2.5 py-0.5 text-xs font-medium text-foreground">
          {hotel.city}
        </span>
        <span className="text-xs text-muted">{hotel.nights} 晚</span>
      </div>

      <h3 className="mt-2 flex items-start gap-1.5 text-base font-semibold text-foreground">
        <BedIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
        <span className="min-w-0">{hotel.name}</span>
      </h3>

      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted">
        <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
        入住 {formatMonthDay(hotel.check_in)} — 退房{" "}
        {formatMonthDay(hotel.check_out)}
      </p>

      {hotel.area_note && (
        <p className="mt-2.5 flex items-start gap-1.5 text-sm text-foreground">
          <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
          <span>{hotel.area_note}</span>
        </p>
      )}

      {hotel.transport_note && (
        <p className="mt-1.5 flex items-start gap-1.5 text-sm text-muted">
          <RouteIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{hotel.transport_note}</span>
        </p>
      )}

      {hotel.public_note && (
        <p className="mt-2.5 rounded-lg bg-surface-muted px-2.5 py-1.5 text-xs text-muted">
          {hotel.public_note}
        </p>
      )}
    </article>
  );
}
