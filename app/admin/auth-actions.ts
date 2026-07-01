"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  checkPasscode,
} from "@/lib/auth";

export type LoginState = { ok?: boolean; error?: string };

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const passcode = String(formData.get("passcode") ?? "");
  if (!checkPasscode(passcode)) {
    return {
      error: "口令不正确（或后台尚未配置 ADMIN_PASSCODE）。",
    };
  }
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE, // 秒
    expires: new Date(Date.now() + SESSION_MAX_AGE * 1000), // 双保险：部分浏览器更认 Expires
  });
  // 不在 action 里 redirect（server action + redirect + cookie 是易错组合）；
  // 交给客户端在拿到 ok 后做整页跳转，确保 cookie 已落地后再请求 /admin。
  return { ok: true };
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/admin/login");
}
