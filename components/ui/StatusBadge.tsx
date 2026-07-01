import { STATUS_META } from "@/lib/utils/labels";
import type { BookingStatus } from "@/types";

export function StatusBadge({
  status,
  className = "",
}: {
  status: BookingStatus;
  className?: string;
}) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${meta.className} ${className}`}
    >
      {meta.label}
    </span>
  );
}
