import type { TripDay, Hotel, Booking, Slot } from "@/types";
import { PACE_META, STATUS_META, BOOKING_TYPE_META } from "@/lib/utils/labels";
import { formatMonthDay } from "@/lib/utils/date";
import { TRIP_META } from "@/lib/trip-meta";

// 从同一份 trip data 生成完整 Markdown。
// 只使用公开字段；绝不包含 private_notes / 订单号 / 票码 等敏感信息。
export function buildTripMarkdown(
  days: TripDay[],
  hotels: Hotel[],
  bookings: Booking[],
): string {
  const hotelById = new Map(hotels.map((h) => [h.id, h]));
  const out: string[] = [];
  const p = (s = "") => out.push(s);

  // ---------------- 总览 ----------------
  p(`# ${TRIP_META.title}`);
  p();
  p(`**${TRIP_META.dateRange} ｜ ${TRIP_META.route}**`);
  p();
  p(`共 ${days.length} 天 · ${hotels.length} 家酒店 · ${bookings.length} 项票务/预订`);
  p();

  // ---------------- 每日行程 ----------------
  p(`## 每日行程`);
  p();
  for (const d of days) {
    const hotel = d.hotel_id ? hotelById.get(d.hotel_id) : undefined;
    p(`### ${formatMonthDay(d.date)}（${d.weekday}）· ${d.city}`);
    const meta = [`强度：${PACE_META[d.pace].label}`];
    if (hotel) meta.push(`住：${hotel.name}`);
    p(meta.join(" ｜ "));
    p();
    if (d.summary?.trim()) {
      p(`> ${d.summary.trim()}`);
      p();
    }

    const slot = (label: string, text: string | undefined, s: Slot) => {
      const t = (text ?? "").trim();
      const spots = (d.spots ?? [])
        .filter((x) => x.slot === s)
        .map((x) => x.name);
      if (!t && spots.length === 0) return;
      let line = `- **${label}**：${t}`;
      if (spots.length) line += `${t ? " " : ""}（${spots.join("、")}）`;
      p(line);
    };
    slot("上午", d.morning, "morning");
    slot("下午", d.afternoon, "afternoon");
    slot("晚上", d.evening, "evening");
    if (d.transport_note?.trim()) p(`- **交通**：${d.transport_note.trim()}`);
    if (d.food_note?.trim()) p(`- **餐饮**：${d.food_note.trim()}`);
    if (d.optional_plan?.trim()) p(`- **可选**：${d.optional_plan.trim()}`);
    if (d.reminder?.trim()) p(`- **提醒**：${d.reminder.trim()}`);
    if (d.map_url?.trim()) p(`- **地图**：${d.map_url.trim()}`);
    p();
  }

  // ---------------- 酒店 ----------------
  p(`## 酒店`);
  p();
  for (const h of hotels) {
    p(`### ${h.city} · ${h.name}`);
    p(
      `- 入住 ${formatMonthDay(h.check_in)} — 退房 ${formatMonthDay(h.check_out)}（${h.nights} 晚）`,
    );
    if (h.area_note?.trim()) p(`- 位置：${h.area_note.trim()}`);
    if (h.transport_note?.trim()) p(`- 交通：${h.transport_note.trim()}`);
    if (h.public_note?.trim()) p(`- 备注：${h.public_note.trim()}`);
    p();
  }

  // ---------------- 门票 / 预订 ----------------
  p(`## 门票 / 预订`);
  p();
  for (const b of bookings) {
    const parts = [
      `${BOOKING_TYPE_META[b.type].emoji} **${b.title}**`,
      formatMonthDay(b.date),
    ];
    if (b.time?.trim()) parts.push(b.time.trim());
    if (b.city?.trim()) parts.push(b.city.trim());
    parts.push(STATUS_META[b.status].label);
    let line = `- ${parts.join(" · ")}`;
    if (b.public_note?.trim()) line += ` — ${b.public_note.trim()}`;
    p(line);
  }
  p();

  // ---------------- 待办事项 ----------------
  p(`## 待办事项`);
  p();
  const todos = bookings.filter((b) => b.status === "todo");
  if (todos.length === 0) {
    p(`- （暂无待办）`);
  } else {
    for (const b of todos) {
      const bits = [b.title, formatMonthDay(b.date)];
      if (b.public_note?.trim()) bits.push(b.public_note.trim());
      p(`- [ ] ${bits.join(" — ")}`);
    }
  }
  p();

  p(`---`);
  p(
    `_由「${TRIP_META.title}」导出，仅含公开信息（不含私密备注 / 订单号 / 票码等）。_`,
  );

  return out.join("\n");
}
