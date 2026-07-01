// 日期展示工具。数据里的 date 一律为 YYYY-MM-DD，直接按字符串解析，
// 避免时区导致的日期偏移。

const WEEKDAYS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

export function parseYmd(date: string): { y: number; m: number; d: number } {
  const [y, m, d] = date.split("-").map((n) => Number(n));
  return { y, m, d };
}

// 9月24日
export function formatMonthDay(date: string): string {
  const { m, d } = parseYmd(date);
  return `${m}月${d}日`;
}

// 09.24
export function formatShort(date: string): string {
  const { m, d } = parseYmd(date);
  return `${String(m).padStart(2, "0")}.${String(d).padStart(2, "0")}`;
}

// 由日期计算星期（当数据未提供 weekday 时的兜底）
export function weekdayOf(date: string): string {
  const { y, m, d } = parseYmd(date);
  const idx = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return WEEKDAYS[idx];
}
