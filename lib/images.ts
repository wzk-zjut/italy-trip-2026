import "server-only";

import { existsSync } from "node:fs";
import path from "node:path";

// 过滤出「实际可用」的图片：
// - 外链(http/https)：直接保留。
// - 本地路径(以 / 开头)：检查 public 下文件是否存在，存在才保留。
//   => 你还没把图片放进项目时不会出现坏图；放进 public/ 对应路径后自动显示。
export function existingImages(images?: string[]): string[] {
  if (!images || images.length === 0) return [];
  return images.filter((src) => {
    if (/^https?:\/\//i.test(src)) return true;
    if (src.startsWith("/")) {
      return existsSync(path.join(process.cwd(), "public", src));
    }
    return false;
  });
}
