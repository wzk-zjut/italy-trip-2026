"use client";

import { useActionState, useEffect, useState } from "react";
import type { TripDay, Hotel } from "@/types";
import { Drawer } from "./Drawer";
import { Field, TextInput, TextArea, Select } from "./fields";
import { DeleteButton } from "./DeleteButton";
import { SpotsField } from "./SpotsField";
import { Button } from "@/components/ui/Button";
import { PaceBadge } from "@/components/ui/PaceBadge";
import { PlusIcon, PencilIcon } from "@/components/ui/icons";
import { PACE_OPTIONS } from "@/lib/utils/labels";
import { formatMonthDay } from "@/lib/utils/date";
import {
  saveDayAction,
  deleteDayAction,
  type SaveState,
} from "@/app/admin/data-actions";

type Props = {
  days: TripDay[];
  hotels: Hotel[];
  privateNotes: Record<string, string>;
};

export function AdminDayEditor({ days, hotels, privateNotes }: Props) {
  const [editing, setEditing] = useState<TripDay | null>(null);
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
        <PlusIcon className="h-4 w-4" /> 新增行程日
      </button>

      <ul className="space-y-2">
        {days.map((d) => (
          <li key={d.id}>
            <button
              type="button"
              onClick={() => setEditing(d)}
              className="flex w-full items-center justify-between gap-2 rounded-2xl border border-border bg-surface p-3 text-left"
            >
              <div className="min-w-0">
                <p className="text-xs text-muted">
                  {formatMonthDay(d.date)} · {d.weekday} · {d.city}
                </p>
                <p className="truncate font-medium text-foreground">
                  {d.title}
                </p>
              </div>
              <span className="flex shrink-0 items-center gap-2">
                <PaceBadge pace={d.pace} />
                <PencilIcon className="h-4 w-4 text-muted" />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Drawer
        open={open}
        onClose={close}
        title={creating ? "新增行程日" : "编辑行程日"}
      >
        <DayForm
          key={editing?.id ?? "new"}
          day={editing}
          hotels={hotels}
          privateNote={
            editing ? (privateNotes[`trip_day:${editing.id}`] ?? "") : ""
          }
          defaultSort={editing?.sort_order ?? days.length + 1}
          onDone={close}
        />
      </Drawer>
    </div>
  );
}

function DayForm({
  day,
  hotels,
  privateNote,
  defaultSort,
  onDone,
}: {
  day: TripDay | null;
  hotels: Hotel[];
  privateNote: string;
  defaultSort: number;
  onDone: () => void;
}) {
  const [state, formAction, pending] = useActionState<SaveState, FormData>(
    saveDayAction,
    { ok: false },
  );

  useEffect(() => {
    if (state.ok) onDone();
  }, [state, onDone]);

  return (
    <form action={formAction} className="space-y-3.5">
      {day && <input type="hidden" name="id" value={day.id} />}

      <div className="grid grid-cols-2 gap-3">
        <Field label="日期">
          <TextInput type="date" name="date" defaultValue={day?.date} required />
        </Field>
        <Field label="城市">
          <TextInput name="city" defaultValue={day?.city} placeholder="罗马" />
        </Field>
      </div>

      <Field label="标题">
        <TextInput
          name="title"
          defaultValue={day?.title}
          placeholder="当日标题"
          required
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="强度">
          <Select name="pace" defaultValue={day?.pace ?? "medium"}>
            {PACE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="排序">
          <TextInput type="number" name="sort_order" defaultValue={defaultSort} />
        </Field>
      </div>

      <Field label="酒店">
        <Select name="hotel_id" defaultValue={day?.hotel_id ?? ""}>
          <option value="">（无 / 途中）</option>
          {hotels.map((h) => (
            <option key={h.id} value={h.id}>
              {h.city} · {h.name}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="今日概要">
        <TextArea name="summary" defaultValue={day?.summary} />
      </Field>

      <Field label="上午">
        <TextArea name="morning" defaultValue={day?.morning} />
      </Field>
      <Field label="下午">
        <TextArea name="afternoon" defaultValue={day?.afternoon} />
      </Field>
      <Field label="晚上">
        <TextArea name="evening" defaultValue={day?.evening} />
      </Field>

      <Field label="交通">
        <TextArea name="transport_note" defaultValue={day?.transport_note} />
      </Field>
      <Field label="可选项目">
        <TextArea name="optional_plan" defaultValue={day?.optional_plan} />
      </Field>
      <Field label="餐饮备注">
        <TextArea name="food_note" defaultValue={day?.food_note} />
      </Field>
      <Field label="注意事项">
        <TextArea name="reminder" defaultValue={day?.reminder} />
      </Field>

      <Field label="地图 / 导航链接">
        <TextInput
          type="url"
          name="map_url"
          defaultValue={day?.map_url}
          placeholder="https://maps.google.com/..."
        />
      </Field>

      <Field
        label="景点 / 图片"
        hint="每个景点可放一张或多张本地图片：图片文件放到 public/ 下，路径写成 /images/xxx.jpg。文件没放时不显示，放进去即自动出现。"
      >
        <SpotsField name="spots" defaultValue={day?.spots ?? []} />
      </Field>

      <Field
        label="私密备注（仅后台可见）"
        hint="订单号、门锁密码等敏感信息放这里，公开页永不展示。"
      >
        <TextArea name="private_note" defaultValue={privateNote} />
      </Field>

      {state.error && <p className="text-sm text-rose-600">{state.error}</p>}

      <div className="flex items-center justify-between gap-3 pt-1">
        {day ? (
          <DeleteButton id={day.id} action={deleteDayAction} onDeleted={onDone} />
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
