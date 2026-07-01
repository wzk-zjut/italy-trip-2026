import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/ui/BottomNav";

export const metadata: Metadata = {
  title: "意大利旅行 2026",
  description: "2026.09.24 - 2026.10.03 ｜ 罗马 → 佛罗伦萨 → 米兰 → 威尼斯",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f6f5f2",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full">
        <div className="mx-auto flex min-h-dvh w-full max-w-[640px] flex-col">
          <main className="flex-1 px-4 pt-4 pb-28">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
