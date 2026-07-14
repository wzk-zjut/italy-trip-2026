"use server";

import { revalidatePath } from "next/cache";
import { getRepository } from "@/lib/data";
import { requireAdmin } from "@/lib/auth";
import { weekdayOf } from "@/lib/utils/date";
import { randomUUID } from "node:crypto";
import type {
  Pace,
  BookingType,
  BookingStatus,
  EntityType,
  Spot,
  Slot,
} from "@/types";
import type { TripRepository as Repo } from "@/lib/data/repository";

export type SaveState = { ok: boolean; error?: string };

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const opt = (fd: FormData, k: string) => {
  const v = str(fd, k);
  return v ? v : undefined;
};
const num = (fd: FormData, k: string) => {
  const n = Number(fd.get(k));
  return Number.isFinite(n) ? n : 0;
};

const VALID_SLOTS: readonly Slot[] = ["morning", "afternoon", "evening"];

// 前端把景点列表以 JSON 放在隐藏字段 spots 里；这里解析并做规范化/清洗。
function parseSpots(raw: FormDataEntryValue | null): Spot[] {
  if (typeof raw !== "string" || !raw.trim()) return [];
  let arr: unknown;
  try {
    arr = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(arr)) return [];
  return arr
    .map((s): Spot => {
      const o = (s ?? {}) as Record<string, unknown>;
      const images = Array.isArray(o.images)
        ? o.images.map((x) => String(x).trim()).filter(Boolean)
        : [];
      const note = o.note ? String(o.note).trim() : "";
      const mapUrl = o.map_url ? String(o.map_url).trim() : "";
      return {
        id: typeof o.id === "string" && o.id ? o.id : randomUUID(),
        slot: VALID_SLOTS.includes(o.slot as Slot) ? (o.slot as Slot) : "morning",
        name: String(o.name ?? "").trim(),
        note: note || undefined,
        images,
        map_url: mapUrl || undefined,
      };
    })
    .filter((s) => s.name);
}

function nightsBetween(checkIn: string, checkOut: string): number {
  const [ay, am, ad] = checkIn.split("-").map(Number);
  const [by, bm, bd] = checkOut.split("-").map(Number);
  const a = Date.UTC(ay, (am ?? 1) - 1, ad ?? 1);
  const b = Date.UTC(by, (bm ?? 1) - 1, bd ?? 1);
  const diff = Math.round((b - a) / 86_400_000);
  return diff > 0 ? diff : 1;
}

// 一个实体最多一条私密备注（MVP 简化）：有文本则 upsert，无文本则删除。
async function upsertPrivateNote(
  repo: Repo,
  entity_type: EntityType,
  entity_id: string,
  text: string,
) {
  const existing = (await repo.getPrivateNotes(entity_type, entity_id))[0];
  const note = text.trim();
  if (!note) {
    if (existing) await repo.deletePrivateNote(existing.id);
    return;
  }
  await repo.savePrivateNote({
    id: existing?.id,
    entity_type,
    entity_id,
    note,
  });
}

function revalidateAll() {
  // 公开页与后台页均为动态渲染；显式 revalidate 保证客户端立即拿到最新数据。
  revalidatePath("/", "layout");
}

// ------------------------------- 行程日 -------------------------------
export async function saveDayAction(
  _prev: SaveState,
  fd: FormData,
): Promise<SaveState> {
  await requireAdmin();
  try {
    const repo = getRepository();
    const date = str(fd, "date");
    const title = str(fd, "title");
    if (!date || !title) return { ok: false, error: "日期与标题为必填。" };

    const saved = await repo.saveTripDay({
      id: opt(fd, "id"),
      date,
      weekday: str(fd, "weekday") || weekdayOf(date),
      city: str(fd, "city"),
      hotel_id: opt(fd, "hotel_id"),
      title,
      pace: (str(fd, "pace") as Pace) || "medium",
      summary: str(fd, "summary"),
      morning: str(fd, "morning"),
      afternoon: str(fd, "afternoon"),
      evening: str(fd, "evening"),
      optional_plan: opt(fd, "optional_plan"),
      transport_note: opt(fd, "transport_note"),
      food_note: opt(fd, "food_note"),
      reminder: opt(fd, "reminder"),
      map_url: opt(fd, "map_url"),
      spots: parseSpots(fd.get("spots")),
      sort_order: num(fd, "sort_order"),
    });

    await upsertPrivateNote(repo, "trip_day", saved.id, str(fd, "private_note"));
    revalidateAll();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "保存失败" };
  }
}

export async function deleteDayAction(id: string): Promise<void> {
  await requireAdmin();
  const repo = getRepository();
  await repo.deleteTripDay(id);
  await upsertPrivateNote(repo, "trip_day", id, ""); // 连带清理私密备注
  revalidateAll();
}

// -------------------------------- 酒店 --------------------------------
export async function saveHotelAction(
  _prev: SaveState,
  fd: FormData,
): Promise<SaveState> {
  await requireAdmin();
  try {
    const repo = getRepository();
    const name = str(fd, "name");
    const check_in = str(fd, "check_in");
    const check_out = str(fd, "check_out");
    if (!name || !check_in || !check_out)
      return { ok: false, error: "名称与入住/退房日期为必填。" };

    const saved = await repo.saveHotel({
      id: opt(fd, "id"),
      city: str(fd, "city"),
      name,
      check_in,
      check_out,
      nights: num(fd, "nights") || nightsBetween(check_in, check_out),
      area_note: str(fd, "area_note"),
      transport_note: str(fd, "transport_note"),
      public_note: opt(fd, "public_note"),
      sort_order: num(fd, "sort_order"),
    });

    await upsertPrivateNote(repo, "hotel", saved.id, str(fd, "private_note"));
    revalidateAll();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "保存失败" };
  }
}

export async function deleteHotelAction(id: string): Promise<void> {
  await requireAdmin();
  const repo = getRepository();
  await repo.deleteHotel(id);
  await upsertPrivateNote(repo, "hotel", id, "");
  revalidateAll();
}

// -------------------------------- 票务 --------------------------------
export async function saveBookingAction(
  _prev: SaveState,
  fd: FormData,
): Promise<SaveState> {
  await requireAdmin();
  try {
    const repo = getRepository();
    const title = str(fd, "title");
    const date = str(fd, "date");
    if (!title || !date) return { ok: false, error: "标题与日期为必填。" };

    const saved = await repo.saveBooking({
      id: opt(fd, "id"),
      type: (str(fd, "type") as BookingType) || "other",
      title,
      date,
      time: opt(fd, "time"),
      city: opt(fd, "city"),
      status: (str(fd, "status") as BookingStatus) || "todo",
      is_important: fd.get("is_important") === "true",
      public_note: opt(fd, "public_note"),
      sort_order: num(fd, "sort_order"),
    });

    await upsertPrivateNote(repo, "booking", saved.id, str(fd, "private_note"));
    revalidateAll();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "保存失败" };
  }
}

export async function deleteBookingAction(id: string): Promise<void> {
  await requireAdmin();
  const repo = getRepository();
  await repo.deleteBooking(id);
  await upsertPrivateNote(repo, "booking", id, "");
  revalidateAll();
}

// -------------------------------- 贴士 --------------------------------
export async function saveGuideAction(
  _prev: SaveState,
  fd: FormData,
): Promise<SaveState> {
  await requireAdmin();
  try {
    const repo = getRepository();
    const title = str(fd, "title");
    if (!title) return { ok: false, error: "标题为必填。" };

    await repo.saveGuide({
      id: opt(fd, "id"),
      icon: opt(fd, "icon"),
      title,
      category: opt(fd, "category"),
      content: str(fd, "content"),
      sort_order: num(fd, "sort_order"),
    });
    revalidateAll();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "保存失败" };
  }
}

export async function deleteGuideAction(id: string): Promise<void> {
  await requireAdmin();
  await getRepository().deleteGuide(id);
  revalidateAll();
}
