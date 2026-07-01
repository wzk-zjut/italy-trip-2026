import { NextResponse } from "next/server";
import { getRepository } from "@/lib/data";

export const dynamic = "force-dynamic";

// 保活端点：被 Vercel Cron 每天调用一次，查询一下数据库，
// 以重置 Supabase 免费项目的「闲置」计时器，避免 7 天无访问被自动暂停。
export async function GET() {
  try {
    const days = await getRepository().getTripDays();
    return NextResponse.json({ ok: true, days: days.length });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "error" },
      { status: 500 },
    );
  }
}
