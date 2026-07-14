"use client";

import { useActionState, useEffect, useState } from "react";
import type { Guide } from "@/types";
import { Drawer } from "./Drawer";
import { Field, TextInput, TextArea } from "./fields";
import { DeleteButton } from "./DeleteButton";
import { Button } from "@/components/ui/Button";
import { PlusIcon, PencilIcon } from "@/components/ui/icons";
import {
  saveGuideAction,
  deleteGuideAction,
  type SaveState,
} from "@/app/admin/data-actions";

export function AdminGuideEditor({ guides }: { guides: Guide[] }) {
  const [editing, setEditing] = useState<Guide | null>(null);
  const [creating, setCreating] = useState(false);
  const open = creating || editing !== null;
  const close = () => {
    setEditing(null);
    setCreating(false);
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setCreating(true)}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border bg-surface py-3 text-sm font-medium text-accent"
      >
        <PlusIcon className="h-4 w-4" /> 新增贴士
      </button>

      <ul className="space-y-2">
        {guides.map((g) => (
          <li key={g.id}>
            <button
              type="button"
              onClick={() => setEditing(g)}
              className="flex w-full items-center justify-between gap-2 rounded-2xl border border-border bg-surface p-3 text-left"
            >
              <div className="min-w-0">
                <p className="text-xs text-muted">{g.category || "贴士"}</p>
                <p className="truncate font-medium text-foreground">
                  {g.title}
                </p>
              </div>
              <PencilIcon className="h-4 w-4 shrink-0 text-muted" />
            </button>
          </li>
        ))}
      </ul>

      <Drawer
        open={open}
        onClose={close}
        title={creating ? "新增贴士" : "编辑贴士"}
      >
        <GuideForm
          key={editing?.id ?? "new"}
          guide={editing}
          defaultSort={editing?.sort_order ?? guides.length + 1}
          onDone={close}
        />
      </Drawer>
    </div>
  );
}

function GuideForm({
  guide,
  defaultSort,
  onDone,
}: {
  guide: Guide | null;
  defaultSort: number;
  onDone: () => void;
}) {
  const [state, formAction, pending] = useActionState<SaveState, FormData>(
    saveGuideAction,
    { ok: false },
  );

  useEffect(() => {
    if (state.ok) onDone();
  }, [state, onDone]);

  return (
    <form action={formAction} className="space-y-3.5">
      {guide && <input type="hidden" name="id" value={guide.id} />}

      <Field label="分类">
        <TextInput
          name="category"
          defaultValue={guide?.category}
          placeholder="交通 / 餐饮…（可选）"
        />
      </Field>

      <Field label="标题">
        <TextInput name="title" defaultValue={guide?.title} required />
      </Field>

      <Field
        label="正文（支持 Markdown）"
        hint="换行会保留；支持 **加粗**、- 列表、### 小标题、[名称](链接)；直接粘贴的网址也会自动变可点链接。"
      >
        <TextArea name="content" defaultValue={guide?.content} rows={8} />
      </Field>

      <Field label="排序">
        <TextInput type="number" name="sort_order" defaultValue={defaultSort} />
      </Field>

      {state.error && <p className="text-sm text-rose-600">{state.error}</p>}

      <div className="flex items-center justify-between gap-3 pt-1">
        {guide ? (
          <DeleteButton
            id={guide.id}
            action={deleteGuideAction}
            onDeleted={onDone}
          />
        ) : (
          <span />
        )}
        <Button type="submit" disabled={pending}>
          {pending ? "保存中…" : "保存"}
        </Button>
      </div>
    </form>
  );
}
