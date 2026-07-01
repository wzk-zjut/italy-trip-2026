"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/admin", label: "概览", exact: true },
  { href: "/admin/days", label: "行程" },
  { href: "/admin/hotels", label: "酒店" },
  { href: "/admin/bookings", label: "票务" },
];

export function AdminTabs() {
  const pathname = usePathname() ?? "/admin";
  return (
    <nav className="flex gap-1 rounded-xl border border-border bg-surface p-1 text-sm">
      {tabs.map((t) => {
        const active = t.exact
          ? pathname === t.href
          : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`flex-1 rounded-lg px-2 py-1.5 text-center transition-colors ${
              active
                ? "bg-accent text-white"
                : "text-muted hover:text-foreground"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
