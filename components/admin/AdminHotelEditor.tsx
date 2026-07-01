"use client";

import { useActionState, useEffect, useState } from "react";
import type { Hotel } from "@/types";
import { Drawer } from "./Drawer";
import { Field, TextInput, TextArea } from "./fields";
import { DeleteButton } from "./DeleteButton";
import { Button } from "@/components/ui/Button";
import { PlusIcon, PencilIcon } from "@/components/ui/icons";
import { formatMonthDay } from "@/lib/utils/date";
import {
  saveHotelAction,
  deleteHotelAction,
  type SaveState,
} from "@/app/admin/data-actions";

type Props = { hotels: Hotel[]; privateNotes: Record<string, string> };

export function AdminHotelEditor({ hotels, privateNotes }: Props) {
  const [editing, setEditing] = useState<Hotel | null>(null);
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
        <PlusIcon className="h-4 w-4" /> 新增酒店
      </button>

      <ul className="space-y-2">
        {hotels.map((h) => (
          <li key={h.id}>
            <button
              type="button"
              onClick={() => setEditing(h)}
              className="flex w-full items-center justify-between gap-2 rounded-2xl border border-border bg-surface p-3 text-left"
            >
              <div className="min-w-0">
                <p className="text-xs text-muted">
                  {h.city} · {formatMonthDay(h.check_in)}–
                  {formatMonthDay(h.check_out)} · {h.nights} 晚
                </p>
                <p className="truncate font-medium text-foreground">{h.name}</p>
              </div>
              <PencilIcon className="h-4 w-4 shrink-0 text-muted" />
            </button>
          </li>
        ))}
      </ul>

      <Drawer
        open={open}
        onClose={close}
        title={creating ? "新增酒店" : "编辑酒店"}
      >
        <HotelForm
          key={editing?.id ?? "new"}
          hotel={editing}
          privateNote={editing ? (privateNotes[`hotel:${editing.id}`] ?? "") : ""}
          defaultSort={editing?.sort_order ?? hotels.length + 1}
          onDone={close}
        />
      </Drawer>
    </div>
  );
}

function HotelForm({
  hotel,
  privateNote,
  defaultSort,
  onDone,
}: {
  hotel: Hotel | null;
  privateNote: string;
  defaultSort: number;
  onDone: () => void;
}) {
  const [state, formAction, pending] = useActionState<SaveState, FormData>(
    saveHotelAction,
    { ok: false },
  );

  useEffect(() => {
    if (state.ok) onDone();
  }, [state, onDone]);

  return (
    <form action={formAction} className="space-y-3.5">
      {hotel && <input type="hidden" name="id" value={hotel.id} />}

      <div className="grid grid-cols-2 gap-3">
        <Field label="城市">
          <TextInput name="city" defaultValue={hotel?.city} placeholder="罗马" />
        </Field>
        <Field label="排序">
          <TextInput type="number" name="sort_order" defaultValue={defaultSort} />
        </Field>
      </div>

      <Field label="酒店名称">
        <TextInput name="name" defaultValue={hotel?.name} required />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="入住日期">
          <TextInput
            type="date"
            name="check_in"
            defaultValue={hotel?.check_in}
            required
          />
        </Field>
        <Field label="退房日期">
          <TextInput
            type="date"
            name="check_out"
            defaultValue={hotel?.check_out}
            required
          />
        </Field>
      </div>

      <Field label="晚数" hint="留空则按入住/退房日期自动计算。">
        <TextInput type="number" name="nights" defaultValue={hotel?.nights} />
      </Field>

      <Field label="位置说明">
        <TextArea name="area_note" defaultValue={hotel?.area_note} />
      </Field>
      <Field label="交通说明">
        <TextArea name="transport_note" defaultValue={hotel?.transport_note} />
      </Field>
      <Field label="公开备注">
        <TextArea name="public_note" defaultValue={hotel?.public_note} />
      </Field>

      <Field
        label="私密备注（仅后台可见）"
        hint="预订平台确认号、房东联系方式等，公开页永不展示。"
      >
        <TextArea name="private_note" defaultValue={privateNote} />
      </Field>

      {state.error && <p className="text-sm text-rose-600">{state.error}</p>}

      <div className="flex items-center justify-between gap-3 pt-1">
        {hotel ? (
          <DeleteButton
            id={hotel.id}
            action={deleteHotelAction}
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
