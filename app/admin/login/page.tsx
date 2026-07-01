"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, type LoginState } from "../auth-actions";
import { Button } from "@/components/ui/Button";
import { LockIcon } from "@/components/ui/icons";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    {},
  );

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

      <Link
        href="/"
        className="block text-center text-xs text-muted"
      >
        ← 返回公开页
      </Link>
    </div>
  );
}
