import { getRepository } from "@/lib/data";
import { TripHeader } from "@/components/trip/TripHeader";
import { HotelCard } from "@/components/trip/HotelCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { BedIcon } from "@/components/ui/icons";

export const dynamic = "force-dynamic";

export default async function HotelsPage() {
  const hotels = await getRepository().getHotels();

  return (
    <div className="space-y-4">
      <TripHeader
        kicker="意大利旅行 2026"
        title="住宿"
        subtitle="按入住顺序排列，仅展示公开信息。"
      />

      {hotels.length ? (
        <div className="space-y-3">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<BedIcon className="h-8 w-8" />}
          title="还没有酒店"
          description="前往「管理」后台添加酒店信息。"
        />
      )}
    </div>
  );
}
