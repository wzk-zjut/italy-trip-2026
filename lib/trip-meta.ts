// 行程元信息集中一处，供首页、导出（Markdown / PDF）共用，避免多处不一致。
export const TRIP_META = {
  title: "意大利旅行 2026",
  dateRange: "2026.09.24 - 2026.10.03",
  route: "罗马 → 佛罗伦萨 → 米兰 → 威尼斯",
  get subtitle() {
    return `${this.dateRange} ｜ ${this.route}`;
  },
} as const;
