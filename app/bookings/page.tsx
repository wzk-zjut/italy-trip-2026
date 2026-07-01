import { getRepository } from "@/lib/data";
import { TripHeader } from "@/components/trip/TripHeader";
import { BookingCard } from "@/components/trip/BookingCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { TicketIcon } from "@/components/ui/icons";
import { STATUS_META } from "@/lib/utils/labels";
import type { BookingStatus } from "@/types";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const bookings = await getRepository().getBookings();

  const counts = bookings.reduce<Record<string, number>>((acc, b) => {
    acc[b.status] = (acc[b.status] ?? 0) + 1;
    return acc;
  }, {});
  const order: BookingStatus[] = ["todo", "booked", "optional", "cancelled"];

  return (
    <div className="space-y-4">
      <TripHeader
        kicker="意大利旅行 2026"
        title="票务 / 预订"
        subtitle="航班、高铁、门票与重要预约。公开页不含票码与订单号。"
      >
        <div className="flex flex-wrap gap-2 text-xs">
          {order
            .filter((s) => counts[s])
            .map((s) => (
              <span
                key={s}
                className={`rounded-full px-2.5 py-1 ${STATUS_META[s].className}`}
              >
                {STATUS_META[s].label} {counts[s]}
              </span>
            ))}
        </div>
      </TripHeader>

      {bookings.length ? (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<TicketIcon className="h-8 w-8" />}
          title="还没有票务事项"
          description="前往「管理」后台添加航班、高铁或门票。"
        />
      )}
    </div>
  );
}
