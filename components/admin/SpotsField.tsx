"use client";

import { useState } from "react";
import type { Spot, Slot } from "@/types";
import { TextInput, TextArea, Select } from "./fields";
import { PlusIcon, TrashIcon } from "@/components/ui/icons";

const SLOTS: { value: Slot; label: string }[] = [
  { value: "morning", label: "上午" },
  { value: "afternoon", label: "下午" },
  { value: "evening", label: "晚上" },
];

function newId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `spot-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  }
}

// 景点列表编辑：状态放在 React 里，同步写入一个隐藏 input(JSON)，随表单提交。
export function SpotsField({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue: Spot[];
}) {
  const [spots, setSpots] = useState<Spot[]>(defaultValue);

  const update = (i: number, patch: Partial<Spot>) =>
    setSpots((prev) => prev.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  const add = () =>
    setSpots((prev) => [
      ...prev,
      { id: newId(), slot: "morning", name: "", images: [], note: "" },
    ]);
  const remove = (i: number) =>
    setSpots((prev) => prev.filter((_, j) => j !== i));

  return (
    <div className="space-y-2.5">
      <input type="hidden" name={name} value={JSON.stringify(spots)} />

      {spots.map((sp, i) => (
        <div
          key={sp.id}
          className="space-y-2 rounded-xl border border-border bg-surface-muted p-2.5"
        >
          <div className="flex items-center gap-2">
            <div className="w-20 shrink-0">
              <Select
                value={sp.slot}
                onChange={(e) => update(i, { slot: e.target.value as Slot })}
              >
                {SLOTS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex-1">
              <TextInput
                value={sp.name}
                onChange={(e) => update(i, { name: e.target.value })}
                placeholder="景点名称"
              />
            </div>
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="删除景点"
              className="shrink-0 p-1.5 text-rose-600"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>

          <TextArea
            value={(sp.images ?? []).join("\n")}
            onChange={(e) =>
              update(i, {
                images: e.target.value
                  .split("\n")
                  .map((x) => x.trim())
                  .filter(Boolean),
              })
            }
            placeholder="图片路径，每行一个，如 /images/colosseo.jpg"
          />

          <TextInput
            value={sp.note ?? ""}
            onChange={(e) => update(i, { note: e.target.value })}
            placeholder="备注（可选）"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="inline-flex w-full items-center justify-center gap-1 rounded-xl border border-dashed border-border py-2 text-sm font-medium text-accent"
      >
        <PlusIcon className="h-4 w-4" /> 添加景点
      </button>
    </div>
  );
}
