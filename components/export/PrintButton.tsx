"use client";

import { Button } from "@/components/ui/Button";
import { DownloadIcon } from "@/components/ui/icons";

export function PrintButton() {
  return (
    <Button onClick={() => window.print()} className="w-full">
      <DownloadIcon className="h-4 w-4" />
      打印 / 保存为 PDF
    </Button>
  );
}
