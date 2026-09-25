<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# inon.space

何锦诚的个人主页。一份结构化内容文件驱动全部页面，右侧挂着一个任何访客都能插话的 AI 群聊。

- 所有过程中的设计、规划、开发方案、报告、验收、测试结果等文档，都务必放置在 `.agents/docs/` 下以文件创建日期命名的子目录中（格式为 `YYMMDD`，例如 `260706`）。
- 提交务必遵循 `~/.agents/skills/git-commit`：分批提交，单次 diff 不超过 1000 行。

## 产品

### 四个 tab

| tab | 路由 |
| --- | --- |
| HOME | `/` |
| LIFE | `/life` |
| GALLERY | `/gallery/[category]/[tab]` |
| WORLD | 离站外链 `world.inon.space`，新标签页打开 |

GALLERY 没有总览层。`/gallery` 与 `/gallery/[category]` 都只做 redirect，落到第一个分栏——同一批条目只允许存在一个 URL。

### 全站都是动态渲染，这是语言的代价

语言存在 cookie 里，所以每个页面都必须按请求渲染。`next build` 的输出里**每一条路由都是 `ƒ`**，没有任何静态页。

曾经不是这样：只有中文时 `/life` 是静态、GALLERY 分栏页是 `revalidate = 3600`。加了英文之后这两个都退化成动态，`revalidate` 不再起作用——**别再往页面里加 `revalidate` 或 `dynamic = 'force-static'`，它们不会生效，只会让人误判**。

代价是 GALLERY 每次请求都查一次 Supabase。条目变化频率是「天」级，所以正确的修法是把缓存下沉到数据层（`unstable_cache` 包住 `fetchGalleryItems`），而不是把页面变回静态——两者不可兼得。

### 内容的两个住处

改动前先判断自己属于哪一侧：

| 内容 | 放哪 | 为什么 |
| --- | --- | --- |
| 人本身（称呼、方向、经历、联系、项目、LIFE 全部、四个收藏分类名） | `data/content.zh.ts` | 长度是「一个人能读完」的量级 |
| 收藏条目（专辑 / 单曲 / 创作者） | Supabase `library_items` | 会持续增长，不适合进内容文件 |

「人读得完」正是不需要 RAG 的原因：`lib/content/chat-context.ts` 把内容文件拍平成 Markdown，直接作为模型 system prompt 的唯一事实来源，不裁剪、不摘要——摘要是另一种失真。

### 语言

语言存在 cookie `inon_locale`，**不体现在 URL 上**：切语言不跳转、不改地址栏。

只有一种语言时 `getRequestLocale()` 刻意不读 cookie——读 cookie 会让整站退化成动态渲染，而这时候读与不读的结果完全一样。现在有了 `zh` 和 `en` 两种，所以 cookie 每请求都会读（见上面「全站都是动态渲染」）。

再加一种语言要做三件事，别漏：

1. 加进 `lib/i18n.ts` 的 `LOCALES`
2. 新建 `data/content.<locale>.ts`，**只翻译文字，id / 链接 / logo 路径与中文文件逐字一致**
3. 在 `lib/content/index.ts` 的 `CONTENT` 里注册

顶栏的语言切换器会自动出现，其余代码不用动。

需要插值的文案一律写成 `{name}` 占位符，由 `lib/template.ts` 填充。函数跨不过 Server / Client Component 的边界，所以 `labels` 里只能放纯数据——写错会在运行时抛 *Functions cannot be passed directly to Client Components*。

### 群聊

```
访客发言 → POST /api/chat → 落库（visitor）
                          → 取最近 40 条做上下文
                          → 模型输出 JSON { reply, suggestedQuestions }
                          → 落库（assistant）
浏览器 → Supabase Realtime 订阅 INSERT，别人发的消息实时出现
```

模型入口是 `lib/ai.ts`，走 OpenRouter，用 AI SDK 的 OpenAI 兼容适配器接入。**代码里不出现模型名**，换模型只改 `AI_MODEL` 环境变量。人设与输出 schema 在 `lib/chat/persona.ts`。

四条不能破坏的边界：

- **头像不存图**。seed → FNV-1a → 色相 + 六种几何图形之一，确定性推导（`lib/chat/avatar.ts`）。
- **不存原始 IP**。只存加盐 SHA-256 的前 16 位，用来判断「是不是同一个人」。salt 取自 `ANALYTICS_IP_SALT`；回落到代码里那个硬编码值时，等于隐私保护失效——salt 公开意味着任何人都能枚举 IPv4 空间把访客 IP 反推出来。
- **节流放数据库**，不放内存（`isRateLimited`）。serverless 实例随时会换，内存计数器拦不住。同一访客 8 秒冷却。
- **匿名只能读**。`chat_messages` 对匿名只开放 select，不开放 insert；所有写入走服务端 secret key。否则任何人都能伪造 assistant 身份发言。

服务端只回稳定错误码（`rate_limited` / `too_long` / `empty` / `model_failed`），文案由客户端从 `labels` 取，保证多语言下正确。

## 技术

- Next.js 16 App Router + React 19 + TypeScript，React Compiler 已开启
- Tailwind 4 + shadcn（`style: radix-nova`），语义色 token 在 `app/globals.css`
- 数据：Supabase（`library_items` / `chat_messages`）
- 模型：Vercel AI SDK + OpenRouter
- 其他技术请见 `package.json`，务必物尽其用，不要重复造轮子

### 视觉

学者风格打底。两条已经定下的约束：

- **正文一律衬线**。`--font-sans` 与 `--font-serif` 同栈（Source Serif 4），这样某处漏用 `font-serif` 也不会突然变无衬线。
- **近直角**。圆角 token 压在 1–4px，靠细分隔线分区，不用卡片阴影堆叠。

## 开发规范

- 密钥只放 `.env.local`，不进仓库。生产环境变量在 Vercel 上配（`production` + `preview` 两个目标）。**两边都要动**，否则本地通了线上还是空的。
- 改了环境变量记得重启 dev server：`NEXT_PUBLIC_*` 是编译期内联，不重启不生效。
- `getSupabaseBrowserClient()` 在缺变量时直接抛错——它不会静默降级，只在浏览器控制台报错。
