import type { ReactNode } from "react";

export function TripHeader({
  title,
  subtitle,
  kicker,
  children,
}: {
  title: string;
  subtitle?: string;
  kicker?: string;
  children?: ReactNode;
}) {
  return (
    <header className="pt-2">
      {kicker && (
        <p className="text-xs font-medium tracking-wide text-accent">{kicker}</p>
      )}
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        {title}
      </h1>
      {subtitle && <p className="mt-1.5 text-sm text-muted">{subtitle}</p>}
      {children && <div className="mt-3">{children}</div>}
    </header>
  );
}
