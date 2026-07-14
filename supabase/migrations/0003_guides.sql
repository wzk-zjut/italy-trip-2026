-- =====================================================================
-- 实用贴士 / 攻略（guides）表 —— 在 Supabase SQL Editor 里整段粘贴执行一次。
-- 建表 + RLS + updated_at 触发器 + 两条示例。
-- =====================================================================
create table if not exists public.guides (
  id          text primary key default gen_random_uuid()::text,
  icon        text,
  title       text not null,
  category    text,
  content     text not null default '',
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists trg_guides_updated on public.guides;
create trigger trg_guides_updated before update on public.guides
  for each row execute function public.set_updated_at();

alter table public.guides enable row level security;
create policy "guides public read" on public.guides for select using (true);
create policy "guides auth write" on public.guides
  for all to authenticated using (true) with check (true);

-- 示例数据（content 用 $g$...$g$ 包裹，支持换行与特殊字符）
insert into public.guides (id, icon, title, category, content, sort_order) values
  (
    'guide-transport', '🚇', '地铁 / 火车怎么坐', '交通',
    $g$城市内：用 Google Maps 或 Citymapper 输入目的地，跟着地铁/公交走即可。
城际高铁：Trenitalia（红/银箭）与 Italo 两家，官网或 App 提前买更便宜；认准站名（罗马 Termini、佛罗伦萨 S.M.N.、米兰 Centrale、威尼斯 S. Lucia）。
纸质票上车前在站台打票机验票，电子票免验。

小红书搜「意大利高铁购票」有详细图文 👉 https://www.xiaohongshu.com/$g$,
    1
  ),
  (
    'guide-food', '🍝', '怎么找附近好吃的餐馆', '餐饮',
    $g$Google Maps 搜「restaurant」或「trattoria」，按评分和评论数排，避开景点门口的游客店。
菜单上「coperto」是餐位费，属正常；小费非强制。
想吃地道的：找本地人多、菜单没有一堆外语翻译的小馆子。

小红书搜「罗马 / 佛罗伦萨 美食」有很多本地推荐 👉 https://www.xiaohongshu.com/$g$,
    2
  )
on conflict (id) do nothing;
