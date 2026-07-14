import Link from "next/link";
import { getRepository } from "@/lib/data";
import { TripHeader } from "@/components/trip/TripHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { TipIcon, ArrowRightIcon } from "@/components/ui/icons";
import { TRIP_META } from "@/lib/trip-meta";

export const dynamic = "force-dynamic";

export default async function TipsPage() {
  const guides = await getRepository().getGuides();

  return (
    <div className="space-y-4">
      <TripHeader
        kicker={TRIP_META.title}
        title="实用贴士"
        subtitle="出行小攻略，点开看详情。"
      />

      {guides.length ? (
        <ul className="space-y-2">
          {guides.map((g) => (
            <li key={g.id}>
              <Link
                href={`/tips/${g.id}`}
                className="flex items-center justify-between gap-2 rounded-2xl border border-border bg-surface p-4 shadow-sm"
              >
                <div className="min-w-0">
                  {g.category && (
                    <p className="text-xs text-muted">{g.category}</p>
                  )}
                  <p className="truncate font-medium text-foreground">
                    {g.title}
                  </p>
                </div>
                <ArrowRightIcon className="h-4 w-4 shrink-0 text-muted" />
              </Link>
            </li>
          ))}
        </ul>
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
