# inon.space 基础设施总账

> 本文是 inon.space 域名体系的**关系总账**：GitHub 仓库 ↔ 本地目录 ↔ Vercel 项目 ↔ Cloudflare DNS ↔ 对外域名。
> 任何一方改名、换域名、增删记录，都要回来改这里。
> 创建：2026-09-25（Jackson × Claude）。

## 0. 为什么需要这份文档

域名散落在三处（Cloudflare DNS / Vercel 项目域 / GitHub 仓库名），改一处而漏另一处就会出现
「Vercel 绑了域名但 Cloudflare 没记录」（如曾经的 `6pine.inon.space`）或
「DNS 还挂着但 Vercel 已无项目认领」（如曾经的 `inon.inon.space`）这类悬空状态。
本文用于一眼看清全貌并快速定位三处中该改哪一处。

## 1. 核心项目映射（有独立域名）

| 项目 | GitHub | 本地目录 | Vercel 项目 | 对外域名 |
|---|---|---|---|---|
| iNon | `JacksonHe04/inon-space` | `Codes/inon-space` | `inon-space` | `inon.space` + `www` |
| World Engineering | `JacksonHe04/world-engineering` | `Codes/world-engineering` | `world-engineering` | `world.inon.space` |
| OKF Anything | `JacksonHe04/okf-anything` | `Codes/okf-anything` | `okf-anything` | `okf.inon.space` |
| SAYLESS | `JacksonHe04/sayless` | `Codes/sayless` | `sayless` | `sayless.inon.space` + `resume` |
| Leaf 2 Forest | `JacksonHe04/leaf2forest` | `Codes/leaf2forest` | `leaf2forest` | `leaf.inon.space` |
| PINE（私有） | `JacksonHe04/pine` | `Codes/pine` | `6pine` | `pine.inon.space` |
| Treez | `JacksonHe04/treez` | `Codes/treez` | `treez` | `treez.inon.space` |
| PALM | `JacksonHe04/palm` | `Codes/palm` | `palm` | `palmlab.cn`（自有域名，非 inon 子域） |
| storytelling | `JacksonHe04/storytelling` | `Codes/storytelling` | `storytelling` | `story.inon.space` |
| next-claw | `JacksonHe04/next-claw` | `Codes/next-claw` | `next-claw` | `claw.inon.space` |
| Sand（私有） | `JacksonHe04/Sand` | `Codes/Sand` | `sand` | `sand.inon.space` |
| FDE Anything（私有） | `JacksonHe04/fde-anything` | `Codes/fde-anything` | `ondeskbot` | `studio.inon.space` |
| YOYI Studio（私有） | `JacksonHe04/yoyi-studio` | `Codes/yoyi-studio` | `yoyi-studio` | `yoyi.inon.space/studio`（站点 basePath 固定 `/studio`，根路径 307 到它） |

## 2. 本次新分配域名（2026-09-25）

均为 Cloudflare 灰云 CNAME → `cname.vercel-dns.com`，Vercel 侧免验证（`inon.space` 为 team 自有 zone）。

| 域名 | Vercel 项目 | GitHub 仓库 | 可达性（260925 实测） |
|---|---|---|---|
| `maas.inon.space` | `maas-prototype` | `maas-less` | ✅ MaaS 原型 |
| `mas.inon.space` | `multi-agent-system` | `multi-agent-system` | ✅ 多智能体系统实验 |
| `planing.inon.space` | `auto-planing` | `auto-planning` | ✅ 自动规划实验 |
| `flat.inon.space` | `flow-flat` | `flat` | ✅ Flow Flat |
| `quaiz.inon.space` | `quaiz` | `QuAIz` | ✅ QuAIz |
| `bingwen.inon.space` | `bing-wen-book-store` | `bing-wen-book-store` | ✅ Vite App |
| `react.inon.space` | `mini-react-by-ts` | `mini-react-by-ts` | ❌ 404（见 §5.1） |
| `seu-rating.inon.space` | `seu-rating` | `seu-rating` | ❌ 400（见 §5.2） |

## 3. OnDeskBot / FDE 服务链路域名（ECS，非 Vercel）

| 域名 | Cloudflare 模式 | 指向 | 用途 |
|---|---|---|---|
| `api.inon.space` | 橙云 | CF Worker `ondeskbot-api` | Studio API + 设备 HTTP 面 |
| `origin.inon.space` | 橙云 | CNAME → CF Tunnel `ondeskbot-ecs` | Worker 回源专用名（隧道出站回连） |
| `mqtt.inon.space` | 灰云 | A → `59.110.91.111` | 设备 MQTTS 直连（TLS 自管） |

细节唯一事实源：`fde-anything/docs/shared/network-architecture.md`。

## 4. 邮件与验证记录（Cloudflare zone inon.space）

| 记录 | 类型 | 内容 |
|---|---|---|
| `send.inon.space` | MX + TXT | `feedback-smtp.ap-northeast-1.amazonses.com` / `v=spf1 include:amazonses.com ~all` |
| `resend._domainkey.inon.space` | TXT | Resend DKIM 公钥 |
| `send.sayless.inon.space` | MX + TXT | `feedback-smtp.us-east-1.amazonses.com` / 同 SPF |
| `resend._domainkey.sayless.inon.space` | TXT | Resend DKIM 公钥 |
| `_dmarc.inon.space` | TXT | `v=DMARC1; p=none;`（子域继承，无 `rua`） |
| `inon.space` | TXT | `openai-domain-verification=…` |

## 5. 未决问题

### 5.1 `react.inon.space` 返回 404
`mini-react-by-ts` 项目**没有生产部署**（最新部署 2025-06-30，`target` 非 production），
Vercel 边缘无内容可服务。修法：触发一次 production 部署。

### 5.2 `seu-rating.inon.space` 返回 400
应用是 Django，返回 `DisallowedHost`——`ALLOWED_HOSTS` 未包含新域名。
且该项目部署 `target=None`（同样缺生产部署）。修法：改 Django `ALLOWED_HOSTS` + 重新部署。

### 5.3 `world-engineering.vercel.app` 被其他 team 占用
Vercel 全局唯一，`owned-on-other-team`，无法分配给本项目。
该项目当前默认域名仍是旧的 `inon.vercel.app`；如需新的 `.vercel.app` 别名需另选名字或触发部署让 Vercel 自动分配。

### 5.4 `inon-old` 项目冗余
Vercel 项目 `inon-old`（82 天未更新）与 `inon-space` 指向**同一个 GitHub 仓库**（原 `iNon`）。
生产域名 `inon.inon.space` 已移除，现仅剩 `inon-old.vercel.app`。建议归档或删除。

### 5.5 旧 `.vercel.app` 域名残留
改名后项目仍挂着旧默认域名（`inon-space` 项目 → `world-engineering-ai.vercel.app`，
`world-engineering` 项目 → `inon.vercel.app`）。无害，但清理时注意
`find-yourself.vercel.app` / `yingyingdontkill.vercel.app` 指向它们做 307 重定向。

## 6. 工程注意

- **`*.vercel.app` 在中国大陆被 DNS 污染**（实测 `auto-planing.vercel.app` → `210.56.51.192`，
  `seu-rating.vercel.app` → `128.242.250.157`，均非 Vercel 真 IP）。这就是必须自建二级域名的根因。
- Vercel 自定义域名统一用 Cloudflare **灰云（DNS only）**：TLS 由 Vercel 端点签发，与
  「TLS 在服务端点终结」原则一致；走橙云会导致证书链与验证冲突。
- 主站域名（`inon.space` / `www`）用 A 记录 `76.76.21.21` 与 `cname.vercel-dns.com`，
  是通用目标，迁移项目时无需改 Cloudflare；而 `<hash>.vercel-dns-017.com` 是项目相关的，迁移时必须同步。
