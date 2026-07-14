import type { Guide } from "@/types";
import { Linkify } from "@/components/ui/Linkify";

export function GuideCard({ guide }: { guide: Guide }) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
      <h3 className="flex flex-wrap items-center gap-2 text-base font-semibold text-foreground">
        {guide.title}
        {guide.category && (
          <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs font-normal text-muted">
            {guide.category}
          </span>
        )}
      </h3>
      {guide.content?.trim() && (
        <div className="mt-2 text-sm leading-relaxed text-foreground">
          <Linkify text={guide.content} />
        </div>
      )}
    </article>
  );
}
