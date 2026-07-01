import { NextResponse, type NextRequest } from "next/server";

// 在渲染前拦截 /admin/*（放行 /admin/login）。未登录 → 干净的 307 跳转，
// 不发送任何后台内容，避免流式渲染下 redirect 退化为客户端跳转造成的内容泄露。
// 运行在 Edge 运行时，使用 Web Crypto 校验与 lib/auth.ts 相同的 HMAC 签名 cookie。

const SESSION_COOKIE = "italy_admin";
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 30; // 1 个月（与 lib/auth.ts 保持一致）

function bytesToBase64url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlToBinary(b64url: string): string {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  return atob(b64);
}

function secret(): string {
  return (
    process.env.SESSION_SECRET ||
    process.env.ADMIN_PASSCODE ||
    "insecure-dev-secret-change-me"
  );
}

async function verifyToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  const expected = bytesToBase64url(new Uint8Array(mac));
  if (expected !== sig) return false;

  const issued = Number(base64urlToBinary(payload));
  if (!Number.isFinite(issued)) return false;
  const age = Date.now() - issued;
  return age >= 0 && age < MAX_AGE_MS;
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 放行登录页（及其 server action POST）
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (await verifyToken(token)) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*"],
};
