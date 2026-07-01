import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { CalendarIcon } from "@/components/ui/icons";

export default function NotFound() {
  return (
    <div className="pt-10">
      <EmptyState
        icon={<CalendarIcon className="h-8 w-8" />}
        title="找不到这一页"
        description="链接可能有误，或该内容尚未创建。"
        action={
          <Link href="/" className="text-sm font-medium text-accent">
            ← 返回行程首页
          </Link>
        }
      />
    </div>
  );
}
