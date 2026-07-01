import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

import type {
  TripDay,
  Hotel,
  Booking,
  PrivateNote,
  EntityType,
} from "@/types";
import type {
  TripRepository,
  TripDayInput,
  HotelInput,
  BookingInput,
  PrivateNoteInput,
} from "./repository";

// Phase 1 数据源：仓库根目录下的 data/*.json。
// 读：每次请求实时读取文件（页面需设为动态渲染），后台保存后即可反映。
// 写：Node fs 写回文件 —— 仅在「可写文件系统」有效（本地 npm run dev、
//      自有可写盘的服务器）。Vercel 无服务器只读，写入不持久，需切到 Phase 2。

const DATA_DIR = path.join(process.cwd(), "data");

const FILES = {
  tripDays: "trip-days.json",
  hotels: "hotels.json",
  bookings: "bookings.json",
  privateNotes: "private-notes.json",
} as const;

async function readAll<T>(file: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

async function writeAll<T>(file: string, rows: T[]): Promise<void> {
  const target = path.join(DATA_DIR, file);
  await fs.writeFile(target, JSON.stringify(rows, null, 2) + "\n", "utf8");
}

function now(): string {
  return new Date().toISOString();
}

const bySortOrder = (a: { sort_order: number }, b: { sort_order: number }) =>
  a.sort_order - b.sort_order;

export const jsonRepository: TripRepository = {
  // ---------------- 公开读取 ----------------
  async getTripDays() {
    const rows = await readAll<TripDay>(FILES.tripDays);
    return rows.sort(bySortOrder);
  },

  async getTripDay(date) {
    const rows = await readAll<TripDay>(FILES.tripDays);
    return rows.find((d) => d.date === date) ?? null;
  },

  async getHotels() {
    const rows = await readAll<Hotel>(FILES.hotels);
    return rows.sort(bySortOrder);
  },

  async getHotel(id) {
    const rows = await readAll<Hotel>(FILES.hotels);
    return rows.find((h) => h.id === id) ?? null;
  },

  async getBookings() {
    const rows = await readAll<Booking>(FILES.bookings);
    return rows.sort(
      (a, b) => a.date.localeCompare(b.date) || bySortOrder(a, b),
    );
  },

  // ---------------- 行程写入 ----------------
  async saveTripDay(input: TripDayInput) {
    const rows = await readAll<TripDay>(FILES.tripDays);
    const ts = now();
    if (input.id) {
      const idx = rows.findIndex((d) => d.id === input.id);
      if (idx >= 0) {
        const updated: TripDay = {
          ...rows[idx],
          ...input,
          id: input.id,
          created_at: rows[idx].created_at,
          updated_at: ts,
        };
        rows[idx] = updated;
        await writeAll(FILES.tripDays, rows.sort(bySortOrder));
        return updated;
      }
    }
    const created: TripDay = {
      ...input,
      id: input.id ?? randomUUID(),
      created_at: ts,
      updated_at: ts,
    };
    rows.push(created);
    await writeAll(FILES.tripDays, rows.sort(bySortOrder));
    return created;
  },

  async deleteTripDay(id) {
    const rows = await readAll<TripDay>(FILES.tripDays);
    await writeAll(
      FILES.tripDays,
      rows.filter((d) => d.id !== id),
    );
  },

  // ---------------- 酒店写入 ----------------
  async saveHotel(input: HotelInput) {
    const rows = await readAll<Hotel>(FILES.hotels);
    const ts = now();
    if (input.id) {
      const idx = rows.findIndex((h) => h.id === input.id);
      if (idx >= 0) {
        const updated: Hotel = {
          ...rows[idx],
          ...input,
          id: input.id,
          created_at: rows[idx].created_at,
          updated_at: ts,
        };
        rows[idx] = updated;
        await writeAll(FILES.hotels, rows.sort(bySortOrder));
        return updated;
      }
    }
    const created: Hotel = {
      ...input,
      id: input.id ?? randomUUID(),
      created_at: ts,
      updated_at: ts,
    };
    rows.push(created);
    await writeAll(FILES.hotels, rows.sort(bySortOrder));
    return created;
  },

  async deleteHotel(id) {
    const rows = await readAll<Hotel>(FILES.hotels);
    await writeAll(
      FILES.hotels,
      rows.filter((h) => h.id !== id),
    );
  },

  // ---------------- 票务写入 ----------------
  async saveBooking(input: BookingInput) {
    const rows = await readAll<Booking>(FILES.bookings);
    const ts = now();
    if (input.id) {
      const idx = rows.findIndex((b) => b.id === input.id);
      if (idx >= 0) {
        const updated: Booking = {
          ...rows[idx],
          ...input,
          id: input.id,
          created_at: rows[idx].created_at,
          updated_at: ts,
        };
        rows[idx] = updated;
        await writeAll(FILES.bookings, rows);
        return updated;
      }
    }
    const created: Booking = {
      ...input,
      id: input.id ?? randomUUID(),
      created_at: ts,
      updated_at: ts,
    };
    rows.push(created);
    await writeAll(FILES.bookings, rows);
    return created;
  },

  async deleteBooking(id) {
    const rows = await readAll<Booking>(FILES.bookings);
    await writeAll(
      FILES.bookings,
      rows.filter((b) => b.id !== id),
    );
  },

  // ---------------- 私密备注 ----------------
  async getPrivateNotes(entityType?: EntityType, entityId?: string) {
    const rows = await readAll<PrivateNote>(FILES.privateNotes);
    return rows.filter(
      (n) =>
        (!entityType || n.entity_type === entityType) &&
        (!entityId || n.entity_id === entityId),
    );
  },

  async savePrivateNote(input: PrivateNoteInput) {
    const rows = await readAll<PrivateNote>(FILES.privateNotes);
    const ts = now();
    if (input.id) {
      const idx = rows.findIndex((n) => n.id === input.id);
      if (idx >= 0) {
        const updated: PrivateNote = {
          ...rows[idx],
          ...input,
          id: input.id,
          created_at: rows[idx].created_at,
          updated_at: ts,
        };
        rows[idx] = updated;
        await writeAll(FILES.privateNotes, rows);
        return updated;
      }
    }
    const created: PrivateNote = {
      ...input,
      id: input.id ?? randomUUID(),
      created_at: ts,
      updated_at: ts,
    };
    rows.push(created);
    await writeAll(FILES.privateNotes, rows);
    return created;
  },

  async deletePrivateNote(id) {
    const rows = await readAll<PrivateNote>(FILES.privateNotes);
    await writeAll(
      FILES.privateNotes,
      rows.filter((n) => n.id !== id),
    );
  },
};
