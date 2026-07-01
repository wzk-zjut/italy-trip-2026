import Link from "next/link";
import { getRepository } from "@/lib/data";
import { buildTripMarkdown } from "@/lib/export/markdown";
import { TripHeader } from "@/components/trip/TripHeader";
import { ExportActions } from "@/components/export/ExportActions";
import { TRIP_META } from "@/lib/trip-meta";

export const dynamic = "force-dynamic";

export default async function ExportPage() {
  const repo = getRepository();
  const [days, hotels, bookings] = await Promise.all([
    repo.getTripDays(),
    repo.getHotels(),
    repo.getBookings(),
  ]);
  const markdown = buildTripMarkdown(days, hotels, bookings);

  return (
    <div className="space-y-4">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted">
        <span aria-hidden>←</span> 返回行程
      </Link>

      <TripHeader
        kicker={TRIP_META.title}
        title="导出"
        subtitle="PDF 用于手机离线查看；Markdown 用于粘贴到飞书 / 腾讯文档或继续编辑。仅含公开信息。"
      />

      <ExportActions markdown={markdown} />
    </div>
  );
}
