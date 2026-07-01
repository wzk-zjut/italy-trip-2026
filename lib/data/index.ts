import "server-only";

import type { TripRepository } from "./repository";
import { jsonRepository } from "./json-repository";
import { supabaseRepository } from "./supabase-repository";

// 数据后端选择器：
//   DATA_BACKEND=json（默认，Phase 1）→ 读写本地 data/*.json
//   DATA_BACKEND=supabase（Phase 2）   → 读写 Supabase
// 注意：Supabase 客户端是「懒创建」的（只在其方法被调用时才实例化），
// 因此 json 模式下即便没有任何 Supabase 环境变量也不会报错。
export function getRepository(): TripRepository {
  const backend = process.env.DATA_BACKEND ?? "json";
  return backend === "supabase" ? supabaseRepository : jsonRepository;
}

export type { TripRepository } from "./repository";
