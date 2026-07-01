# 意大利旅行 2026

一个 **mobile-first 的意大利旅行攻略网页应用**。打开链接就能看今天去哪、住哪、几点、怎么走、哪些票订了、哪些还没订；`/admin` 后台可在手机上随时编辑行程、酒店、票务与备注。

- 路线：罗马 → 佛罗伦萨 → 米兰 → 威尼斯
- 日期：2026.09.24 - 2026.10.03
- 技术栈：Next.js 16（App Router）· React 19 · TypeScript · Tailwind CSS v4 · Supabase（Phase 2）

## 两个阶段（Phase）

| | 数据来源 | 后台登录 | 适用 |
|---|---|---|---|
| **Phase 1（当前默认）** | 本地 `data/*.json` | 环境变量口令 `ADMIN_PASSCODE` | 本地 `npm run dev`、自有可写盘服务器 |
| **Phase 2（可选，已备好）** | Supabase | 同上（或换 Supabase Auth） | Vercel 等无服务器部署、多设备同步 |

> ⚠️ **重要**：Phase 1 的后台编辑会把数据写回本地 `data/*.json`，**只在可写文件系统上持久化**（你自己电脑 `npm run dev`、或有可写盘的服务器）。**Vercel 等无服务器是只读的，编辑不会保存**。要实现「旅途中手机随时改、同行人也能同步看到」，请切换到 Phase 2（Supabase）。

---

## 快速开始（Phase 1，本地 JSON）

```bash
npm install

# 准备环境变量
cp .env.example .env.local
# 打开 .env.local，至少修改：
#   ADMIN_PASSCODE   -> 你自己的后台口令
#   SESSION_SECRET   -> 随机长字符串，可用: openssl rand -hex 32

npm run dev
# 打开 http://localhost:3000
```

- 公开页：`/`（行程）、`/day/2026-09-26`（每日详情）、`/hotels`（酒店）、`/bookings`（票务）
- 后台：`/admin`（需用 `ADMIN_PASSCODE` 登录）

> 本仓库已附带一份可直接运行的种子数据（10 天行程、4 家酒店、6 项票务）。不含任何真实订单号、票码或护照信息。

---

## 给景点加图片（本地静态图，无需上传）

每一天的「上午/下午/晚上」下都能挂若干**景点**，每个景点可放一张或多张图。图片用本地静态文件，**不需要后台上传**：

1. 把图片文件放进 [`public/images/`](public/images/)。
2. 页面里用 `/images/<文件名>` 引用（`public/images/colosseo.jpg` ↔ `/images/colosseo.jpg`）。
3. **文件没放时不显示、也不报错**；放进去刷新即出现。

种子数据已为每个景点预留了建议文件名（清单见 [public/images/README.md](public/images/README.md)）——按名字丢照片进去就能显示。要改文件名、加图或新增景点，去 `/admin` → 对应那天 → 「景点 / 图片」里编辑（每行一个路径，可多张）。

---

## 目录结构

```txt
app/
  layout.tsx                   根布局（移动端容器 + 底部导航）
  page.tsx                     公开首页（行程时间线）
  loading.tsx / not-found.tsx  加载骨架 / 404
  day/[date]/page.tsx          每日详情
  hotels/page.tsx              酒店页
  bookings/page.tsx            票务页
  admin/
    login/page.tsx             后台登录
    auth-actions.ts            登录/登出 Server Action
    data-actions.ts            行程/酒店/票务 增删改 Server Action（含私密备注）
    (protected)/               登录后才可见（middleware 已在渲染前拦截）
      layout.tsx               后台外壳（顶部标签 + 退出）
      page.tsx                 后台概览
      days/ hotels/ bookings/  各自的编辑列表页
components/
  trip/    TripHeader · DayTimeline · DayCard · HotelCard · BookingCard
  admin/   AdminDayEditor · AdminHotelEditor · AdminBookingEditor · Drawer · fields · DeleteButton · AdminTabs
  ui/      PaceBadge · StatusBadge · SectionCard · EmptyState · LoadingState · Button · BottomNav · icons
lib/
  data/    repository.ts（接口）· json-repository.ts · supabase-repository.ts · index.ts（后端选择器）
  supabase/server.ts           Supabase 服务端客户端（anon 只读 / service_role 写入）
  auth.ts                      口令校验 + HMAC 签名 cookie
  utils/   date.ts · labels.ts
types/index.ts                 TripDay / Hotel / Booking / PrivateNote
data/                          Phase 1 数据源（4 个 JSON）
supabase/
  migrations/0001_init.sql     建表 + RLS
  seed.sql                     种子数据（由脚本自动生成）
scripts/generate-seed-sql.mjs  用 data/*.json 生成 seed.sql
middleware.ts                  在渲染前保护 /admin/*
```

数据访问层用 `TripRepository` 接口封装，JSON 与 Supabase 两种实现都遵守它，业务代码与页面在切换后端时无需改动。

---

## 隐私与安全

- 公开三张表（`trip_days` / `hotels` / `bookings`）只含公开安全字段；敏感内容（订单号、票码、门锁密码、联系方式等）一律存到 **`private_notes`**。
- **公开页永不读取 `private_notes`**；只有后台登录后才能查看/编辑私密备注。
- `.env.local` 不入库（`.gitignore` 已忽略 `.env*`，仅保留 `.env.example`）。
- Supabase `service_role` key **只在服务端使用**，绝不加 `NEXT_PUBLIC_` 前缀、绝不发往前端。
- `/admin/*` 由 `middleware.ts` 在渲染前拦截，未登录直接 307 跳转登录页，不会泄露任何后台内容；每个写操作（Server Action）还会二次校验登录态（纵深防御）。

---

## Phase 2：同步到 Supabase

免费额度即可运行。两种方式任选其一。

### 方式 A：Supabase 网页控制台（无需本地 Docker）

1. 在 [supabase.com](https://supabase.com) 新建项目。
2. 打开 **SQL Editor**，把 `supabase/migrations/0001_init.sql` 全文粘贴执行（建表 + RLS）。
3. 再把 `supabase/seed.sql` 全文粘贴执行（灌入种子数据）。
4. 在 **Project Settings → API** 拿到 `Project URL`、`anon` key、`service_role` key。
5. 在 `.env.local` 里填写并切换后端：

   ```env
   DATA_BACKEND=supabase
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
   SUPABASE_SERVICE_ROLE_KEY=xxx   # 仅服务端，切勿泄露
   ```

6. 重启 `npm run dev`。此时读写都走 Supabase。

### 方式 B：Supabase CLI（本地，需要 Docker）

```bash
supabase start
supabase db reset   # 自动执行 migrations/ 与 seed.sql
```

> 若数据有改动，运行 `node scripts/generate-seed-sql.mjs` 可用 `data/*.json` 重新生成 `supabase/seed.sql`。

### RLS 策略说明（已写在 migration 里）

- `trip_days` / `hotels` / `bookings`：`anon` 只读（`select`），`authenticated` 可写。
- `private_notes`：仅 `authenticated` 可读写，`anon` **完全无权限**。
- 后台若用 `service_role`（服务端）写入会绕过 RLS —— 所以该 key 必须只留在服务器。
- 进阶：Phase 2 可把后台登录换成 Supabase Auth（邮箱密码），并在 Supabase 后台手动创建管理员账号、关闭公开注册；届时写入改用登录用户的 JWT，即可不再使用 `service_role`。

---

## 部署到 Vercel

1. 把项目推到 GitHub。
2. 在 [vercel.com](https://vercel.com) 导入该仓库（框架会自动识别 Next.js）。
3. 在 **Project → Settings → Environment Variables** 配置：
   - `ADMIN_PASSCODE`、`SESSION_SECRET`（后台登录必需）
   - 若用 Supabase：`DATA_BACKEND=supabase`、`NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`、`SUPABASE_SERVICE_ROLE_KEY`
4. Deploy。

> **注意**：Vercel 文件系统只读。若不配 Supabase（即仍用 `DATA_BACKEND=json`），公开页能正常显示种子数据，但 `/admin` 的编辑无法保存。要在线可编辑，请先完成 Phase 2。

---

## 可用脚本

```bash
npm run dev     # 本地开发
npm run build   # 生产构建
npm run start   # 运行生产构建
npm run lint    # ESLint
node scripts/generate-seed-sql.mjs   # 由 data/*.json 生成 supabase/seed.sql
```

---

## 后续可优化清单

- [ ] Phase 2 落地：接入 Supabase，实现多设备/多人实时同步。
- [ ] 后台登录改用 Supabase Auth（邮箱密码），去掉服务端 `service_role` 写入。
- [ ] 拖拽调整每日 `sort_order`（目前用数字排序字段）。
- [ ] 每个实体支持多条私密备注 / 附件（附件仅后台可见）。
- [ ] 行程「今天」高亮与快速定位到当天。
- [ ] PWA：添加到主屏、离线缓存（旅途中弱网可用）。
- [ ] 高铁 / 航班的出发到达站与实时提醒。
- [ ] 简单的分享控制（只读链接 token）。

> 取舍原则：优先保证「旅途中手机打开就能快速知道：今天去哪、几点、住哪、怎么走、哪些票订了、哪些还没订」。
