import { getRepository } from "@/lib/data";
import { TripHeader } from "@/components/trip/TripHeader";
import { GuideCard } from "@/components/trip/GuideCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { TipIcon } from "@/components/ui/icons";
import { TRIP_META } from "@/lib/trip-meta";

export const dynamic = "force-dynamic";

export default async function TipsPage() {
  const guides = await getRepository().getGuides();

  return (
    <div className="space-y-4">
      <TripHeader
        kicker={TRIP_META.title}
        title="实用贴士"
        subtitle="出行小攻略：怎么坐车、怎么找吃的等。文中的链接可直接点开。"
      />

      {guides.length ? (
        <div className="space-y-3">
          {guides.map((g) => (
            <GuideCard key={g.id} guide={g} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<TipIcon className="h-8 w-8" />}
          title="还没有贴士"
          description="前往「管理 → 贴士」添加。"
        />
      )}
    </div>
  );
}
