import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "../auth-actions";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { LogOutIcon } from "@/components/ui/icons";

export const dynamic = "force-dynamic";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="space-y-4">
      <header className="flex items-start justify-between gap-2 pt-1">
        <div>
          <p className="text-xs font-medium text-accent">意大利旅行 2026</p>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            管理后台
          </h1>
        </div>
        <div className="flex items-center gap-3 pt-1">
          <Link href="/" className="text-xs text-muted">
            公开页
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="inline-flex items-center gap-1 text-xs text-muted"
            >
              <LogOutIcon className="h-3.5 w-3.5" /> 退出
            </button>
          </form>
        </div>
      </header>

      <AdminTabs />
      {children}
    </div>
  );
}
