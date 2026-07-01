import Link from "next/link";
import { getRepository } from "@/lib/data";
import { PACE_META, STATUS_META, BOOKING_TYPE_META } from "@/lib/utils/labels";
import { formatMonthDay } from "@/lib/utils/date";
import { TRIP_META } from "@/lib/trip-meta";
import { PrintButton } from "@/components/export/PrintButton";
import type { Slot } from "@/types";

export const dynamic = "force-dynamic";

const SLOTS: { key: Slot; label: string }[] = [
  { key: "morning", label: "上午" },
  { key: "afternoon", label: "下午" },
  { key: "evening", label: "晚上" },
];

export default async function PrintPage() {
  const repo = getRepository();
  const [days, hotels, bookings] = await Promise.all([
    repo.getTripDays(),
    repo.getHotels(),
    repo.getBookings(),
  ]);
  const hotelById = new Map(hotels.map((h) => [h.id, h]));
  const todos = bookings.filter((b) => b.status === "todo");

  return (
    <div className="print-doc text-black">
      {/* 屏幕上显示的操作区，打印/导出 PDF 时自动隐藏 */}
      <div className="no-print mb-5 space-y-2">
        <Link
          href="/export"
          className="inline-flex items-center gap-1 text-sm text-muted"
        >
          <span aria-hidden>←</span> 返回导出
        </Link>
        <PrintButton />
        <p className="text-xs text-muted">
          手机保存 PDF：点上面按钮 → 在弹出的打印 / 分享面板里选「存储到文件」或「另存为
          PDF」。
        </p>
      </div>

      {/* 文档正文 */}
      <header className="mb-4">
        <h1 className="text-xl font-bold">{TRIP_META.title}</h1>
        <p className="mt-0.5 text-sm">
          {TRIP_META.dateRange} ｜ {TRIP_META.route}
        </p>
        <p className="mt-0.5 text-xs text-gray-500">
          共 {days.length} 天 · {hotels.length} 家酒店 · {bookings.length} 项票务/预订
        </p>
      </header>

      {days.map((d) => {
        const hotel = d.hotel_id ? hotelById.get(d.hotel_id) : undefined;
        const slots = SLOTS.map(({ key, label }) => {
          const text = (d[key] ?? "").trim();
          const spots = (d.spots ?? [])
            .filter((s) => s.slot === key)
            .map((s) => s.name);
          return { label, text, spots };
        }).filter((s) => s.text || s.spots.length);

        return (
          <section
            key={d.id}
            className="print-day mb-3 border-b border-gray-300 pb-3"
          >
            <h2 className="text-base font-bold">
              {formatMonthDay(d.date)}（{d.weekday}）· {d.city}
            </h2>
            <p className="text-xs text-gray-600">
              强度：{PACE_META[d.pace].label}
              {hotel ? ` ｜ 住：${hotel.name}` : ""}
            </p>
            {d.summary?.trim() && <p className="mt-1 text-sm">{d.summary}</p>}
            <ul className="mt-1 space-y-0.5 text-sm">
              {slots.map((s) => (
                <li key={s.label}>
                  <b>{s.label}：</b>
                  {s.text}
                  {s.spots.length ? `${s.text ? " " : ""}（${s.spots.join("、")}）` : ""}
                </li>
              ))}
              {d.transport_note?.trim() && (
                <li>
                  <b>交通：</b>
                  {d.transport_note}
                </li>
              )}
              {d.reminder?.trim() && (
                <li>
                  <b>提醒：</b>
                  {d.reminder}
                </li>
              )}
            </ul>
          </section>
        );
      })}

      {/* 住宿一览 */}
      <section className="print-section mb-3">
        <h2 className="mb-1 text-base font-bold">住宿一览</h2>
        <ul className="space-y-1 text-sm">
          {hotels.map((h) => (
            <li key={h.id}>
              <b>
                {h.city} · {h.name}
              </b>
              ：{formatMonthDay(h.check_in)}–{formatMonthDay(h.check_out)}（
              {h.nights} 晚）
              {h.area_note?.trim() ? `，${h.area_note}` : ""}
            </li>
          ))}
        </ul>
      </section>

      {/* 票务 / 待办 */}
      <section className="print-section">
        <h2 className="mb-1 text-base font-bold">票务 / 预订</h2>
        <ul className="space-y-0.5 text-sm">
          {bookings.map((b) => (
            <li key={b.id}>
              {BOOKING_TYPE_META[b.type].emoji} {b.title} · {formatMonthDay(b.date)}
              {b.time?.trim() ? ` ${b.time}` : ""} · {STATUS_META[b.status].label}
              {b.public_note?.trim() ? ` — ${b.public_note}` : ""}
            </li>
          ))}
        </ul>

        {todos.length > 0 && (
          <>
            <h2 className="mt-3 mb-1 text-base font-bold">待办事项</h2>
            <ul className="space-y-0.5 text-sm">
              {todos.map((b) => (
                <li key={b.id}>
                  ☐ {b.title} — {formatMonthDay(b.date)}
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
