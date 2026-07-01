// =====================================================================
// 领域模型类型定义
// 说明：trip_days / hotels / bookings 三张表只含「公开安全」字段；
// 任何敏感内容（订单号、票码、护照、联系方式等）只放在 private_notes，
// 且公开页永不读取 private_notes。
// =====================================================================

export type Pace = "easy" | "medium" | "busy";

export type BookingType =
  | "flight"
  | "train"
  | "ticket"
  | "hotel"
  | "todo"
  | "other";

export type BookingStatus = "booked" | "todo" | "optional" | "cancelled";

export type EntityType = "trip_day" | "hotel" | "booking";

export type Slot = "morning" | "afternoon" | "evening";

// 景点：一天里某个时段要去的地方，可承载一张或多张图片。
// images 存本地静态图路径（如 "/images/colosseo.jpg"，文件放在 public/images/）或外链。
export interface Spot {
  id: string;
  slot: Slot;
  name: string;
  note?: string;
  images?: string[];
  map_url?: string;
}

export interface TripDay {
  id: string;
  date: string; // YYYY-MM-DD
  weekday: string; // 例如「周四」
  city: string;
  hotel_id?: string;
  title: string;
  pace: Pace;
  summary: string;
  morning: string;
  afternoon: string;
  evening: string;
  optional_plan?: string;
  transport_note?: string;
  food_note?: string;
  reminder?: string;
  map_url?: string;
  spots?: Spot[];
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Hotel {
  id: string;
  city: string;
  name: string;
  check_in: string; // YYYY-MM-DD
  check_out: string; // YYYY-MM-DD
  nights: number;
  area_note: string;
  transport_note: string;
  public_note?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  type: BookingType;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  city?: string;
  status: BookingStatus;
  is_important: boolean;
  public_note?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// 私密备注：单独一张表，仅后台登录后可读写。
export interface PrivateNote {
  id: string;
  entity_type: EntityType;
  entity_id: string;
  note: string;
  created_at: string;
  updated_at: string;
}
