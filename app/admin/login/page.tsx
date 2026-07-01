"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { login, type LoginState } from "../auth-actions";
import { Button } from "@/components/ui/Button";
import { LockIcon } from "@/components/ui/icons";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    {},
  );

  // 登录成功后整页跳转到 /admin（此时 cookie 已由 action 响应写入浏览器）
  useEffect(() => {
    if (state.ok) window.location.assign("/admin");
  }, [state.ok]);

  // 临时诊断：被中间件踢回登录页时，URL 带 ?r=原因，这里显示出来
  const [reason, setReason] = useState<string | null>(null);
  useEffect(() => {
    const r = new URLSearchParams(window.location.search).get("r");
    if (r) setReason(r);
  }, []);

  return (
    <div className="mx-auto max-w-sm space-y-6 pt-12">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface ring-1 ring-border">
          <LockIcon className="h-5 w-5 text-accent" />
        </div>
        <h1 className="mt-3 text-xl font-bold tracking-tight text-foreground">
          管理后台登录
        </h1>
        <p className="mt-1 text-sm text-muted">
          输入口令以编辑行程。公开页无需登录。
        </p>
      </div>

      <form action={formAction} className="space-y-3">
        <input
          name="passcode"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          placeholder="后台口令"
          className="w-full rounded-xl border border-border bg-surface px-3.5 py-3 text-base outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
        {state.error && (
          <p className="text-sm text-rose-600">{state.error}</p>
        )}
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "登录中…" : "登录"}
        </Button>
      </form>

      {reason && (
        <p className="rounded-lg bg-surface-muted px-3 py-2 text-center text-xs text-muted">
          调试：登录态失效原因 = <span className="font-mono text-foreground">{reason}</span>
        </p>
      )}

      <Link
        href="/"
        className="block text-center text-xs text-muted"
      >
        ← 返回公开页
      </Link>
    </div>
  );
}
