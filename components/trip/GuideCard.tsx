import type { Guide } from "@/types";
import { Linkify } from "@/components/ui/Linkify";

export function GuideCard({ guide }: { guide: Guide }) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
      <div className="flex items-start gap-2">
        {guide.icon && (
          <span className="text-xl leading-none" aria-hidden>
            {guide.icon}
          </span>
        )}
        <div className="min-w-0 flex-1">
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
        </div>
      </div>
    </article>
  );
}
