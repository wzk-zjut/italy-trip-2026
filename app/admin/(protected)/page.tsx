import Link from "next/link";
import { getRepository } from "@/lib/data";
import {
  CalendarIcon,
  BedIcon,
  TicketIcon,
  ArrowRightIcon,
  AlertIcon,
} from "@/components/ui/icons";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const repo = getRepository();
  const [days, hotels, bookings] = await Promise.all([
    repo.getTripDays(),
    repo.getHotels(),
    repo.getBookings(),
  ]);
  const todo = bookings.filter((b) => b.status === "todo").length;

  const cards = [
    {
      href: "/admin/days",
      label: "行程日",
      count: days.length,
      icon: <CalendarIcon className="h-5 w-5" />,
    },
    {
      href: "/admin/hotels",
      label: "酒店",
      count: hotels.length,
      icon: <BedIcon className="h-5 w-5" />,
    },
    {
      href: "/admin/bookings",
      label: "票务",
      count: bookings.length,
      icon: <TicketIcon className="h-5 w-5" />,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-2xl border border-border bg-surface p-3 text-center shadow-sm"
          >
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-surface-muted text-accent">
              {c.icon}
            </div>
            <p className="mt-1.5 text-2xl font-bold text-foreground">
              {c.count}
            </p>
            <p className="text-xs text-muted">{c.label}</p>
          </Link>
        ))}
      </div>

      {todo > 0 && (
        <Link
          href="/admin/bookings"
          className="flex items-center justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm text-amber-900"
        >
          <span className="inline-flex items-center gap-2">
            <AlertIcon className="h-4 w-4" />还有 {todo} 项待订
          </span>
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      )}

      {!process.env.SESSION_SECRET && (
        <div className="rounded-xl border border-dashed border-border bg-surface px-3.5 py-3 text-xs text-muted">
          提示：尚未设置 <code className="text-foreground">SESSION_SECRET</code>
          ，当前用口令派生签名密钥。建议在 <code>.env.local</code> 中设置一段随机长字符串。
        </div>
      )}

      <div className="rounded-xl border border-dashed border-border bg-surface px-3.5 py-3 text-xs text-muted">
        Phase 1：编辑会写入本地 <code className="text-foreground">data/*.json</code>
        ，仅在可写环境（本地 <code>npm run dev</code> 或自有可写盘服务器）持久化。
        Vercel 只读，需切到 Supabase（见 README）。
      </div>
    </div>
  );
}
