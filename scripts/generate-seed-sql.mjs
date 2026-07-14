// 从 data/*.json 生成 supabase/seed.sql，保证 JSON 与 SQL 种子数据一致。
// 用法：node scripts/generate-seed-sql.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (f) => JSON.parse(readFileSync(join(root, "data", f), "utf8"));

const days = read("trip-days.json");
const hotels = read("hotels.json");
const bookings = read("bookings.json");
const guides = read("guides.json");
const notes = read("private-notes.json");

function val(v) {
  if (v === undefined || v === null) return "NULL";
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "object")
    return "'" + JSON.stringify(v).replaceAll("'", "''") + "'::jsonb";
  return "'" + String(v).replaceAll("'", "''") + "'";
}

function insert(table, cols, rows) {
  if (!rows.length) return `-- ${table}: 无数据\n`;
  const lines = rows.map(
    (r) => "  (" + cols.map((c) => val(r[c])).join(", ") + ")",
  );
  return (
    `insert into public.${table} (${cols.join(", ")}) values\n` +
    lines.join(",\n") +
    `\non conflict (id) do nothing;\n`
  );
}

const dayCols = [
  "id", "date", "weekday", "city", "hotel_id", "title", "pace", "summary",
  "morning", "afternoon", "evening", "optional_plan", "transport_note",
  "food_note", "reminder", "map_url", "spots", "sort_order", "created_at", "updated_at",
];
const hotelCols = [
  "id", "city", "name", "check_in", "check_out", "nights", "area_note",
  "transport_note", "public_note", "sort_order", "created_at", "updated_at",
];
const bookingCols = [
  "id", "type", "title", "date", "time", "city", "status", "is_important",
  "public_note", "sort_order", "created_at", "updated_at",
];
const guideCols = [
  "id", "icon", "title", "category", "content", "sort_order", "created_at", "updated_at",
];
const noteCols = [
  "id", "entity_type", "entity_id", "note", "created_at", "updated_at",
];

const out = `-- =====================================================================
-- 意大利旅行 2026 —— 种子数据（Phase 2）
-- 自动生成：node scripts/generate-seed-sql.mjs（数据源 data/*.json）
-- 请勿手改此文件；如需修改数据，改 JSON 后重新生成。
-- 先执行 migrations/0001_init.sql 建表，再执行本文件。
-- =====================================================================

${insert("trip_days", dayCols, days)}
${insert("hotels", hotelCols, hotels)}
${insert("bookings", bookingCols, bookings)}
${insert("guides", guideCols, guides)}
${insert("private_notes", noteCols, notes)}`;

writeFileSync(join(root, "supabase", "seed.sql"), out, "utf8");
console.log(
  `wrote supabase/seed.sql (${days.length} days, ${hotels.length} hotels, ${bookings.length} bookings, ${guides.length} guides, ${notes.length} notes)`,
);
