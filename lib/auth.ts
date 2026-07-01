import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Phase 1 的后台鉴权：环境变量口令 + HMAC 签名 cookie（Node 运行时）。
// 说明：口令与密钥都来自环境变量，不硬编码；Phase 2 可替换为 Supabase Auth。

export const SESSION_COOKIE = "italy_admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 天

function secret(): string {
  // 优先 SESSION_SECRET；缺省时退化到 ADMIN_PASSCODE 派生（会话仍有效，
  // 但强烈建议在 .env.local 显式设置 SESSION_SECRET）。
  return (
    process.env.SESSION_SECRET ||
    process.env.ADMIN_PASSCODE ||
    "insecure-dev-secret-change-me"
  );
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export function createSessionToken(): string {
  const payload = Buffer.from(String(Date.now())).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  if (!safeEqual(sig, sign(payload))) return false;
  const issued = Number(Buffer.from(payload, "base64url").toString("utf8"));
  if (!Number.isFinite(issued)) return false;
  const ageSec = (Date.now() - issued) / 1000;
  return ageSec >= 0 && ageSec < MAX_AGE_SECONDS;
}

export function passcodeConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSCODE);
}

export function checkPasscode(input: string): boolean {
  const expected = process.env.ADMIN_PASSCODE;
  if (!expected) return false; // 未配置口令 → 一律拒绝登录
  return safeEqual(input, expected);
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

// 在受保护的 layout / 页面 / 写操作里调用；未登录则跳转登录页。
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}

export const SESSION_MAX_AGE = MAX_AGE_SECONDS;
