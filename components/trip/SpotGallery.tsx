"use client";

import { useState } from "react";

// 横向滑动的景点图集。点击图可在新标签打开原图。
// onError 兜底：外链失效的图片自动隐藏，不留坏图。
export function SpotGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [broken, setBroken] = useState<Record<number, boolean>>({});
  if (!images.some((_, i) => !broken[i])) return null;

  return (
    <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
      {images.map((src, i) =>
        broken[i] ? null : (
          <a
            key={i}
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="block shrink-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              loading="lazy"
              onError={() => setBroken((b) => ({ ...b, [i]: true }))}
              className="h-28 w-40 rounded-xl object-cover ring-1 ring-border"
            />
          </a>
        ),
      )}
    </div>
  );
}
