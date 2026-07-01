import { getRepository } from "@/lib/data";
import { TripHeader } from "@/components/trip/TripHeader";
import { DayTimeline } from "@/components/trip/DayTimeline";
import { EmptyState } from "@/components/ui/EmptyState";
import { CalendarIcon } from "@/components/ui/icons";

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
      <TripHeader
        title="意大利旅行 2026"
        subtitle="2026.09.24 - 2026.10.03 ｜ 罗马 → 佛罗伦萨 → 米兰 → 威尼斯"
      >
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
