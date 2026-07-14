"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  match: (path: string) => boolean;
};

const items: NavItem[] = [
  {
    href: "/",
    label: "行程",
    match: (p) => p === "/" || p.startsWith("/day"),
    icon: (
      <path d="M8 2v3M16 2v3M3.5 9h17M5 5h14a1.5 1.5 0 0 1 1.5 1.5V19A1.5 1.5 0 0 1 19 20.5H5A1.5 1.5 0 0 1 3.5 19V6.5A1.5 1.5 0 0 1 5 5Z" />
    ),
  },
  {
    href: "/hotels",
    label: "酒店",
    match: (p) => p.startsWith("/hotels"),
    icon: <path d="M3 20V7m0 6h14a3 3 0 0 1 3 3v4M3 9h4a3 3 0 0 1 3 3v1M20 20v-2" />,
  },
  {
    href: "/bookings",
    label: "票务",
    match: (p) => p.startsWith("/bookings"),
    icon: (
      <path d="M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v3a2 2 0 0 0 0 4v3a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5v-3a2 2 0 0 0 0-4v-3ZM14 5v14" />
    ),
  },
  {
    href: "/tips",
    label: "贴士",
    match: (p) => p.startsWith("/tips"),
    icon: (
      <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.5.4.9 1 1 1.7l.2.4h4.6l.2-.4c.1-.7.5-1.3 1-1.7A6 6 0 0 0 12 3Z" />
    ),
  },
  {
    href: "/admin",
    label: "管理",
    match: (p) => p.startsWith("/admin"),
    icon: (
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7.4-2.1.1-1.4-.1-1.4 1.6-1.3-1.5-2.6-2 .6a7 7 0 0 0-2.4-1.4L14 2h-4l-.6 2.4A7 7 0 0 0 7 5.8l-2-.6L3.5 7.8 5.1 9a7 7 0 0 0 0 2.8L3.5 13l1.5 2.6 2-.6a7 7 0 0 0 2.4 1.4L10 22h4l.6-2.4a7 7 0 0 0 2.4-1.4l2 .6 1.5-2.6-1.6-1.3Z" />
    ),
  },
];

export function BottomNav() {
  const pathname = usePathname() ?? "/";
  // 后台有自己的导航，公开底部导航在 /admin 下不显示
  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="site-bottom-nav pb-safe fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[640px] border-t border-border bg-surface/95 backdrop-blur">
      <ul className="flex items-stretch justify-around">
        {items.map((item) => {
          const active = item.match(pathname);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-1 py-2.5 text-[11px] transition-colors ${
                  active ? "text-accent" : "text-muted"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={active ? 2 : 1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  {item.icon}
                </svg>
                <span className={active ? "font-medium" : ""}>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
