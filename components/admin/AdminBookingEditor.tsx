"use client";

import { useActionState, useEffect, useState } from "react";
import type { Booking } from "@/types";
import { Drawer } from "./Drawer";
import { Field, TextInput, TextArea, Select } from "./fields";
import { DeleteButton } from "./DeleteButton";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PlusIcon, PencilIcon } from "@/components/ui/icons";
import {
  BOOKING_TYPE_OPTIONS,
  STATUS_OPTIONS,
  BOOKING_TYPE_META,
} from "@/lib/utils/labels";
import { formatMonthDay } from "@/lib/utils/date";
import {
  saveBookingAction,
  deleteBookingAction,
  type SaveState,
} from "@/app/admin/data-actions";

type Props = { bookings: Booking[]; privateNotes: Record<string, string> };

export function AdminBookingEditor({ bookings, privateNotes }: Props) {
  const [editing, setEditing] = useState<Booking | null>(null);
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
        <PlusIcon className="h-4 w-4" /> 新增票务 / 预约
      </button>

      <ul className="space-y-2">
        {bookings.map((b) => (
          <li key={b.id}>
            <button
              type="button"
              onClick={() => setEditing(b)}
              className="flex w-full items-center justify-between gap-2 rounded-2xl border border-border bg-surface p-3 text-left"
            >
              <div className="min-w-0">
                <p className="text-xs text-muted">
                  {BOOKING_TYPE_META[b.type].label} · {formatMonthDay(b.date)}
                  {b.time ? ` · ${b.time}` : ""}
                </p>
                <p className="truncate font-medium text-foreground">{b.title}</p>
              </div>
              <span className="flex shrink-0 items-center gap-2">
                <StatusBadge status={b.status} />
                <PencilIcon className="h-4 w-4 text-muted" />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Drawer
        open={open}
        onClose={close}
        title={creating ? "新增票务 / 预约" : "编辑票务 / 预约"}
      >
        <BookingForm
          key={editing?.id ?? "new"}
          booking={editing}
          privateNote={
            editing ? (privateNotes[`booking:${editing.id}`] ?? "") : ""
          }
          defaultSort={editing?.sort_order ?? bookings.length + 1}
          onDone={close}
        />
      </Drawer>
    </div>
  );
}

function BookingForm({
  booking,
  privateNote,
  defaultSort,
  onDone,
}: {
  booking: Booking | null;
  privateNote: string;
  defaultSort: number;
  onDone: () => void;
}) {
  const [state, formAction, pending] = useActionState<SaveState, FormData>(
    saveBookingAction,
    { ok: false },
  );

  useEffect(() => {
    if (state.ok) onDone();
  }, [state, onDone]);

  return (
    <form action={formAction} className="space-y-3.5">
      {booking && <input type="hidden" name="id" value={booking.id} />}

      <div className="grid grid-cols-2 gap-3">
        <Field label="类型">
          <Select name="type" defaultValue={booking?.type ?? "ticket"}>
            {BOOKING_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="状态">
          <Select name="status" defaultValue={booking?.status ?? "todo"}>
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="标题">
        <TextInput name="title" defaultValue={booking?.title} required />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="日期">
          <TextInput
            type="date"
            name="date"
            defaultValue={booking?.date}
            required
          />
        </Field>
        <Field label="时间" hint="可留空">
          <TextInput
            name="time"
            defaultValue={booking?.time}
            placeholder="09:30"
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="城市">
          <TextInput name="city" defaultValue={booking?.city} />
        </Field>
        <Field label="排序">
          <TextInput type="number" name="sort_order" defaultValue={defaultSort} />
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          name="is_important"
          value="true"
          defaultChecked={booking?.is_important ?? false}
          className="h-4 w-4 rounded border-border accent-accent"
        />
        标记为重要
      </label>

      <Field label="公开备注">
        <TextArea name="public_note" defaultValue={booking?.public_note} />
      </Field>

      <Field
        label="私密备注（仅后台可见）"
        hint="票据代码、二维码来源等，公开页永不展示。"
      >
        <TextArea name="private_note" defaultValue={privateNote} />
      </Field>

      {state.error && <p className="text-sm text-rose-600">{state.error}</p>}

      <div className="flex items-center justify-between gap-3 pt-1">
        {booking ? (
          <DeleteButton
            id={booking.id}
            action={deleteBookingAction}
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
