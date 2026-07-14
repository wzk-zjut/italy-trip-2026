// 把纯文本里的 http(s) 网址自动渲染成可点链接（新标签打开），其余按原文显示、保留换行。
// 纯展示、无副作用，可作为服务端组件使用。仅处理 http/https，安全。
const URL_SPLIT = /(https?:\/\/[^\s]+)/g;
const IS_URL = /^https?:\/\//;

export function Linkify({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const parts = text.split(URL_SPLIT);
  return (
    <span className={`whitespace-pre-wrap break-words ${className}`}>
      {parts.map((part, i) =>
        IS_URL.test(part) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all font-medium text-accent underline underline-offset-2"
          >
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
}
