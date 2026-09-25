/**
 * 站点自身的元信息 —— 不属于「何锦诚的内容」，所以不放进 content 文件。
 * 放在这里的中英共用一份：包名和技术栈名称本来就不随语言变，
 * 抄成两份只会制造结构漂移。
 */

export interface TechItem {
  name: string;
  href: string;
}

/**
 * 底栏列出的开源技术栈。
 *
 * 两条标准：只列**真正在用**的（装了但没引用的依赖不要写上去，那是不实陈述），
 * 并且只列**框架与平台这一层**。语言与 CSS 框架是任何现代前端的基线，
 * 写上去不提供信息量，反而把真正能说明「这个站由什么搭起来」的几项稀释掉。
 */
export const TECH_STACK: readonly TechItem[] = [
  { name: 'Next.js', href: 'https://nextjs.org' },
  { name: 'Supabase', href: 'https://supabase.com' },
  { name: 'Vercel AI SDK', href: 'https://ai-sdk.dev' },
  { name: 'OpenCode', href: 'https://opencode.ai' },
];

/** 底栏那两个 logo：表达「本站构建在这两者之上」 */
export const BUILT_ON = [
  { name: 'Vercel', src: '/vercel.svg', href: 'https://vercel.com' },
  { name: 'Next.js', src: '/next.svg', href: 'https://nextjs.org' },
] as const;

/** 项目卡片末尾「更多」的去处 */
export const GITHUB_REPOS_HREF = 'https://github.com/JacksonHe04?tab=repositories';

/**
 * 站点自己的地址。
 *
 * 用于 canonical、Open Graph 的绝对 URL 与结构化数据 —— 这几处都要求绝对地址，
 * 写死在这里比到处拼 request header 靠谱：部署域名会变，而公开地址不会。
 */
export const SITE_URL = 'https://inon.space';

/**
 * 站点归属的 profile。
 *
 * v3 与 world.inon.space 共用同一个 Supabase，也共用同一个 profile —— 访问统计、
 * 收藏条目都挂在这个 id 上。写成常量而不是环境变量：它不是密钥，
 * 而且换掉它意味着换成另一个人的站点，那属于改代码而不是改配置。
 */
export const SITE_PROFILE_ID = '2a9d3a63-41a4-4373-a3dd-e6defd16370e';

/**
 * 访问事件名 —— **与 world 站共用同一个**。
 *
 * 一开始给 v3 起了独立的事件名，想把两个站的流量分开算。但底栏那个数字的含义
 * 是「这个站被看过多少次」，而 v3 是新站：从 0 起算等于把过去两年的访问量抹掉。
 * 共用事件名之后，v3 的访问接着 world 的数据往下累加，读数就是站点的真实总量。
 *
 * 代价是底栏显示了两个域名合起来的量。这是作者明确要的口径。
 * 读取走 `page_view_site_totals`（按事件名读原始事件流，UV 用 ip_hash 去重）。
 */
export const SITE_VIEW_EVENT = 'page_view';
