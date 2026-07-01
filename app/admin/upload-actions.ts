"use server";

import { randomUUID } from "node:crypto";
import { requireAdmin } from "@/lib/auth";
import { serviceClient } from "@/lib/supabase/server";

const BUCKET = "spot-images";

export type UploadResult = { url?: string; error?: string };

// 后台上传景点图片：仅登录管理员可用，用 service_role 写入公开存储桶，返回公开 URL。
export async function uploadSpotImage(formData: FormData): Promise<UploadResult> {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "没有选择文件" };
  if (!file.type.startsWith("image/")) return { error: "只能上传图片" };
  if (file.size > 6 * 1024 * 1024) return { error: "图片过大（压缩后仍超过 6MB）" };

  try {
    const ext =
      (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") ||
      "jpg";
    const path = `${randomUUID()}.${ext}`;
    const bytes = await file.arrayBuffer();

    const db = serviceClient();
    const { error } = await db.storage
      .from(BUCKET)
      .upload(path, bytes, { contentType: file.type || "image/jpeg", upsert: false });
    if (error) return { error: error.message };

    const { data } = db.storage.from(BUCKET).getPublicUrl(path);
    return { url: data.publicUrl };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "上传失败" };
  }
}
