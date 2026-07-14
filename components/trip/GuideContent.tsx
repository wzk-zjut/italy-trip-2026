import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

// 服务端渲染 markdown（不给前端增加 JS 体积）。链接新标签打开；换行保留（remark-breaks）；
// 裸网址自动转链接（remark-gfm）。react-markdown 默认不执行原始 HTML，安全。
const mdComponents: Components = {
  a: ({ node, ...props }) => (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className="break-all font-medium text-accent underline underline-offset-2"
    />
  ),
  p: ({ node, ...props }) => (
    <p {...props} className="my-2 first:mt-0 last:mb-0" />
  ),
  ul: ({ node, ...props }) => (
    <ul {...props} className="my-2 list-disc space-y-1 pl-5" />
  ),
  ol: ({ node, ...props }) => (
    <ol {...props} className="my-2 list-decimal space-y-1 pl-5" />
  ),
  li: ({ node, ...props }) => <li {...props} className="marker:text-muted" />,
  strong: ({ node, ...props }) => (
    <strong {...props} className="font-semibold" />
  ),
  h1: ({ node, ...props }) => (
    <h4 {...props} className="mt-3 mb-1 text-base font-semibold" />
  ),
  h2: ({ node, ...props }) => (
    <h4 {...props} className="mt-3 mb-1 text-base font-semibold" />
  ),
  h3: ({ node, ...props }) => (
    <h4 {...props} className="mt-3 mb-1 text-base font-semibold" />
  ),
  h4: ({ node, ...props }) => (
    <h4 {...props} className="mt-3 mb-1 text-base font-semibold" />
  ),
  blockquote: ({ node, ...props }) => (
    <blockquote
      {...props}
      className="my-2 border-l-2 border-border pl-3 text-muted"
    />
  ),
  code: ({ node, ...props }) => (
    <code
      {...props}
      className="rounded bg-surface-muted px-1 py-0.5 text-[13px]"
    />
  ),
  hr: () => <hr className="my-3 border-border" />,
};

export function GuideContent({
  content,
  className = "",
}: {
  content: string;
  className?: string;
}) {
  return (
    <div
      className={`text-[15px] leading-relaxed text-foreground [word-break:break-word] ${className}`}
    >
      <Markdown remarkPlugins={[remarkGfm, remarkBreaks]} components={mdComponents}>
        {content}
      </Markdown>
    </div>
  );
}
