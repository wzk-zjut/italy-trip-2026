-- =====================================================================
-- 景点图片存储桶（Phase 2 · 图片上传）
-- 公开读取；上传由后台 service_role 完成（绕过 RLS，仅服务端）。
-- 在 Supabase SQL Editor 里执行一次即可。
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('spot-images', 'spot-images', true)
on conflict (id) do nothing;
