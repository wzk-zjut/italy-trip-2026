import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "../auth-actions";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { LogOutIcon, EyeIcon } from "@/components/ui/icons";

export const dynamic = "force-dynamic";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="space-y-4">
      <header className="space-y-3 pt-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-medium text-accent">意大利旅行 2026</p>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              管理后台
            </h1>
          </div>
          {/* 退出登录：缩到角落、弱化，避免误点 */}
          <form action={logout}>
            <button
              type="submit"
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted"
            >
              <LogOutIcon className="h-3.5 w-3.5" /> 退出登录
            </button>
          </form>
        </div>

        {/* 查看公开页：醒目大按钮，和退出分开 */}
        <Link
          href="/"
          className="flex items-center justify-center gap-1.5 rounded-xl border border-accent/40 bg-surface py-3 text-sm font-medium text-accent"
        >
          <EyeIcon className="h-4 w-4" /> 查看公开页
        </Link>
      </header>

      <AdminTabs />
      {children}
    </div>
  );
}
