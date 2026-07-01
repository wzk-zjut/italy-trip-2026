import { LoadingState } from "@/components/ui/LoadingState";

export default function Loading() {
  return (
    <div className="space-y-4 pt-2">
      <div className="h-7 w-40 animate-pulse rounded bg-surface-muted" />
      <LoadingState rows={4} />
    </div>
  );
}
