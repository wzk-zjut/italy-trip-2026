import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Phase 2 的 Supabase 客户端（服务端）。仅在 DATA_BACKEND=supabase 时被调用。

function need(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(`缺少环境变量 ${name}（DATA_BACKEND=supabase 时必填）`);
  }
  return v;
}

// 匿名只读客户端：用于公开数据读取，受 RLS 限制（只能读公开表）。
export function readerClient(): SupabaseClient {
  return createClient(
    need("NEXT_PUBLIC_SUPABASE_URL"),
    need("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

// service_role 客户端：用于后台写入与读取私密备注。
// 绝不能在前端使用；本文件用 "server-only" 保证只在服务端引入。
export function serviceClient(): SupabaseClient {
  return createClient(
    need("NEXT_PUBLIC_SUPABASE_URL"),
    need("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
