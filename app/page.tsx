import Link from "next/link";
import { getRepository } from "@/lib/data";
import { TripHeader } from "@/components/trip/TripHeader";
import { DayTimeline } from "@/components/trip/DayTimeline";
import { EmptyState } from "@/components/ui/EmptyState";
import { CalendarIcon, DownloadIcon } from "@/components/ui/icons";
import { TRIP_META } from "@/lib/trip-meta";

// 读取本地 JSON，需实时反映后台保存后的改动，故强制动态渲染。
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const repo = getRepository();
  const [days, hotels] = await Promise.all([
    repo.getTripDays(),
    repo.getHotels(),
  ]);

  return (
    <div className="space-y-4">
      <TripHeader title={TRIP_META.title} subtitle={TRIP_META.subtitle}>
        <div className="flex flex-wrap gap-2 text-xs text-muted">
          <span className="rounded-full bg-surface px-2.5 py-1 ring-1 ring-inset ring-border">
            共 {days.length} 天
          </span>
          <span className="rounded-full bg-surface px-2.5 py-1 ring-1 ring-inset ring-border">
            {hotels.length} 家酒店
          </span>
          <span className="rounded-full bg-surface px-2.5 py-1 ring-1 ring-inset ring-border">
            4 座城市
          </span>
        </div>
      </TripHeader>

      <Link
        href="/export"
        className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface py-2.5 text-sm font-medium text-foreground"
      >
        <DownloadIcon className="h-4 w-4 text-accent" />
        导出 PDF / Markdown
      </Link>

      {days.length === 0 ? (
        <EmptyState
          icon={<CalendarIcon className="h-8 w-8" />}
          title="还没有行程"
          description="前往「管理」后台添加每天的安排。"
        />
      ) : (
        <section aria-label="行程时间线">
          <DayTimeline days={days} hotels={hotels} />
        </section>
      )}
    </div>
  );
}
