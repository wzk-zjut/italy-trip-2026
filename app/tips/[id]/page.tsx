import Link from "next/link";
import { notFound } from "next/navigation";
import { getRepository } from "@/lib/data";
import { GuideContent } from "@/components/trip/GuideContent";

export const dynamic = "force-dynamic";

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const guide = (await getRepository().getGuides()).find((g) => g.id === id);
  if (!guide) notFound();

  return (
    <div className="space-y-4">
      <Link
        href="/tips"
        className="inline-flex items-center gap-1 text-sm text-muted"
      >
        <span aria-hidden>←</span> 返回贴士
      </Link>

      <header>
        {guide.category && (
          <p className="text-xs font-medium text-accent">{guide.category}</p>
        )}
        <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-foreground">
          {guide.title}
        </h1>
      </header>

      {guide.content?.trim() && <GuideContent content={guide.content} />}
    </div>
  );
}
