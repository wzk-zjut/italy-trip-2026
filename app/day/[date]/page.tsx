import Link from "next/link";
import { notFound } from "next/navigation";
import { getRepository } from "@/lib/data";
import { PaceBadge } from "@/components/ui/PaceBadge";
import { SectionCard } from "@/components/ui/SectionCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BOOKING_TYPE_META } from "@/lib/utils/labels";
import { formatMonthDay } from "@/lib/utils/date";
import { existingImages } from "@/lib/images";
import { SpotGallery } from "@/components/trip/SpotGallery";
import type { Slot } from "@/types";
import {
  SunriseIcon,
  SunIcon,
  MoonIcon,
  RouteIcon,
  UtensilsIcon,
  SparkleIcon,
  AlertIcon,
  TicketIcon,
  BedIcon,
  MapPinIcon,
  ArrowRightIcon,
} from "@/components/ui/icons";

export const dynamic = "force-dynamic";

export default async function DayDetailPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const repo = getRepository();
  const day = await repo.getTripDay(date);
  if (!day) notFound();

  const [hotel, allBookings] = await Promise.all([
    day.hotel_id ? repo.getHotel(day.hotel_id) : Promise.resolve(null),
    repo.getBookings(),
  ]);
  const bookings = allBookings.filter((b) => b.date === date);

  const iconCls = "h-4 w-4 text-muted";
  const allSpots = day.spots ?? [];
  // 每个景点始终显示成独立块（名字 + 各自图集）；图片文件存在时才渲染图。
  const spotsForSlot = (slot: Slot) =>
    allSpots
      .filter((s) => s.slot === slot)
      .map((s) => ({ ...s, imgs: existingImages(s.images) }));

  const slots = (
    [
      { key: "morning", label: "上午", icon: <SunriseIcon className={iconCls} /> },
      { key: "afternoon", label: "下午", icon: <SunIcon className={iconCls} /> },
      { key: "evening", label: "晚上", icon: <MoonIcon className={iconCls} /> },
    ] as const
  )
    .map((def) => ({
      ...def,
      text: day[def.key],
      spots: spotsForSlot(def.key),
    }))
    .filter((s) => (s.text && s.text.trim()) || s.spots.length > 0);

  return (
    <div className="space-y-4">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted"
      >
        <span aria-hidden>←</span> 返回行程
      </Link>

      <header>
        <p className="text-xs text-muted">
          {formatMonthDay(day.date)} · {day.weekday}
        </p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-accent">{day.city}</p>
          <PaceBadge pace={day.pace} />
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
          {day.title}
        </h1>
        {day.map_url && (
          <a
            href={day.map_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground"
          >
            <MapPinIcon className="h-4 w-4 text-accent" />
            在地图中打开
          </a>
        )}
      </header>

      {day.summary && (
        <SectionCard title="今日概览">
          <p>{day.summary}</p>
        </SectionCard>
      )}

      {hotel && (
        <SectionCard title="今晚住宿" icon={<BedIcon className={iconCls} />}>
          <p className="font-medium text-foreground">{hotel.name}</p>
          <p className="mt-0.5 text-xs text-muted">
            {hotel.city} · 入住 {formatMonthDay(hotel.check_in)} — 退房{" "}
            {formatMonthDay(hotel.check_out)}（{hotel.nights} 晚）
          </p>
          {hotel.area_note && (
            <p className="mt-1.5 text-sm text-muted">{hotel.area_note}</p>
          )}
          <Link
            href="/hotels"
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent"
          >
            查看全部酒店 <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </SectionCard>
      )}

      {slots.map((slot) => {
        const hasText = Boolean(slot.text && slot.text.trim());
        return (
          <SectionCard key={slot.key} title={slot.label} icon={slot.icon}>
            {hasText && <p className="whitespace-pre-line">{slot.text}</p>}
            {slot.spots.length > 0 && (
              <div className={`space-y-3 ${hasText ? "mt-3" : ""}`}>
                {slot.spots.map((sp) => (
                  <div key={sp.id}>
                    <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <MapPinIcon className="h-3.5 w-3.5 shrink-0 text-accent" />
                      <span>{sp.name}</span>
                      {sp.map_url && (
                        <a
                          href={sp.map_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-normal text-accent"
                        >
                          地图
                        </a>
                      )}
                    </p>
                    {sp.note && (
                      <p className="mt-0.5 text-xs text-muted">{sp.note}</p>
                    )}
                    {sp.imgs.length > 0 && (
                      <SpotGallery images={sp.imgs} alt={sp.name} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        );
      })}

      {day.transport_note && (
        <SectionCard title="交通" icon={<RouteIcon className={iconCls} />}>
          <p className="whitespace-pre-line">{day.transport_note}</p>
        </SectionCard>
      )}

      {day.optional_plan && day.optional_plan.trim() && (
        <SectionCard title="可选项目" icon={<SparkleIcon className={iconCls} />}>
          <p className="whitespace-pre-line">{day.optional_plan}</p>
        </SectionCard>
      )}

      {day.food_note && day.food_note.trim() && (
        <SectionCard title="餐饮备注" icon={<UtensilsIcon className={iconCls} />}>
          <p className="whitespace-pre-line">{day.food_note}</p>
        </SectionCard>
      )}

      <SectionCard title="票务 / 预约" icon={<TicketIcon className={iconCls} />}>
        {bookings.length ? (
          <ul className="space-y-2.5">
            {bookings.map((b) => (
              <li
                key={b.id}
                className="flex items-start justify-between gap-2 border-t border-border pt-2.5 first:border-0 first:pt-0"
              >
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <span aria-hidden>{BOOKING_TYPE_META[b.type].emoji}</span>
                    <span className="truncate">{b.title}</span>
                  </p>
                  {(b.time || b.public_note) && (
                    <p className="mt-0.5 text-xs text-muted">
                      {b.time ? `${b.time}　` : ""}
                      {b.public_note}
                    </p>
                  )}
                </div>
                <StatusBadge status={b.status} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">今日无预约事项。</p>
        )}
      </SectionCard>

      {day.reminder && day.reminder.trim() && (
        <SectionCard
          title="注意事项"
          icon={<AlertIcon className="h-4 w-4 text-amber-600" />}
          className="border-amber-200 bg-amber-50"
        >
          <p className="whitespace-pre-line text-amber-900">{day.reminder}</p>
        </SectionCard>
      )}
    </div>
  );
}
