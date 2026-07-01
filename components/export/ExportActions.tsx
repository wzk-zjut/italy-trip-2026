"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CopyIcon, DownloadIcon, FileTextIcon, CheckIcon } from "@/components/ui/icons";

export function ExportActions({ markdown }: { markdown: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 剪贴板不可用时的兜底：提示用户手动从预览里复制
      alert("复制失败，请展开下方预览手动全选复制。");
    }
  };

  const download = () => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "意大利旅行2026.md";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3">
      {/* 导出 PDF */}
      <section className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
        <h2 className="flex items-center gap-1.5 text-base font-semibold text-foreground">
          <DownloadIcon className="h-4 w-4 text-accent" />
          导出 PDF
        </h2>
        <p className="mt-1 text-sm text-muted">
          用于手机离线查看。打开打印页，点「保存为 PDF」。
        </p>
        <Link
          href="/export/print"
          className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white"
        >
          导出 PDF
        </Link>
      </section>

      {/* 导出 Markdown */}
      <section className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
        <h2 className="flex items-center gap-1.5 text-base font-semibold text-foreground">
          <FileTextIcon className="h-4 w-4 text-accent" />
          导出 Markdown
        </h2>
        <p className="mt-1 text-sm text-muted">
          可粘贴到飞书 / 腾讯文档，或继续编辑。
        </p>
        <div className="mt-3 flex gap-2">
          <Button onClick={copy} className="flex-1">
            {copied ? (
              <>
                <CheckIcon className="h-4 w-4" /> 已复制
              </>
            ) : (
              <>
                <CopyIcon className="h-4 w-4" /> 复制 Markdown
              </>
            )}
          </Button>
          <Button variant="secondary" onClick={download} className="flex-1">
            <DownloadIcon className="h-4 w-4" /> 下载 .md
          </Button>
        </div>

        <details className="mt-3">
          <summary className="cursor-pointer text-sm text-muted">预览</summary>
          <pre className="mt-2 max-h-96 overflow-auto rounded-lg bg-surface-muted p-3 text-xs leading-relaxed whitespace-pre-wrap text-foreground">
            {markdown}
          </pre>
        </details>
      </section>
    </div>
  );
}
