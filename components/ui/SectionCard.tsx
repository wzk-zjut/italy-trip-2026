import type { ReactNode } from "react";

export function SectionCard({
  title,
  icon,
  action,
  children,
  className = "",
}: {
  title?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-border bg-surface p-4 shadow-sm ${className}`}
    >
      {(title || action) && (
        <div className="mb-2.5 flex items-center justify-between gap-2">
          {title && (
            <h2 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              {icon}
              {title}
            </h2>
          )}
          {action}
        </div>
      )}
      <div className="text-[15px] leading-relaxed text-foreground">{children}</div>
    </section>
  );
}
