# inon.space

> 何锦诚的个人主页 —— 一份不用点击就能读完的自我介绍，和一个任何人都能插话的公共群聊。

**[inon.space](https://inon.space)**

## 这是什么

绝大多数个人主页是「菜单式」的：想看经历点一下，想看项目再点一下。inon.space 反过来——把该被看到的东西一次摊开，再放一个活的东西留住路过的人。

站点由四个 tab 组成：HOME 是主页，LIFE 是更私人一面的展开，GALLERY 是收藏，WORLD 通向另一座可以走进去的世界。

## HOME：摊开的自我介绍，加一个活的群聊

左半边一次给完：方向、经历（带机构 logo 与年份）、联系方式（一排真实 logo）。这些区块刻意**不加标题**——一行关键词、一段带 logo 的时间线、一排图标，形式本身已经说明了它们是什么；加标题只会把首屏撑高、稀释掉 5 秒内该被看到的东西。

右半边是一个**公共群聊**，里面住着「小缨缨」——何锦诚的数字分身。它不是客服：

- 任何访客发的话都永久留在墙上、所有人可见，模型也看得见全部历史
- 它只依据内容文件说话，资料里没有的直说不知道，不编造
- 每次回复附带 3 个「接下来可以问什么」，显示在所有人的输入框上方
- 别人发的消息通过 Supabase Realtime 实时出现，不用刷新

下方是项目卡片墙。每张卡片有两个去处：标题进项目本身，右上角 GitHub 图标进仓库。没开源的项目不渲染那个图标，而不是画一个灰色不可点的——那会让人以为点错了。

## LIFE

成长经历、学历（从本科一路到小学，本科带导师）、关键词与价值标签、偏好、观念，以及一些别人做的东西——并署上是谁做的。

## GALLERY

四个分类：INDIE / ROCK、HIPHOP、READING、FILMS。

音乐按「专辑 / 单曲 / 创作者」分栏，读书与影视按「作品 / 创作者」分栏。数据库里的 `work` 在音乐下叫专辑、在别处叫作品，所以分栏规则随分类变，不是固定的一套。

## WORLD

离站外链，指向 [world.inon.space](https://world.inon.space)，新标签页打开。

## 一些刻意的取舍

### 内容分两处放，因为它们的增长方式不同

- **人本身的内容**（称呼、方向、经历、项目、LIFE 全部、四个收藏分类名）放在 `data/content.zh.ts`，长度是「一个人能读完」的量级
- **收藏条目**放在 Supabase，它们会持续增长，不适合进内容文件

「一个人能读完」有个直接后果：**不需要 RAG**。整个内容文件拍平成 Markdown 就是模型的 system prompt，不检索、不裁剪、不摘要。

### 语言不体现在 URL 上

语言存在 cookie 里，切语言不跳转、不改地址栏。目前只有中文，所以顶栏的切换器会自动隐藏。

### 群聊的隐私边界

- 不存原始 IP，只存加盐 SHA-256 的前 16 位，用来判断「是不是同一个人」
- 头像不存图，由 seed 确定性推导出色相与图形
- 节流判断放在数据库而不是内存——serverless 实例随时会换，内存计数器拦不住
- `chat_messages` 对匿名只开放读，所有写入走服务端；否则任何人都能伪造 AI 的身份发言

## 技术栈

| | |
| --- | --- |
| 框架 | Next.js 16 App Router · React 19 · TypeScript（React Compiler 已开启） |
| 样式 | Tailwind CSS 4 · shadcn（`radix-nova`）· 正文一律衬线 · 近直角 |
| 数据 | Supabase（`library_items` / `chat_messages` / Realtime） |
| 模型 | Vercel AI SDK · OpenRouter |
| 部署 | Vercel |

## 本地开发

```bash
pnpm install
pnpm dev
```

需要一份 `.env.local`：

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
OPENROUTER_API_KEY=
AI_MODEL=
ANALYTICS_IP_SALT=
```

改了环境变量记得重启 dev server —— `NEXT_PUBLIC_*` 是编译期内联，不重启不生效。

更多设计与实现上的取舍见 [`AGENTS.md`](./AGENTS.md)。
