import type { TripDay, Hotel } from "@/types";
import { DayCard } from "./DayCard";

export function DayTimeline({
  days,
  hotels,
}: {
  days: TripDay[];
  hotels: Hotel[];
}) {
  const hotelName = (id?: string) =>
    id ? hotels.find((h) => h.id === id)?.name : undefined;

  return (
    <ol className="relative ml-1.5 border-l border-border pl-4">
      {days.map((day) => (
        <li key={day.id} className="relative mb-3 last:mb-0">
          <span
            className="absolute -left-[21px] top-5 h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-background"
            aria-hidden
          />
          <DayCard day={day} hotelName={hotelName(day.hotel_id)} />
        </li>
      ))}
    </ol>
  );
}
