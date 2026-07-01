"use client";

import { useState, type ChangeEvent } from "react";
import type { Spot, Slot } from "@/types";
import { TextInput, Select } from "./fields";
import { PlusIcon, TrashIcon, CameraIcon } from "@/components/ui/icons";
import { compressImage } from "@/lib/utils/compress";
import { uploadSpotImage } from "@/app/admin/upload-actions";

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

// 单张缩略图：加载失败（例如仅填了本地路径但文件未放）时显示「缺图」占位，仍可删除。
function Thumb({ src, onRemove }: { src: string; onRemove: () => void }) {
  const [broken, setBroken] = useState(false);
  return (
    <div className="relative h-16 w-16 shrink-0">
      {broken ? (
        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-surface text-[10px] text-muted ring-1 ring-border">
          缺图
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          className="h-16 w-16 rounded-lg object-cover ring-1 ring-border"
          onError={() => setBroken(true)}
        />
      )}
      <button
        type="button"
        onClick={onRemove}
        aria-label="移除图片"
        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-xs leading-none text-white"
      >
        ×
      </button>
    </div>
  );
}

// 景点列表编辑：状态放在 React 里，同步写入隐藏 input(JSON)，随表单提交。
export function SpotsField({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue: Spot[];
}) {
  const [spots, setSpots] = useState<Spot[]>(defaultValue);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const update = (i: number, patch: Partial<Spot>) =>
    setSpots((prev) => prev.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  const add = () =>
    setSpots((prev) => [
      ...prev,
      { id: newId(), slot: "morning", name: "", images: [], note: "" },
    ]);
  const remove = (i: number) =>
    setSpots((prev) => prev.filter((_, j) => j !== i));
  const addImage = (i: number, url: string) =>
    setSpots((prev) =>
      prev.map((s, j) =>
        j === i ? { ...s, images: [...(s.images ?? []), url] } : s,
      ),
    );
  const removeImage = (i: number, k: number) =>
    setSpots((prev) =>
      prev.map((s, j) =>
        j === i
          ? { ...s, images: (s.images ?? []).filter((_, x) => x !== k) }
          : s,
      ),
    );

  const onPick = async (i: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // 允许再次选同一文件
    if (!file) return;
    const id = spots[i].id;
    setError(null);
    setUploading(id);
    try {
      const compressed = await compressImage(file);
      const fd = new FormData();
      fd.append("file", compressed);
      const res = await uploadSpotImage(fd);
      if (res.error) setError(res.error);
      else if (res.url) addImage(i, res.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "上传失败");
    } finally {
      setUploading(null);
    }
  };

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

          {/* 图片：缩略图 + 拍照/选图上传 */}
          <div className="flex flex-wrap items-center gap-2">
            {(sp.images ?? []).map((src, k) => (
              <Thumb key={`${src}-${k}`} src={src} onRemove={() => removeImage(i, k)} />
            ))}
            <label
              className={`flex h-16 w-16 shrink-0 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg border border-dashed border-border text-[10px] text-muted ${
                uploading === sp.id ? "opacity-60" : ""
              }`}
            >
              {uploading === sp.id ? (
                "上传中…"
              ) : (
                <>
                  <CameraIcon className="h-5 w-5" />
                  拍照/选图
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading === sp.id}
                onChange={(e) => onPick(i, e)}
              />
            </label>
          </div>

          <TextInput
            value={sp.note ?? ""}
            onChange={(e) => update(i, { note: e.target.value })}
            placeholder="备注（可选）"
          />
        </div>
      ))}

      {error && <p className="text-sm text-rose-600">{error}</p>}

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
