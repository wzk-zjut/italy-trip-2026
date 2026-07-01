import type { Pace, BookingStatus, BookingType } from "@/types";

// 注意：className 使用完整字符串字面量，方便 Tailwind 扫描器识别。

export const PACE_META: Record<
  Pace,
  { label: string; className: string; dot: string }
> = {
  easy: {
    label: "轻松",
    className: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
    dot: "bg-emerald-500",
  },
  medium: {
    label: "中等",
    className: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
    dot: "bg-amber-500",
  },
  busy: {
    label: "偏累",
    className: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20",
    dot: "bg-rose-500",
  },
};

export const STATUS_META: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  booked: {
    label: "已订",
    className: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
  },
  todo: {
    label: "待订",
    className: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
  },
  optional: {
    label: "可选",
    className: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/20",
  },
  cancelled: {
    label: "已取消",
    className: "bg-stone-100 text-stone-500 ring-1 ring-inset ring-stone-500/20 line-through",
  },
};

export const BOOKING_TYPE_META: Record<
  BookingType,
  { label: string; emoji: string }
> = {
  flight: { label: "航班", emoji: "✈️" },
  train: { label: "高铁", emoji: "🚄" },
  ticket: { label: "门票", emoji: "🎫" },
  hotel: { label: "酒店", emoji: "🏨" },
  todo: { label: "待办", emoji: "📌" },
  other: { label: "其他", emoji: "•" },
};

export const PACE_OPTIONS: { value: Pace; label: string }[] = [
  { value: "easy", label: "轻松" },
  { value: "medium", label: "中等" },
  { value: "busy", label: "偏累" },
];

export const STATUS_OPTIONS: { value: BookingStatus; label: string }[] = [
  { value: "booked", label: "已订" },
  { value: "todo", label: "待订" },
  { value: "optional", label: "可选" },
  { value: "cancelled", label: "已取消" },
];

export const BOOKING_TYPE_OPTIONS: { value: BookingType; label: string }[] = [
  { value: "flight", label: "航班" },
  { value: "train", label: "高铁" },
  { value: "ticket", label: "门票" },
  { value: "hotel", label: "酒店" },
  { value: "todo", label: "待办" },
  { value: "other", label: "其他" },
];
