export function LoadingState({
  rows = 3,
  label = "加载中…",
}: {
  rows?: number;
  label?: string;
}) {
  return (
    <div className="space-y-3" role="status" aria-label={label}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-border bg-surface p-4"
        >
          <div className="h-4 w-1/3 rounded bg-surface-muted" />
          <div className="mt-3 h-3 w-2/3 rounded bg-surface-muted" />
          <div className="mt-2 h-3 w-1/2 rounded bg-surface-muted" />
        </div>
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
}
