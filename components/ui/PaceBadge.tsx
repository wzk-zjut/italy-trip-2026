import { PACE_META } from "@/lib/utils/labels";
import type { Pace } from "@/types";

export function PaceBadge({
  pace,
  className = "",
}: {
  pace: Pace;
  className?: string;
}) {
  const meta = PACE_META[pace];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${meta.className} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} aria-hidden />
      {meta.label}
    </span>
  );
}
