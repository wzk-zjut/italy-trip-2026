import "server-only";

import type {
  TripDay,
  Hotel,
  Booking,
  PrivateNote,
} from "@/types";
import type {
  TripRepository,
  TripDayInput,
  HotelInput,
  BookingInput,
  PrivateNoteInput,
} from "./repository";
import { readerClient, serviceClient } from "@/lib/supabase/server";

function nowIso(): string {
  return new Date().toISOString();
}

// 关键：supabase-js 会忽略值为 undefined 的字段，导致「清空字段」在 update 时
// 无法把列写空。这里把 undefined 显式转成 null，确保清空能真正落库。
function nullifyUndefined(
  obj: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k in obj) out[k] = obj[k] === undefined ? null : obj[k];
  return out;
}

// 通用 upsert：有 id → update；无 id → insert（由 DB 生成 id）。
async function upsert<T>(
  table: string,
  input: { id?: string } & Record<string, unknown>,
): Promise<T> {
  const db = serviceClient();
  const ts = nowIso();
  if (input.id) {
    const { id, ...rest } = input;
    const { data, error } = await db
      .from(table)
      .update({ ...nullifyUndefined(rest), updated_at: ts })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as T;
  }
  const rest = { ...input };
  delete rest.id;
  const { data, error } = await db
    .from(table)
    .insert({ ...rest, updated_at: ts })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as T;
}

async function remove(table: string, id: string): Promise<void> {
  const { error } = await serviceClient().from(table).delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export const supabaseRepository: TripRepository = {
  // ---------------- 公开读取（anon key + RLS）----------------
  async getTripDays() {
    const { data, error } = await readerClient()
      .from("trip_days")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as TripDay[];
  },

  async getTripDay(date) {
    const { data, error } = await readerClient()
      .from("trip_days")
      .select("*")
      .eq("date", date)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (data as TripDay | null) ?? null;
  },

  async getHotels() {
    const { data, error } = await readerClient()
      .from("hotels")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as Hotel[];
  },

  async getHotel(id) {
    const { data, error } = await readerClient()
      .from("hotels")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (data as Hotel | null) ?? null;
  },

  async getBookings() {
    const { data, error } = await readerClient()
      .from("bookings")
      .select("*")
      .order("date", { ascending: true })
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as Booking[];
  },

  // ---------------- 后台写入（service_role）----------------
  saveTripDay: (input: TripDayInput) => upsert<TripDay>("trip_days", { ...input }),
  deleteTripDay: (id) => remove("trip_days", id),
  saveHotel: (input: HotelInput) => upsert<Hotel>("hotels", { ...input }),
  deleteHotel: (id) => remove("hotels", id),
  saveBooking: (input: BookingInput) => upsert<Booking>("bookings", { ...input }),
  deleteBooking: (id) => remove("bookings", id),

  // ---------------- 私密备注（service_role，anon 无权限）----------------
  async getPrivateNotes(entityType, entityId) {
    const filter: Record<string, string> = {};
    if (entityType) filter.entity_type = entityType;
    if (entityId) filter.entity_id = entityId;
    const { data, error } = await serviceClient()
      .from("private_notes")
      .select("*")
      .match(filter);
    if (error) throw new Error(error.message);
    return (data ?? []) as PrivateNote[];
  },

  savePrivateNote: (input: PrivateNoteInput) =>
    upsert<PrivateNote>("private_notes", { ...input }),
  deletePrivateNote: (id) => remove("private_notes", id),
};
