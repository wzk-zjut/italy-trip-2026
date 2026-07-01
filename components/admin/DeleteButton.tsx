"use client";

import { useTransition } from "react";
import { TrashIcon } from "@/components/ui/icons";

export function DeleteButton({
  id,
  action,
  onDeleted,
  label = "删除",
}: {
  id: string;
  action: (id: string) => Promise<void>;
  onDeleted?: () => void;
  label?: string;
}) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm("确定删除？此操作不可撤销。")) {
          start(async () => {
            await action(id);
            onDeleted?.();
          });
        }
      }}
      className="inline-flex items-center gap-1 text-sm text-rose-600 disabled:opacity-50"
    >
      <TrashIcon className="h-4 w-4" />
      {pending ? "删除中…" : label}
    </button>
  );
}
